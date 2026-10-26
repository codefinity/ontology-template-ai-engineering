#!/usr/bin/env node
/**
 * Query, scaffold and analyse an ontology and the code it describes. Used by the ontology-* skills.
 *
 *   node tools/ontology.mjs <command> [args] [--ontology <dir>] [--code-root <dir>] [--json]
 *
 * Run with no command for the list of commands. No dependencies. Node 18+.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ID,
  TEST_FILE,
  blockRange,
  codeFiles,
  definitionText,
  kebab,
  loadOntology,
  lookup,
  plainCell,
  tableRows,
  toPosix,
  today,
} from './lib.mjs';

const HELP = `Usage: node tools/ontology.mjs <command> [args] [options]

Query
  show <id>                      Print the definition of a concept, rule, use case, question, decision,
                                 relationship, flow, subdomain, actor, context or document
  find <text>                    Search terms, concept names, rule and use-case titles
  refs <id>                      Every place an id is referenced, in the ontology and (rules, use cases) in code
  stats                          Counts per context, rule and use-case status
  export [--out <file>]          The whole model as JSON

Scaffold
  next-id <kind> [Context]       Next free id. kind: rule | use-case | question | decision | rel | flow
  new-context <Name> --code <CODE> --subdomain <SD-X> --classification <core|supporting|generic>
              [--aggregate <Root>]   Copy _context-template into 03-bounded-contexts/<name>/
  new-aggregate <Context> <Root> Add aggregates/<root>.md to a context from the aggregate template
  new-decision "<title>"         Add 00-meta/decisions/ADR-<NNN>-<slug>.md
  rename <Ctx.Old> <Ctx.New> [--write]   Rename a concept everywhere (dry run without --write)

Analyse (need the code root)
  affected <path>... | --git [<base>]    Ontology definitions that cite the given (or changed) code files
  coverage                       Which rules are cited by tests (rule ids in test files, or a Tests field)
  gaps                           Model completeness: unused commands, orphan rules, unlisted known gaps
  boundaries                     Imports that cross bounded contexts without a relationship in the map
  mine-rules [--path <prefix>] [--uncited]   Code lines that look like business rules
  language [--context <Name>] [--path <prefix>] [--homonyms]
                                 Uses of "Avoid" terms from the ubiquitous languages in code and UI text
                                 (words that are another context's preferred term are hidden unless --homonyms)

Options
  --ontology <dir>    Ontology folder (default: the folder above this script)
  --code-root <dir>   Code root (default: code_root in the ontology README)
  --json              Machine-readable output where supported`;

// ------------------------------------------------------------------ arguments

const BOOLEAN = new Set(['write', 'json', 'uncited', 'homonyms']);
const argv = process.argv.slice(2);
const command = argv.shift();
const positional = [];
const opts = {};
for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];
  if (!arg.startsWith('--')) {
    positional.push(arg);
    continue;
  }
  const key = arg.slice(2);
  if (BOOLEAN.has(key)) opts[key] = true;
  else if (key === 'git') opts.git = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[(i += 1)] : 'HEAD';
  else opts[key] = argv[(i += 1)];
}

if (!command || command === 'help' || command === '--help') {
  console.log(HELP);
  process.exit(0);
}

const here = path.dirname(fileURLToPath(import.meta.url));
const model = loadOntology(opts.ontology ?? path.join(here, '..'), { codeRoot: opts['code-root'] });
const cwd = process.cwd();
const show = (file, line = 0) => `${toPosix(path.relative(cwd, file))}${line ? `:${line + 1}` : ''}`;
const codePath = (p, line) => `${toPosix(path.relative(cwd, path.join(model.codeRoot, p)))}${line ? `:${line}` : ''}`;
const out = (value) => console.log(opts.json ? JSON.stringify(value, null, 2) : value);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function needCode() {
  if (!model.codeAvailable) fail(model.codeNotice ?? 'No code root available. Pass --code-root <dir>.');
}

// Dispatch is at the end of the file, after every constant the commands use is initialised.
const commands = {
  show: cmdShow,
  find: cmdFind,
  refs: cmdRefs,
  stats: cmdStats,
  export: cmdExport,
  'next-id': cmdNextId,
  'new-context': cmdNewContext,
  'new-aggregate': cmdNewAggregate,
  'new-decision': cmdNewDecision,
  rename: cmdRename,
  affected: cmdAffected,
  coverage: cmdCoverage,
  gaps: cmdGaps,
  boundaries: cmdBoundaries,
  'mine-rules': cmdMineRules,
  language: cmdLanguage,
};

// ------------------------------------------------------------------ query

function cmdShow() {
  const id = positional[0] ?? fail('show: give an id');
  const entry = lookup(model, id) ?? fail(`show: nothing is defined as "${id}"`);
  console.log(`${entry.kind} ${id} — ${show(entry.file, entry.line)}\n`);
  console.log(definitionText(model, entry));
}

function cmdFind() {
  const text = (positional.join(' ') || fail('find: give some text')).toLowerCase();
  const hits = [];
  for (const doc of model.docs) {
    if (doc.fm?.type !== 'ubiquitous-language' && doc.fm?.type !== 'glossary') continue;
    for (const { line, cells } of tableRows(doc.prose)) {
      if (cells[0] === 'Term' || !cells.some((c) => c.toLowerCase().includes(text))) continue;
      hits.push(`${show(doc.file, line)}  [${doc.fm.context ?? 'glossary'}] ${cells.map(plainCell).slice(0, 3).join(' | ')}`);
    }
  }
  for (const map of [model.concepts, model.rules, model.useCases]) {
    for (const e of map.values()) {
      const label = `${e.id} ${e.title ?? ''}`;
      if (label.toLowerCase().includes(text)) hits.push(`${show(e.file, e.line)}  ${label.trim()}`);
    }
  }
  console.log(hits.length ? hits.join('\n') : `No match for "${text}".`);
}

/** A regex matching references to an id. */
function refPattern(id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return /^[A-Z]\w*\.[A-Z]\w*$/.test(id) ? new RegExp(`\`${escaped}(?![A-Za-z0-9])`) : new RegExp(`\\b${escaped}\\b`);
}

function cmdRefs() {
  const id = positional[0] ?? fail('refs: give an id');
  const pattern = refPattern(id);
  const hits = [];
  for (const doc of model.docs) {
    doc.prose.forEach((line, i) => {
      if (i >= doc.bodyStart && pattern.test(line)) hits.push(`${show(doc.file, i)}  ${line.trim().slice(0, 140)}`);
    });
  }
  if (/-(BR|UC)-\d+$/.test(id) && model.codeAvailable) {
    for (const file of codeFiles(model)) {
      fs.readFileSync(path.join(model.codeRoot, file), 'utf8').split(/\r?\n/).forEach((line, i) => {
        if (pattern.test(line)) hits.push(`${codePath(file, i + 1)}  ${line.trim().slice(0, 140)}`);
      });
    }
  }
  console.log(hits.length ? hits.join('\n') : `No references to ${id}.`);
}

function statusOf(item) {
  return /^[\w-]+/.exec(item.fields?.Status ?? '')?.[0] ?? 'unknown';
}

function cmdStats() {
  const rows = [];
  for (const [name, ctx] of model.contexts) {
    const count = (map) => [...map.values()].filter((e) => e.context === name);
    const byStatus = (items) => {
      const tally = {};
      for (const item of items) tally[statusOf(item)] = (tally[statusOf(item)] ?? 0) + 1;
      return tally;
    };
    rows.push({
      context: name,
      code: ctx.code,
      classification: ctx.fm.classification,
      concepts: count(model.concepts).length,
      rules: byStatus(count(model.rules)),
      useCases: byStatus(count(model.useCases)),
      questions: count(model.questions).length,
    });
  }
  if (opts.json) return out(rows);
  const fmt = (tally) => Object.entries(tally).map(([k, v]) => `${v} ${k}`).join(', ') || '—';
  for (const r of rows) {
    console.log(`${r.context} (${r.code}, ${r.classification}): ${r.concepts} concepts; rules: ${fmt(r.rules)}; use cases: ${fmt(r.useCases)}; ${r.questions} open questions`);
  }
  console.log(`\nTotal: ${model.contexts.size} contexts, ${model.concepts.size} concepts, ${model.rules.size} rules, ${model.useCases.size} use cases, ${model.decisions.size} decisions, ${model.relationships.size} relationships, ${model.flows.size} flows.`);
}

function cmdExport() {
  const rel = (file) => model.rel(file);
  const entries = (map, extra = () => ({})) =>
    [...map.values()].map((e) => ({ id: e.id, context: e.context, file: rel(e.file), line: e.line + 1, ...extra(e) }));
  const data = {
    root: model.root,
    codeRoot: model.codeRoot,
    contexts: [...model.contexts.values()].map((c) => ({
      name: c.name, code: c.code, subdomain: c.fm.subdomain, classification: c.fm.classification, status: c.fm.status, folder: rel(c.dir),
    })),
    concepts: entries(model.concepts, (e) => ({ name: e.name, kind: e.docType })),
    rules: entries(model.rules, (e) => ({ title: e.title, status: statusOf(e), fields: e.fields })),
    useCases: entries(model.useCases, (e) => ({ title: e.title, status: statusOf(e), fields: e.fields })),
    questions: entries(model.questions, (e) => ({ text: e.text })),
    decisions: [...model.decisions.values()].map((d) => ({ id: d.id, title: d.title, status: d.fm.status, file: rel(d.file) })),
    relationships: [...model.relationships.values()].map((r) => ({ id: r.id, upstream: r.upstream, downstream: r.downstream, pattern: r.pattern, contract: r.contract })),
    flows: [...model.flows.values()].map((f) => ({ id: f.id, title: f.title, file: rel(f.file) })),
    citations: model.citations.map((c) => ({ path: c.path, symbol: c.symbol, owner: c.owner, context: c.context, file: rel(c.file), line: c.line + 1 })),
  };
  const json = JSON.stringify(data, null, 2);
  if (opts.out) {
    fs.writeFileSync(opts.out, json);
    console.log(`Wrote ${opts.out}`);
  } else console.log(json);
}

// ------------------------------------------------------------------ scaffold

function nextNumber(ids, regex, width) {
  let max = 0;
  for (const id of ids) {
    const m = regex.exec(id);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return String(max + 1).padStart(width, '0');
}

function cmdNextId() {
  const kind = positional[0] ?? fail('next-id: give a kind');
  const context = positional[1];
  const code = () => (model.contexts.get(context) ?? fail(`next-id: unknown context "${context}"`)).code;
  switch (kind) {
    case 'rule':
      return console.log(`${code()}-BR-${nextNumber(model.rules.keys(), new RegExp(`^${code()}-BR-(\\d{3})$`), 3)}`);
    case 'use-case':
      return console.log(`${code()}-UC-${nextNumber(model.useCases.keys(), new RegExp(`^${code()}-UC-(\\d{2})$`), 2)}`);
    case 'question':
      return console.log(`${code()}-Q-${nextNumber(model.questions.keys(), new RegExp(`^${code()}-Q-(\\d{2})$`), 2)}`);
    case 'decision':
      return console.log(`ADR-${nextNumber(model.decisions.keys(), /^ADR-(\d{3})$/, 3)}`);
    case 'rel':
      return console.log(`REL-${nextNumber(model.relationships.keys(), /^REL-(\d{2})$/, 2)}`);
    case 'flow':
      return console.log(`FLOW-${nextNumber(model.flows.keys(), /^FLOW-(\d{2})$/, 2)}`);
    default:
      return fail(`next-id: unknown kind "${kind}"`);
  }
}

function fillTemplate(text, values) {
  let result = text;
  for (const [from, to] of Object.entries(values)) result = result.split(from).join(to);
  return result;
}

function copyTree(from, to, values, skip = () => false) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    if (skip(src)) continue;
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(src, dst, values, skip);
    else fs.writeFileSync(dst, fillTemplate(fs.readFileSync(src, 'utf8'), values));
  }
}

const templateDir = () => path.join(model.root, '03-bounded-contexts', '_context-template');

function cmdNewContext() {
  const name = positional[0] ?? fail('new-context: give a PascalCase name');
  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) fail('new-context: the name must be PascalCase');
  if (model.contexts.has(name)) fail(`new-context: ${name} already exists`);
  const code = opts.code ?? fail('new-context: --code is required');
  if (!/^[A-Z]{2,4}$/.test(code)) fail('new-context: --code must be 2-4 capital letters');
  if ([...model.contexts.values()].some((c) => c.code === code)) fail(`new-context: code ${code} is taken`);
  const subdomain = opts.subdomain ?? fail('new-context: --subdomain is required');
  const classification = opts.classification ?? fail('new-context: --classification is required');
  if (!fs.existsSync(templateDir())) fail(`new-context: template not found at ${show(templateDir())}`);

  const dir = path.join(model.root, '03-bounded-contexts', kebab(name));
  if (fs.existsSync(dir)) fail(`new-context: ${show(dir)} already exists`);
  const values = {
    '<Context>': name,
    '<CTX>': code,
    'SD-<NAME>': subdomain,
    'classification: core ': `classification: ${classification} `,
    'YYYY-MM-DD': today(),
  };
  copyTree(templateDir(), dir, values, (src) => path.basename(src) === '_aggregate-template.md');
  console.log(`Created ${show(dir)}`);
  if (opts.aggregate) createAggregate(name, code, opts.aggregate, dir);
  else console.log('Next: add at least one aggregate (new-aggregate) — the validator requires one.');
  console.log(`Then: add ${name} to the index table, subdomains.md, context-map.md (node and relationships), and run validate.mjs.`);
}

function createAggregate(context, code, root, dir) {
  if (!/^[A-Z][A-Za-z0-9]*$/.test(root)) fail('new-aggregate: the aggregate root must be PascalCase');
  const template = path.join(templateDir(), 'aggregates', '_aggregate-template.md');
  if (!fs.existsSync(template)) fail(`new-aggregate: template not found at ${show(template)}`);
  const file = path.join(dir, 'aggregates', `${kebab(root)}.md`);
  if (fs.existsSync(file)) fail(`new-aggregate: ${show(file)} already exists`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const values = { '<Context>': context, '<CTX>': code, '<AggregateRoot>': root, 'YYYY-MM-DD': today() };
  fs.writeFileSync(file, fillTemplate(fs.readFileSync(template, 'utf8'), values));
  console.log(`Created ${show(file)} — add it to the context README's model table.`);
}

function cmdNewAggregate() {
  const [context, root] = positional;
  const ctx = model.contexts.get(context) ?? fail(`new-aggregate: unknown context "${context}"`);
  createAggregate(context, ctx.code, root ?? fail('new-aggregate: give the aggregate root name'), ctx.dir);
}

function cmdNewDecision() {
  const title = positional.join(' ') || fail('new-decision: give a title');
  const dir = path.join(model.root, '00-meta', 'decisions');
  const template = path.join(dir, '_decision-template.md');
  if (!fs.existsSync(template)) fail(`new-decision: template not found at ${show(template)}`);
  const id = `ADR-${nextNumber(model.decisions.keys(), /^ADR-(\d{3})$/, 3)}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  const file = path.join(dir, `${id}-${slug}.md`);
  fs.writeFileSync(file, fillTemplate(fs.readFileSync(template, 'utf8'), { 'ADR-<NNN>': id, '<Title>': title, 'YYYY-MM-DD': today() }));
  console.log(`Created ${show(file)} — add it to 00-meta/decisions/README.md.`);
}

function cmdRename() {
  const [from, to] = positional;
  if (!from || !to) fail('rename: give <Context.Old> <Context.New>');
  const entry = model.concepts.get(from) ?? fail(`rename: ${from} is not a defined concept`);
  if (model.concepts.has(to)) fail(`rename: ${to} already exists`);
  const [ctx, oldName] = from.split('.');
  const [toCtx, newName] = to.split('.');
  if (ctx !== toCtx) fail('rename: moving a concept to another context is a design change; do it by hand');
  if (!/^[A-Z][A-Za-z0-9]*$/.test(newName)) fail('rename: the new name must be PascalCase');

  const pattern = new RegExp(`\`${from.replace('.', '\\.')}(?![A-Za-z0-9])`, 'g');
  let total = 0;
  for (const doc of model.docs) {
    let changed = 0;
    const lines = doc.lines.map((line, i) => {
      let next = line.replace(pattern, `\`${to}`);
      if (doc.file === entry.file && i === entry.line) next = next.replace(new RegExp(`^(###\\s+)${oldName}\\b`), `$1${newName}`);
      if (doc.file === entry.file && entry.docType === 'aggregate' && /^id:\s/.test(line)) next = next.replace(from, to);
      if (doc.file === entry.file && entry.docType === 'aggregate' && /^#\s/.test(line)) next = next.replace(new RegExp(`\\b${oldName}\\b`), newName);
      if (next !== line) changed += 1;
      return next;
    });
    if (!changed) continue;
    total += changed;
    console.log(`${show(doc.file)}: ${changed} line(s)`);
    if (opts.write) fs.writeFileSync(doc.file, lines.join('\n'));
  }
  console.log(opts.write ? `Renamed ${from} → ${to} in ${total} line(s).` : `Dry run: ${total} line(s) would change. Re-run with --write.`);
  if (entry.docType === 'aggregate') console.log(`Consider renaming the file to aggregates/${kebab(newName)}.md and fixing links to it.`);
  console.log('Also update ubiquitous-language.md (move the old word to "Avoid") and the code, if the identifier changes.');
}

// ------------------------------------------------------------------ analyse

/** Normalises a code path given on the command line to a path relative to the code root. */
function relToCode(p) {
  const full = path.resolve(cwd, p);
  return fs.existsSync(full) && full.startsWith(model.codeRoot) ? toPosix(path.relative(model.codeRoot, full)) : toPosix(p);
}

function cmdAffected() {
  needCode();
  let files = positional.map(relToCode);
  if (opts.git) {
    const git = (...a) => execFileSync('git', ['-C', model.codeRoot, ...a], { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
    try {
      files = [...new Set([...git('diff', '--name-only', opts.git), ...git('ls-files', '--others', '--exclude-standard')])];
    } catch (err) {
      fail(`affected: git failed in ${model.codeRoot}: ${err.message.split('\n')[0]}`);
    }
  }
  if (files.length === 0) fail('affected: give code paths, or --git [<base>]');

  const report = [];
  for (const file of files) {
    const owners = new Map();
    for (const c of model.citations) {
      if (c.path === file || file.startsWith(`${c.path}/`)) {
        const key = c.owner;
        if (!owners.has(key)) owners.set(key, { id: key, context: c.context, at: show(c.file, c.line) });
      }
    }
    let ruleIds = [];
    const full = path.join(model.codeRoot, file);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      const text = fs.readFileSync(full, 'utf8');
      ruleIds = [...new Set([...text.matchAll(ID.rule), ...text.matchAll(ID.useCase)].map((m) => m[0]))];
    }
    report.push({ file, definitions: [...owners.values()], citedIds: ruleIds });
  }
  if (opts.json) return out(report);
  for (const r of report) {
    console.log(`\n${r.file}`);
    if (r.definitions.length === 0 && r.citedIds.length === 0) console.log('  not cited by the ontology (new concept, or not domain code?)');
    for (const d of r.definitions) console.log(`  ${d.id}${d.context ? ` [${d.context}]` : ''}  ${d.at}`);
    if (r.citedIds.length) console.log(`  ids cited in the file: ${r.citedIds.join(', ')}`);
  }
}

function cmdCoverage() {
  needCode();
  const tests = codeFiles(model).filter((f) => TEST_FILE.test(f));
  const byRule = new Map();
  const unknown = [];
  for (const file of tests) {
    const text = fs.readFileSync(path.join(model.codeRoot, file), 'utf8');
    for (const m of text.matchAll(ID.rule)) {
      if (!model.rules.has(m[0])) unknown.push(`${file}: ${m[0]}`);
      else byRule.set(m[0], [...new Set([...(byRule.get(m[0]) ?? []), file])]);
    }
  }
  for (const rule of model.rules.values()) {
    for (const m of (rule.fields.Tests ?? '').matchAll(/`([^`\s#]+)/g)) {
      if (fs.existsSync(path.join(model.codeRoot, m[1]))) byRule.set(rule.id, [...new Set([...(byRule.get(rule.id) ?? []), m[1]])]);
    }
  }
  const rows = [...model.rules.values()].map((r) => ({ id: r.id, context: r.context, status: statusOf(r), title: r.title, tests: byRule.get(r.id) ?? [] }));
  if (opts.json) return out({ testFiles: tests.length, rules: rows, unknownIds: unknown });

  console.log(`${tests.length} test file(s) found under ${model.codeRoot}\n`);
  for (const name of model.contexts.keys()) {
    const mine = rows.filter((r) => r.context === name && r.status !== 'deprecated' && r.status !== 'not-implemented');
    const covered = mine.filter((r) => r.tests.length > 0).length;
    console.log(`${name}: ${covered}/${mine.length} implemented or partial rules have tests`);
  }
  const missing = rows.filter((r) => (r.status === 'implemented' || r.status === 'partial') && r.tests.length === 0);
  if (missing.length) {
    console.log('\nWithout tests:');
    for (const r of missing) console.log(`  ${r.id} (${r.status}) ${r.title}`);
  }
  const ahead = rows.filter((r) => r.status === 'not-implemented' && r.tests.length > 0);
  if (ahead.length) console.log(`\nTests exist for not-implemented rules (expected to fail?): ${ahead.map((r) => r.id).join(', ')}`);
  if (unknown.length) console.log(`\nTests cite unknown rule ids:\n  ${unknown.join('\n  ')}`);
}

function cmdGaps() {
  const findings = [];
  const docsOf = (type) => model.docs.filter((d) => d.fm?.type === type);
  const textOf = (docs) => docs.map((d) => d.prose.join('\n')).join('\n');
  const ucText = textOf(docsOf('use-cases'));

  for (const c of model.concepts.values()) {
    if (c.docType !== 'commands') continue;
    if (!ucText.includes(`\`${c.id}\``)) findings.push(['command not used by any use case', c.id, show(c.file, c.line)]);
  }
  for (const rule of model.rules.values()) {
    const pattern = new RegExp(`\\b${rule.id}\\b`);
    const used = model.docs.some((d) => d.prose.some((line, i) => pattern.test(line) && !(d.file === rule.file && i >= rule.line && i < rule.end)));
    if (!used) findings.push(['rule referenced nowhere else (no aggregate, command or use case cites it)', rule.id, show(rule.file, rule.line)]);
    const status = statusOf(rule);
    if (status === 'partial' || status === 'not-implemented') {
      const readme = model.contexts.get(rule.context).doc;
      if (!pattern.test(readme.prose.join('\n'))) findings.push([`${status} rule not listed in the context's Known gaps`, rule.id, show(rule.file, rule.line)]);
    }
  }
  for (const uc of model.useCases.values()) {
    const block = Object.values(uc.fields).join('\n');
    if (!new RegExp(ID.rule.source).test(block)) findings.push(['use case cites no rule', uc.id, show(uc.file, uc.line)]);
    if (!/`[A-Z]\w*\.[A-Z]\w*`/.test(block)) findings.push(['use case cites no command or concept', uc.id, show(uc.file, uc.line)]);
  }
  for (const name of model.contexts.keys()) {
    if (![...model.useCases.values()].some((u) => u.context === name)) findings.push(['context has no use cases', name, show(model.contexts.get(name).doc.file)]);
  }
  if (opts.json) return out(findings.map(([kind, id, at]) => ({ kind, id, at })));
  if (findings.length === 0) return console.log('No gaps found.');
  const groups = new Map();
  for (const [kind, id, at] of findings) groups.set(kind, [...(groups.get(kind) ?? []), `${id}  ${at}`]);
  for (const [kind, items] of groups) console.log(`\n${kind} (${items.length}):\n  ${items.join('\n  ')}`);
}

/** Import aliases: tsconfig/jsconfig `paths`, plus `code_aliases: ["@/=src/"]` in the ontology README. */
function importAliases() {
  const aliases = [];
  for (const name of ['tsconfig.json', 'jsconfig.json']) {
    const file = path.join(model.codeRoot, name);
    if (!fs.existsSync(file)) continue;
    try {
      const json = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\s*\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1'));
      const base = json.compilerOptions?.baseUrl ?? '.';
      for (const [key, targets] of Object.entries(json.compilerOptions?.paths ?? {})) {
        aliases.push([key.replace(/\*$/, ''), toPosix(path.join(base, targets[0].replace(/\*$/, ''))).replace(/^\.\//, '')]);
      }
    } catch {
      // Unreadable config: rely on code_aliases.
    }
  }
  for (const entry of model.index?.fm?.code_aliases ?? []) {
    const [from, to] = entry.split('=');
    aliases.push([from, to]);
  }
  return aliases;
}

function resolveImport(fromFile, spec, aliases) {
  let base = null;
  if (spec.startsWith('.')) base = toPosix(path.join(path.dirname(fromFile), spec));
  else {
    const alias = aliases.find(([prefix]) => spec.startsWith(prefix));
    if (alias) base = toPosix(path.join(alias[1], spec.slice(alias[0].length)));
  }
  if (!base) return null;
  const exts = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '/index.ts', '/index.tsx', '/index.js'];
  for (const ext of exts) {
    const candidate = `${base}${ext}`;
    const full = path.join(model.codeRoot, candidate);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return candidate;
  }
  return null;
}

function cmdBoundaries() {
  needCode();
  // A file belongs to a context when exactly one context README cites it (its Code map or code_refs).
  const claims = new Map();
  for (const c of model.citations) {
    if (c.docType !== 'context') continue;
    claims.set(c.path, new Set([...(claims.get(c.path) ?? []), c.context]));
  }
  const owner = new Map([...claims].filter(([, set]) => set.size === 1).map(([p, set]) => [p, [...set][0]]));
  const shared = [...claims].filter(([, set]) => set.size > 1).map(([p, set]) => `${p} (${[...set].join(', ')})`);
  const allowed = (from, to) => [...model.relationships.values()].some((r) => r.upstream.includes(to) && r.downstream.includes(from));
  const aliases = importAliases();
  const importRe = /(?:^|\s)(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\)/g;

  const violations = [];
  for (const [file, context] of owner) {
    const full = path.join(model.codeRoot, file);
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) continue;
    fs.readFileSync(full, 'utf8').split(/\r?\n/).forEach((line, i) => {
      for (const m of line.matchAll(importRe)) {
        const target = resolveImport(file, m[1] ?? m[2] ?? m[3], aliases);
        const targetContext = target && owner.get(target);
        if (!targetContext || targetContext === context || allowed(context, targetContext)) continue;
        violations.push({
          file, line: i + 1, imports: target, from: context, to: targetContext,
          kind: allowed(targetContext, context) ? 'against the map (the map says the reverse direction)' : 'undeclared (no relationship in the map)',
        });
      }
    });
  }
  if (opts.json) return out({ owned: owner.size, shared, violations });
  console.log(`${owner.size} code file(s) owned by exactly one context; ${shared.length} cited by several (not checked).`);
  if (violations.length === 0) return console.log('No imports cross a boundary without a relationship.');
  console.log(`\n${violations.length} import(s) cross a boundary without a matching relationship:`);
  for (const v of violations) console.log(`  ${codePath(v.file, v.line)}  ${v.from} → ${v.to} (${v.imports}): ${v.kind}`);
}

const RULE_PATTERNS = [
  ['validation', /setError\(|throw new \w*Error|return\s+['"`][A-Z][^'"`]{10,}['"`]|maxLength=\{\d+\}|\/\^[^/]+\$\/\.test\(/],
  ['state', /\bstatus\s*(===|!==|==|!=)\s*['"]|\bstatus:\s*['"][A-Z]|\bcase\s+['"][A-Z][\w -]*['"]\s*:/],
  ['calculation', /Math\.(round|floor|ceil)\(|\*\s*100\b|\/\s*100\b|\(1\s*-\s*\w+\s*\/\s*100\)/],
  ['date', /\bREFERENCE_TODAY\b|\bnew Date\(|\bDate\.now\(|[<>]=?\s*today\b/],
  ['limit', /\bconst\s+[A-Z][A-Z0-9_]{2,}\s*=\s*-?[\d.]+|Math\.(min|max)\(|[<>]=?\s*([2-9]|\d{2,})(\.\d+)?\b|[<>]=?\s*[A-Z][A-Z0-9_]{2,}\b/],
];
const NOISE = /^\s*(\/\/|\/?\*|import\s|export\s+\{)|className=|style=\{|viewBox|strokeWidth|aria-|^\s*for\s*\(|\bi\s*[<>]|index\s*[<>]/;

function enclosingSymbol(lines, index) {
  for (let i = index; i >= Math.max(0, index - 80); i -= 1) {
    const m = /function\s+(\w+)|(?:const|let)\s+(\w+)\s*=|^\s*case\s+['"](\w+)['"]|^\s{2,}(\w+)\s*[:(]\s*(?:\(|async|\w+\s*=>)/.exec(lines[i]);
    if (m) return m[1] ?? m[2] ?? m[3] ?? m[4];
  }
  return null;
}

function cmdMineRules() {
  needCode();
  // What existing rules already cite: files, and symbols named in their Code field.
  const citedFiles = new Set();
  const citedSymbols = new Map();
  for (const rule of model.rules.values()) {
    const code = rule.fields.Code ?? '';
    const files = [...code.matchAll(/`([^`\s#]+\/[^`\s#]+)`/g)].map((m) => m[1]);
    const symbols = [...code.matchAll(/`([A-Za-z_$][\w$]*)`/g)].map((m) => m[1]);
    for (const f of files) {
      citedFiles.add(f);
      citedSymbols.set(f, new Set([...(citedSymbols.get(f) ?? []), ...symbols]));
    }
  }
  const files = codeFiles(model).filter((f) => !TEST_FILE.test(f) && (!opts.path || f.startsWith(opts.path)));
  const candidates = [];
  for (const file of files) {
    const lines = fs.readFileSync(path.join(model.codeRoot, file), 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (NOISE.test(line)) return;
      const category = RULE_PATTERNS.find(([, re]) => re.test(line))?.[0];
      if (!category) return;
      const symbol = enclosingSymbol(lines, i);
      const cited = !citedFiles.has(file) ? 'uncited' : citedSymbols.get(file)?.has(symbol) ? 'cited' : 'file-cited';
      if (opts.uncited && cited === 'cited') return;
      candidates.push({ file, line: i + 1, category, symbol, cited, code: line.trim().slice(0, 120) });
    });
  }
  if (opts.json) return out(candidates);
  let current = null;
  for (const c of candidates) {
    if (c.file !== current) {
      current = c.file;
      console.log(`\n${c.file}`);
    }
    console.log(`  ${String(c.line).padStart(4)}  ${c.category.padEnd(11)} ${(c.symbol ?? '?').padEnd(22)} ${c.cited.padEnd(10)} ${c.code}`);
  }
  const tally = (key) => candidates.reduce((acc, c) => ({ ...acc, [c[key]]: (acc[c[key]] ?? 0) + 1 }), {});
  console.log(`\n${candidates.length} candidate line(s) in ${new Set(candidates.map((c) => c.file)).size} file(s).`, tally('cited'), tally('category'));
  console.log('cited = the file and enclosing symbol are named in a rule\'s Code field; file-cited = only the file; uncited = neither.');
}

function cmdLanguage() {
  needCode();
  const preferred = new Map(); // lower-case term -> contexts where it is a preferred term
  const avoid = [];
  for (const doc of model.docs) {
    if (doc.fm?.type !== 'ubiquitous-language') continue;
    for (const { line, cells } of tableRows(doc.prose)) {
      if (cells[0] === 'Term' || cells.length < 4) continue;
      const term = plainCell(cells[0]).toLowerCase();
      preferred.set(term, [...(preferred.get(term) ?? []), doc.fm.context]);
      // Preferred terms come from every context; avoided words only from the context(s) in scope.
      if (opts.context && doc.fm.context !== opts.context) continue;
      const words = plainCell(cells[3]).replace(/\([^)]*\)/g, '').split(/,|;/).map((w) => w.trim().replace(/^["']|["']$/g, '')).filter((w) => w.length >= 3 && !/^[-—]$/.test(w));
      for (const word of words) avoid.push({ word, context: doc.fm.context, insteadOf: plainCell(cells[0]), at: show(doc.file, line) });
    }
  }
  const files = codeFiles(model)
    .filter((f) => !TEST_FILE.test(f) && (!opts.path || f.startsWith(opts.path)))
    .map((f) => ({ f, lines: fs.readFileSync(path.join(model.codeRoot, f), 'utf8').split(/\r?\n/) }));
  const results = [];
  let hidden = 0;
  for (const a of avoid) {
    const homonymOf = (preferred.get(a.word.toLowerCase()) ?? []).filter((c) => c !== a.context);
    if (homonymOf.length && !opts.homonyms) {
      hidden += 1;
      continue;
    }
    const re = new RegExp(`\\b${a.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const hits = [];
    for (const { f, lines } of files) lines.forEach((line, i) => re.test(line) && hits.push(`${f}:${i + 1}`));
    if (hits.length) results.push({ ...a, hits: hits.length, files: new Set(hits.map((h) => h.split(':')[0])).size, sample: hits.slice(0, 3), alsoPreferredIn: homonymOf });
  }
  results.sort((x, y) => y.hits - x.hits);
  if (opts.json) return out(results);
  if (hidden) console.log(`(${hidden} avoided word(s) that are another context's preferred term hidden; --homonyms shows them)\n`);
  if (results.length === 0) return console.log('No avoided terms found in the code.');
  for (const r of results) {
    const homonym = r.alsoPreferredIn.length ? ` — also a preferred term in ${r.alsoPreferredIn.join(', ')}` : '';
    console.log(`"${r.word}" [${r.context}: say "${r.insteadOf}"]  ${r.hits} hit(s) in ${r.files} file(s)${homonym}\n    e.g. ${r.sample.join(', ')}`);
  }
  console.log('\nHits are leads, not verdicts: a word may be legitimate in another context or in code that is not about this concept.');
}

// ------------------------------------------------------------------ dispatch

if (!commands[command]) fail(`Unknown command "${command}".\n\n${HELP}`);
commands[command]();
