#!/usr/bin/env node
/**
 * Validates an ontology folder against 00-meta/conventions.md.
 *
 *   node tools/validate.mjs [ontology-dir] [--code-root <dir>]
 *
 * Checks: front matter, unique ids, context folder completeness, definitions (concepts, rules, use cases,
 * questions, decisions, relationships, flows, subdomains, actors), that every reference and relative link
 * resolves, required fields of rules and use cases, and that code_refs and code paths quoted in the text
 * exist under the code root (from --code-root, else `code_root` in the ontology README). When the code
 * root does not exist, code checks are skipped with a notice.
 *
 * No dependencies. Node 18+.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTEXT_FILES, ID, ITEM_STATUSES, REQUIRED_KEYS, STATUSES, TYPES, loadOntology } from './lib.mjs';

const args = process.argv.slice(2);
const flag = args.indexOf('--code-root');
const codeRootArg = flag >= 0 ? args.splice(flag, 2)[1] : undefined;
const here = path.dirname(fileURLToPath(import.meta.url));

let model;
try {
  model = loadOntology(args[0] ?? path.join(here, '..'), { codeRoot: codeRootArg });
} catch (err) {
  console.error(err.message);
  process.exit(2);
}

const errors = [];
const warnings = [];
const where = (file, line) => `${model.rel(file)}${line ? `:${line}` : ''}`;
const error = (file, line, message) => errors.push(`${where(file, line)}  ${message}`);
const warn = (file, line, message) => warnings.push(`${where(file, line)}  ${message}`);

for (const p of model.problems) (p.level === 'error' ? error : warn)(p.file, p.line, p.message);

// ------------------------------------------------------------------ front matter

const ids = new Map();
for (const { file, fm } of model.docs) {
  if (!fm) {
    error(file, 1, 'missing front matter');
    continue;
  }
  for (const key of REQUIRED_KEYS) {
    if (!fm[key] || (Array.isArray(fm[key]) && fm[key].length === 0)) error(file, 1, `front matter: missing "${key}"`);
  }
  if (fm.type && !(fm.type in TYPES)) error(file, 1, `front matter: unknown type "${fm.type}"`);
  if (fm.status && !STATUSES.has(fm.status)) error(file, 1, `front matter: unknown status "${fm.status}"`);
  if (fm.last_reviewed === 'YYYY-MM-DD') warn(file, 1, 'last_reviewed is still the template placeholder');
  else if (fm.last_reviewed && !/^\d{4}-\d{2}-\d{2}$/.test(fm.last_reviewed)) error(file, 1, 'last_reviewed must be YYYY-MM-DD');
  if (typeof fm.id === 'string' && fm.id.includes('<')) warn(file, 1, `id "${fm.id}" is still a placeholder`);
  if (fm.id) {
    if (ids.has(fm.id)) error(file, 1, `duplicate id "${fm.id}" (also in ${model.rel(ids.get(fm.id))})`);
    else ids.set(fm.id, file);
  }
  if (fm.type === 'decision' && !/^ADR-\d{3}$/.test(fm.id ?? '')) error(file, 1, 'decision id must be ADR-<NNN>');
  if (fm.type === 'context') {
    if (fm.context !== fm.id) error(file, 1, 'context README: "context" must equal "id"');
    if (!/^[A-Z]{2,4}$/.test(fm.code ?? '')) error(file, 1, 'context README: "code" must be 2-4 capital letters');
    if (!['core', 'supporting', 'generic'].includes(fm.classification)) error(file, 1, 'context README: classification must be core, supporting or generic');
    if (!fm.subdomain) error(file, 1, 'context README: missing "subdomain"');
    else if (model.subdomains.size > 0 && !model.subdomains.has(fm.subdomain)) error(file, 1, `context README: unknown subdomain ${fm.subdomain}`);
  }
  if (fm.type && TYPES[fm.type]) {
    const ctx = model.contexts.get(fm.context);
    if (!fm.context) error(file, 1, `front matter: type "${fm.type}" needs "context"`);
    else if (!ctx) error(file, 1, `front matter: unknown context "${fm.context}"`);
    else if (!path.dirname(file).startsWith(ctx.dir)) error(file, 1, `file is outside the folder of context "${fm.context}"`);
  }
  if (fm.type === 'aggregate' && fm.context && !fm.id?.startsWith(`${fm.context}.`)) error(file, 1, `aggregate id must start with "${fm.context}."`);
}

// ------------------------------------------------------------------ context folders

for (const [name, { dir }] of model.contexts) {
  for (const required of CONTEXT_FILES) {
    if (!fs.existsSync(path.join(dir, required))) error(path.join(dir, required), 0, `context ${name}: missing ${required}`);
  }
  const aggregates = path.join(dir, 'aggregates');
  const count = fs.existsSync(aggregates) ? fs.readdirSync(aggregates).filter((f) => f.endsWith('.md') && !f.startsWith('_')).length : 0;
  if (count === 0) error(aggregates, 0, `context ${name}: needs at least one aggregate file`);
}

// ------------------------------------------------------------------ rule and use-case fields

for (const rule of model.rules.values()) {
  if (!rule.fields.Statement) error(rule.file, rule.line + 1, `${rule.id}: missing "- **Statement:**"`);
  checkStatus(rule);
}
for (const uc of model.useCases.values()) {
  for (const field of ['Actor', 'Goal', 'Main flow']) {
    if (!(field in uc.fields)) error(uc.file, uc.line + 1, `${uc.id}: missing "- **${field}:**"`);
  }
  checkStatus(uc);
}

function checkStatus(item) {
  const status = /^[\w-]+/.exec(item.fields.Status ?? '')?.[0];
  if (!status) error(item.file, item.line + 1, `${item.id}: missing "- **Status:**"`);
  else if (!ITEM_STATUSES.has(status)) error(item.file, item.line + 1, `${item.id}: unknown status "${status}"`);
}

// ------------------------------------------------------------------ references

/** Checks `path` or `path#Symbol` under the code root. */
function checkCodeRef(file, line, ref, strict) {
  if (!model.codeAvailable) return;
  const [relPath, symbol] = ref.split('#');
  const full = path.join(model.codeRoot, relPath);
  if (!fs.existsSync(full)) {
    (strict ? error : warn)(file, line, `code path not found under code root: ${relPath}`);
    return;
  }
  if (symbol && fs.statSync(full).isFile() && !fs.readFileSync(full, 'utf8').includes(symbol)) {
    error(file, line, `symbol "${symbol}" not found in ${relPath}`);
  }
}

const idChecks = [
  [ID.rule, model.rules, 'rule'],
  [ID.useCase, model.useCases, 'use case'],
  [ID.question, model.questions, 'open question'],
  [ID.decision, model.decisions, 'decision'],
  [ID.rel, model.relationships, 'relationship'],
  [ID.flow, model.flows, 'flow'],
  [ID.subdomain, model.subdomains, 'subdomain'],
  [ID.actor, model.actors, 'actor'],
];

for (const { file, fm, prose, bodyStart } of model.docs) {
  if (!fm) continue;
  // Meta files explain the format with illustrative ids and paths; only their links are checked.
  const illustrative = fm.type === 'meta';

  for (let i = bodyStart; i < prose.length; i += 1) {
    const line = prose[i];

    for (const match of line.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/.test(target) || target.includes('<')) continue;
      const resolved = path.resolve(path.dirname(file), decodeURIComponent(target.split('#')[0]));
      if (!fs.existsSync(resolved)) error(file, i + 1, `broken link: ${target}`);
    }

    if (illustrative) continue;

    for (const [pattern, map, kind] of idChecks) {
      // Only check kinds that the ontology defines somewhere, so a half-built ontology is not noisy.
      if (map.size === 0 && kind !== 'rule' && kind !== 'use case') continue;
      for (const match of line.matchAll(pattern)) {
        if (!map.has(match[0])) error(file, i + 1, `unknown ${kind} ${match[0]}`);
      }
    }

    for (const match of line.matchAll(/`([A-Z][A-Za-z0-9]*)\.([A-Z][A-Za-z0-9]*)/g)) {
      if (!model.contexts.has(match[1])) continue;
      const name = `${match[1]}.${match[2]}`;
      if (!model.concepts.has(name)) error(file, i + 1, `unknown concept ${name}`);
    }
  }
}

for (const c of model.citations) checkCodeRef(c.file, c.frontMatter ? 1 : c.line + 1, c.symbol ? `${c.path}#${c.symbol}` : c.path, c.frontMatter);

if (!model.index) error(path.join(model.root, 'README.md'), 0, 'no file with type "index" (the ontology README)');
else {
  const indexText = model.index.lines.join('\n');
  for (const [name, { dir }] of model.contexts) {
    const link = path.relative(path.dirname(model.index.file), path.join(dir, 'README.md')).split(path.sep).join('/');
    if (!indexText.includes(link)) warn(model.index.file, 0, `context ${name} is not linked from the index (${link})`);
  }
}

// ------------------------------------------------------------------ report

for (const line of warnings) console.log(`warning  ${line}`);
for (const line of errors) console.log(`error    ${line}`);
if (model.codeNotice) console.log(`notice   ${model.codeNotice}`);
console.log(
  `\n${model.docs.length} files, ${model.contexts.size} contexts, ${model.concepts.size} concepts, ` +
    `${model.rules.size} rules, ${model.useCases.size} use cases: ${errors.length} error(s), ${warnings.length} warning(s).`,
);
process.exit(errors.length > 0 ? 1 : 0);
