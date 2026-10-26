#!/usr/bin/env node
/**
 * Validates an ontology folder against 00-meta/conventions.md.
 *
 *   node tools/validate.mjs [ontology-dir] [--code-root <dir>]
 *
 * Checks: front matter, unique ids, context folder completeness, rule and concept definitions, that every
 * referenced rule / concept / relative link exists, and that code_refs (and code paths quoted in the
 * text) exist under the code root. The code root comes from --code-root, else from `code_root` in the
 * ontology README, resolved relative to the ontology folder; when it does not exist, code checks are
 * skipped with a notice.
 *
 * No dependencies. Node 18+.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Every allowed `type`, and whether it belongs to a bounded context. */
const TYPES = {
  index: false,
  meta: false,
  'domain-vision': false,
  subdomains: false,
  actors: false,
  glossary: false,
  'context-map': false,
  flows: false,
  context: true,
  'ubiquitous-language': true,
  aggregate: true,
  'value-objects': true,
  'business-rules': true,
  commands: true,
  'domain-events': true,
  'read-models': true,
};

/** Types whose `###` headings define model concepts. */
const CONCEPT_TYPES = new Set(['aggregate', 'value-objects', 'commands', 'domain-events', 'read-models']);
const STATUSES = new Set(['draft', 'proposed', 'implemented', 'deprecated']);
const RULE_STATUSES = new Set(['implemented', 'partial', 'not-implemented', 'deprecated']);
const REQUIRED_KEYS = ['id', 'type', 'status', 'last_reviewed'];
const CONTEXT_FILES = [
  'README.md',
  'ubiquitous-language.md',
  'value-objects.md',
  'business-rules.md',
  'commands.md',
  'domain-events.md',
  'read-models.md',
];
const CODE_PATH = /^[\w@.\-/[\]()]+\/[\w@.\-[\]()]+\.(ts|tsx|js|jsx|mjs|cjs|py|cs|java|kt|go|rb|rs|php|sql|json|ya?ml)$/;

// ------------------------------------------------------------------ arguments

const args = process.argv.slice(2);
const flag = args.indexOf('--code-root');
const codeRootArg = flag >= 0 ? args.splice(flag, 2)[1] : undefined;
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(args[0] ?? path.join(here, '..'));

const errors = [];
const warnings = [];
const error = (file, line, message) => errors.push(`${rel(file)}${line ? `:${line}` : ''}  ${message}`);
const warn = (file, line, message) => warnings.push(`${rel(file)}${line ? `:${line}` : ''}  ${message}`);
const rel = (file) => path.relative(root, file).split(path.sep).join('/');

// ------------------------------------------------------------------ parsing

/** Lists the ontology's Markdown files, skipping templates (`_*`), hidden entries and tools/. */
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full !== path.join(root, 'tools')) out.push(...walk(full));
    } else if (entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

/** Minimal YAML front matter: `key: value`, `key: [a, b]` and block lists of `- item`. */
function parseFrontMatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text);
  if (!match) return { data: null, bodyStart: 0 };
  const data = {};
  let listKey = null;
  for (const raw of match[1].split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, '');
    if (!line.trim()) continue;
    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && listKey) {
      data[listKey].push(unquote(item[1]));
      continue;
    }
    const pair = /^([\w-]+):\s*(.*)$/.exec(line);
    if (!pair) continue;
    const [, key, value] = pair;
    if (value === '') {
      data[key] = [];
      listKey = key;
    } else if (value.startsWith('[')) {
      data[key] = value.replace(/^\[|\]$/g, '').split(',').map(unquote).filter(Boolean);
      listKey = null;
    } else {
      data[key] = unquote(value);
      listKey = null;
    }
  }
  return { data, bodyStart: match[0].split(/\r?\n/).length - 1 };
}

function unquote(value) {
  return value.trim().replace(/^(['"])(.*)\1$/, '$2');
}

/** Body lines with fenced code blocks blanked out, so examples are not read as references. */
function proseLines(lines) {
  let fenced = false;
  return lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      return '';
    }
    return fenced ? '' : line;
  });
}

// ------------------------------------------------------------------ load

if (!fs.existsSync(root)) {
  console.error(`Ontology folder not found: ${root}`);
  process.exit(2);
}

const docs = walk(root).map((file) => {
  const text = fs.readFileSync(file, 'utf8');
  const { data, bodyStart } = parseFrontMatter(text);
  const lines = text.split(/\r?\n/);
  return { file, fm: data, lines, bodyStart };
});

// ------------------------------------------------------------------ front matter

const ids = new Map();
const contexts = new Map(); // name -> { code, dir }

for (const doc of docs) {
  const { file, fm } = doc;
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
    if (ids.has(fm.id)) error(file, 1, `duplicate id "${fm.id}" (also in ${rel(ids.get(fm.id))})`);
    else ids.set(fm.id, file);
  }
  if (fm.type === 'context') {
    if (fm.context !== fm.id) error(file, 1, 'context README: "context" must equal "id"');
    if (!/^[A-Z]{2,4}$/.test(fm.code ?? '')) error(file, 1, 'context README: "code" must be 2-4 capital letters');
    if (!['core', 'supporting', 'generic'].includes(fm.classification)) error(file, 1, 'context README: classification must be core, supporting or generic');
    if (!fm.subdomain) error(file, 1, 'context README: missing "subdomain"');
    for (const [name, other] of contexts) {
      if (other.code === fm.code) error(file, 1, `context code "${fm.code}" already used by ${name}`);
    }
    contexts.set(fm.id, { code: fm.code, dir: path.dirname(file) });
  }
}

for (const doc of docs) {
  const { file, fm } = doc;
  if (!fm?.type || !TYPES[fm.type]) continue;
  if (!fm.context) error(file, 1, `front matter: type "${fm.type}" needs "context"`);
  else if (!contexts.has(fm.context)) error(file, 1, `front matter: unknown context "${fm.context}"`);
  else if (!path.dirname(file).startsWith(contexts.get(fm.context).dir)) error(file, 1, `file is outside the folder of context "${fm.context}"`);
}

// ------------------------------------------------------------------ context folders

for (const [name, { dir }] of contexts) {
  for (const required of CONTEXT_FILES) {
    if (!fs.existsSync(path.join(dir, required))) error(path.join(dir, required), 0, `context ${name}: missing ${required}`);
  }
  const aggregates = path.join(dir, 'aggregates');
  const count = fs.existsSync(aggregates) ? fs.readdirSync(aggregates).filter((f) => f.endsWith('.md') && !f.startsWith('_')).length : 0;
  if (count === 0) error(aggregates, 0, `context ${name}: needs at least one aggregate file`);
}

// ------------------------------------------------------------------ definitions

const concepts = new Map(); // "Context.Name" -> file
const rules = new Map(); // "ORD-BR-001" -> file

function defineConcept(name, file, line) {
  if (concepts.has(name)) error(file, line, `concept ${name} is defined twice (also in ${rel(concepts.get(name))})`);
  else concepts.set(name, file);
}

for (const doc of docs) {
  const { file, fm, lines, bodyStart } = doc;
  if (!fm?.context || !contexts.has(fm.context)) continue;
  const prose = proseLines(lines);

  if (fm.type === 'aggregate' && fm.id) {
    if (!fm.id.startsWith(`${fm.context}.`)) error(file, 1, `aggregate id must start with "${fm.context}."`);
    else defineConcept(fm.id, file, 1);
  }

  for (let i = bodyStart; i < prose.length; i += 1) {
    const heading = /^###\s+(.+?)\s*$/.exec(prose[i]);
    if (!heading) continue;
    const text = heading[1];

    if (fm.type === 'business-rules') {
      const rule = /^([A-Z]{2,4})-BR-(\d{3})\b/.exec(text);
      if (!rule) {
        error(file, i + 1, `rule heading must start with <CODE>-BR-<NNN>: "${text}"`);
        continue;
      }
      const id = rule[0];
      if (rule[1] !== contexts.get(fm.context).code) error(file, i + 1, `${id}: prefix must be this context's code ${contexts.get(fm.context).code}`);
      if (rules.has(id)) error(file, i + 1, `rule ${id} is defined twice`);
      rules.set(id, file);
      checkRuleFields(file, i, prose, id);
    } else if (CONCEPT_TYPES.has(fm.type)) {
      const name = text.split(/\s/)[0].replace(/[`*]/g, '');
      if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
        error(file, i + 1, `concept heading must start with a PascalCase name: "${text}"`);
        continue;
      }
      if (fm.type === 'aggregate' && `${fm.context}.${name}` === fm.id) continue;
      defineConcept(`${fm.context}.${name}`, file, i + 1);
    }
  }
}

/** A rule block must carry a Statement and a valid Status. */
function checkRuleFields(file, start, prose, id) {
  let statement = false;
  let status = null;
  for (let j = start + 1; j < prose.length && !/^#{1,3}\s/.test(prose[j]); j += 1) {
    if (/^\s*-\s+\*\*Statement:\*\*/.test(prose[j])) statement = true;
    const match = /^\s*-\s+\*\*Status:\*\*\s*([\w-]+)/.exec(prose[j]);
    if (match) status = match[1];
  }
  if (!statement) error(file, start + 1, `${id}: missing "- **Statement:**"`);
  if (!status) error(file, start + 1, `${id}: missing "- **Status:**"`);
  else if (!RULE_STATUSES.has(status)) error(file, start + 1, `${id}: unknown rule status "${status}"`);
}

// ------------------------------------------------------------------ code root

const index = docs.find((doc) => doc.fm?.type === 'index');
if (!index) error(path.join(root, 'README.md'), 0, 'no file with type "index" (the ontology README)');
const codeRootSetting = codeRootArg ?? index?.fm?.code_root;
const codeRoot = codeRootSetting
  ? path.resolve(codeRootArg ? process.cwd() : root, codeRootSetting)
  : null;
const codeAvailable = codeRoot && fs.existsSync(codeRoot);
const notices = [];
if (!codeRoot) notices.push('No code_root set: code references were not checked.');
else if (!codeAvailable) notices.push(`Code root ${codeRoot} not found: code references were not checked.`);

/** Checks `path` or `path#Symbol` under the code root. */
function checkCodeRef(file, line, ref, strict) {
  if (!codeAvailable) return;
  const [relPath, symbol] = ref.split('#');
  const full = path.join(codeRoot, relPath);
  if (!fs.existsSync(full)) {
    (strict ? error : warn)(file, line, `code path not found under code root: ${relPath}`);
    return;
  }
  if (symbol && fs.statSync(full).isFile() && !fs.readFileSync(full, 'utf8').includes(symbol)) {
    error(file, line, `symbol "${symbol}" not found in ${relPath}`);
  }
}

// ------------------------------------------------------------------ references

for (const doc of docs) {
  const { file, fm, lines, bodyStart } = doc;
  if (!fm) continue;
  for (const ref of fm.code_refs ?? []) checkCodeRef(file, 1, ref, true);

  // Meta files explain the format with illustrative ids and paths; only their links are checked.
  const illustrative = fm.type === 'meta';
  const prose = proseLines(lines);
  for (let i = bodyStart; i < prose.length; i += 1) {
    const line = prose[i];

    for (const match of line.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/.test(target) || target.includes('<')) continue;
      const resolved = path.resolve(path.dirname(file), decodeURIComponent(target.split('#')[0]));
      if (!fs.existsSync(resolved)) error(file, i + 1, `broken link: ${target}`);
    }

    if (illustrative) continue;

    for (const match of line.matchAll(/\b([A-Z]{2,4}-BR-\d{3})\b/g)) {
      if (!rules.has(match[1])) error(file, i + 1, `unknown rule ${match[1]}`);
    }

    for (const match of line.matchAll(/`([A-Z][A-Za-z0-9]*)\.([A-Z][A-Za-z0-9]*)/g)) {
      if (!contexts.has(match[1])) continue;
      const name = `${match[1]}.${match[2]}`;
      if (!concepts.has(name)) error(file, i + 1, `unknown concept ${name}`);
    }

    for (const match of line.matchAll(/`([^`\s]+)`/g)) {
      const candidate = match[1].split('#')[0];
      if (CODE_PATH.test(candidate) && !candidate.includes('<')) checkCodeRef(file, i + 1, match[1], false);
    }
  }
}

// Every context should be reachable from the index.
if (index) {
  const indexText = index.lines.join('\n');
  for (const [name, { dir }] of contexts) {
    const link = path.relative(path.dirname(index.file), path.join(dir, 'README.md')).split(path.sep).join('/');
    if (!indexText.includes(link)) warn(index.file, 0, `context ${name} is not linked from the index (${link})`);
  }
}

// ------------------------------------------------------------------ report

for (const line of warnings) console.log(`warning  ${line}`);
for (const line of errors) console.log(`error    ${line}`);
for (const line of notices) console.log(`notice   ${line}`);
console.log(
  `\n${docs.length} files, ${contexts.size} contexts, ${concepts.size} concepts, ${rules.size} rules: ` +
    `${errors.length} error(s), ${warnings.length} warning(s).`,
);
process.exit(errors.length > 0 ? 1 : 0);
