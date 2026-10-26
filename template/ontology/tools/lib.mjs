/**
 * Shared loader for the ontology tools (validate.mjs, ontology.mjs).
 *
 * `loadOntology(root)` reads every Markdown file of an ontology folder and builds one model: documents,
 * bounded contexts, defined concepts, rules, use cases, questions, decisions, relationships, flows,
 * subdomains, actors, and every code path the ontology cites. Problems found while loading (bad headings,
 * duplicate definitions) are collected in `model.problems`; reference checks live in validate.mjs.
 *
 * No dependencies. Node 18+.
 */

import fs from 'node:fs';
import path from 'node:path';

/** Every allowed `type`, and whether it belongs to a bounded context. */
export const TYPES = {
  index: false,
  meta: false,
  decision: false,
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
  'use-cases': true,
  commands: true,
  'domain-events': true,
  'read-models': true,
};

/** Types whose `###` headings define model concepts. */
export const CONCEPT_TYPES = new Set(['aggregate', 'value-objects', 'commands', 'domain-events', 'read-models']);
export const STATUSES = new Set(['draft', 'proposed', 'implemented', 'deprecated']);
/** Status values of a single rule or use case. */
export const ITEM_STATUSES = new Set(['implemented', 'partial', 'not-implemented', 'deprecated']);
export const REQUIRED_KEYS = ['id', 'type', 'status', 'last_reviewed'];
export const CONTEXT_FILES = [
  'README.md',
  'ubiquitous-language.md',
  'value-objects.md',
  'business-rules.md',
  'use-cases.md',
  'commands.md',
  'domain-events.md',
  'read-models.md',
];

/** Identifier patterns. Each `g` regex is used with matchAll, so always copy before exec. */
export const ID = {
  rule: /\b([A-Z]{2,4})-BR-(\d{3})\b/g,
  useCase: /\b([A-Z]{2,4})-UC-(\d{2})\b/g,
  question: /\b([A-Z]{2,4})-Q-(\d{2})\b/g,
  decision: /\bADR-\d{3}\b/g,
  rel: /\bREL-\d{2}\b/g,
  flow: /\bFLOW-\d{2}\b/g,
  // `(?!N+\b)` skips reference-format placeholders such as SD-NNNNN (a seller deal number, not a subdomain).
  subdomain: /\bSD-(?!N+\b)[A-Z][A-Z-]*[A-Z]\b/g,
  actor: /\bACT-(?!N+\b)[A-Z][A-Z-]*[A-Z]\b/g,
};

/** A backticked code path such as `src/lib/site.ts` or `src/app/[slug]/page.tsx#Page`. */
export const CODE_PATH =
  /^[\w@.\-/[\]()]+\/[\w@.\-[\]()]+\.(ts|tsx|js|jsx|mjs|cjs|py|cs|java|kt|go|rb|rs|php|sql|json|ya?ml)$/;

// ------------------------------------------------------------------ small helpers

export const toPosix = (p) => p.split(path.sep).join('/');

export function kebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

function unquote(value) {
  return value.trim().replace(/^(['"])(.*)\1$/, '$2');
}

/** Minimal YAML front matter: `key: value`, `key: [a, b]` and block lists of `- item`. */
export function parseFrontMatter(text) {
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

/** Lines with fenced code blocks blanked out, so examples are not read as definitions or references. */
export function proseLines(lines) {
  let fenced = false;
  return lines.map((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      return '';
    }
    return fenced ? '' : line;
  });
}

/** Markdown files of the ontology, skipping templates (`_*`), hidden entries and tools/. */
function walk(root, dir = root) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full !== path.join(root, 'tools')) out.push(...walk(root, full));
    } else if (entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

/** The `[start, end)` line range of the block that starts at a heading. */
export function blockRange(lines, start) {
  const level = /^(#+)/.exec(lines[start])?.[1].length ?? 3;
  let end = start + 1;
  while (end < lines.length && !new RegExp(`^#{1,${level}}\\s`).test(lines[end])) end += 1;
  return [start, end];
}

/** `- **Key:** value` fields of a block, with indented continuation lines joined. */
export function parseFields(lines) {
  const fields = {};
  let key = null;
  for (const line of lines) {
    const field = /^\s*-\s+\*\*([^*:]+):\*\*\s*(.*)$/.exec(line);
    if (field) {
      key = field[1].trim();
      fields[key] = field[2].trim();
    } else if (key && /^\s{2,}\S/.test(line)) {
      fields[key] += `\n${line.trim()}`;
    } else if (!line.trim()) {
      key = null;
    }
  }
  return fields;
}

/** Table rows (not the separator) as `{ line, cells }`. */
export function tableRows(prose) {
  const rows = [];
  prose.forEach((line, index) => {
    if (!/^\s*\|/.test(line) || /^\s*\|[\s:|-]+\|\s*$/.test(line)) return;
    const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
    rows.push({ line: index, cells });
  });
  return rows;
}

/** Strips Markdown links and backticks from a table cell. */
export function plainCell(cell) {
  return cell.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/`/g, '').trim();
}

// ------------------------------------------------------------------ loading

export function loadOntology(rootArg, { codeRoot: codeRootArg } = {}) {
  const root = path.resolve(rootArg);
  if (!fs.existsSync(root)) throw new Error(`Ontology folder not found: ${root}`);

  const model = {
    root,
    docs: [],
    contexts: new Map(),
    concepts: new Map(),
    rules: new Map(),
    useCases: new Map(),
    questions: new Map(),
    decisions: new Map(),
    relationships: new Map(),
    flows: new Map(),
    subdomains: new Map(),
    actors: new Map(),
    citations: [],
    problems: [],
    index: null,
  };
  const problem = (level, file, line, message) => model.problems.push({ level, file, line, message });
  model.rel = (file) => toPosix(path.relative(root, file));

  for (const file of walk(root)) {
    const text = fs.readFileSync(file, 'utf8');
    const { data, bodyStart } = parseFrontMatter(text);
    const lines = text.split(/\r?\n/);
    model.docs.push({ file, rel: model.rel(file), fm: data, lines, prose: proseLines(lines), bodyStart });
  }
  model.index = model.docs.find((doc) => doc.fm?.type === 'index') ?? null;

  // Contexts first: everything context-scoped depends on them.
  for (const doc of model.docs) {
    if (doc.fm?.type !== 'context') continue;
    for (const [name, other] of model.contexts) {
      if (other.code === doc.fm.code) problem('error', doc.file, 1, `context code "${doc.fm.code}" already used by ${name}`);
    }
    model.contexts.set(doc.fm.id, { name: doc.fm.id, code: doc.fm.code, dir: path.dirname(doc.file), doc, fm: doc.fm });
  }
  const codeOf = (context) => model.contexts.get(context)?.code;

  const define = (map, id, entry, kind) => {
    if (map.has(id)) {
      problem('error', entry.file, entry.line + 1, `${kind} ${id} is defined twice (also in ${model.rel(map.get(id).file)})`);
      return;
    }
    map.set(id, entry);
  };

  for (const doc of model.docs) {
    const { fm, prose, bodyStart, file } = doc;
    if (!fm) continue;
    const context = fm.context && model.contexts.has(fm.context) ? fm.context : null;

    if (fm.type === 'decision' && fm.id) {
      const title = prose.find((line) => /^#\s/.test(line))?.replace(/^#\s+/, '') ?? fm.id;
      define(model.decisions, fm.id, { id: fm.id, file, line: 0, title, fm }, 'decision');
    }

    if (fm.type === 'aggregate' && context && fm.id?.startsWith(`${context}.`)) {
      define(model.concepts, fm.id, { id: fm.id, context, name: fm.id.split('.')[1], file, line: 0, docType: 'aggregate' }, 'concept');
    }

    // Table-row definitions.
    for (const { line, cells } of tableRows(prose)) {
      if (line < bodyStart) continue;
      const first = plainCell(cells[0] ?? '');
      if (fm.type === 'context' && /^[A-Z]{2,4}-Q-\d{2}$/.test(first)) {
        define(model.questions, first, { id: first, context, file, line, text: plainCell(cells[1] ?? '') }, 'question');
      } else if (fm.type === 'subdomains' && /^SD-[A-Z-]+$/.test(first)) {
        define(model.subdomains, first, { id: first, file, line, cells }, 'subdomain');
      } else if (fm.type === 'actors' && /^ACT-[A-Z-]+$/.test(first)) {
        define(model.actors, first, { id: first, file, line, cells }, 'actor');
      } else if (fm.type === 'context-map' && /^REL-\d{2}$/.test(first)) {
        define(model.relationships, first, {
          id: first,
          file,
          line,
          upstream: contextsIn(cells[1] ?? '', model),
          downstream: contextsIn(cells[2] ?? '', model),
          pattern: plainCell(cells[3] ?? ''),
          contract: plainCell(cells[4] ?? ''),
        }, 'relationship');
      }
    }

    // Heading definitions.
    for (let i = bodyStart; i < prose.length; i += 1) {
      if (fm.type === 'flows') {
        const flow = /^##\s+(FLOW-\d{2})\b\s*(.*)$/.exec(prose[i]);
        if (flow) define(model.flows, flow[1], { id: flow[1], file, line: i, title: flow[2] }, 'flow');
        continue;
      }
      const heading = /^###\s+(.+?)\s*$/.exec(prose[i]);
      if (!heading || !context) continue;
      const text = heading[1];
      if (text.startsWith('<')) {
        problem('warning', file, i + 1, `heading is still a template placeholder: "${text}"`);
        continue;
      }
      const [start, end] = blockRange(prose, i);
      const fields = () => parseFields(prose.slice(start + 1, end));

      if (fm.type === 'business-rules' || fm.type === 'use-cases') {
        const isRule = fm.type === 'business-rules';
        const match = (isRule ? /^([A-Z]{2,4})-BR-(\d{3})\b\s*(.*)$/ : /^([A-Z]{2,4})-UC-(\d{2})\b\s*(.*)$/).exec(text);
        const what = isRule ? 'rule' : 'use case';
        if (!match) {
          problem('error', file, i + 1, `${what} heading must start with <CODE>-${isRule ? 'BR-<NNN>' : 'UC-<NN>'}: "${text}"`);
          continue;
        }
        const id = `${match[1]}-${isRule ? 'BR' : 'UC'}-${match[2]}`;
        if (match[1] !== codeOf(context)) problem('error', file, i + 1, `${id}: prefix must be this context's code ${codeOf(context)}`);
        define(isRule ? model.rules : model.useCases, id, { id, context, title: match[3], file, line: i, end, fields: fields() }, what);
      } else if (CONCEPT_TYPES.has(fm.type)) {
        const name = text.split(/\s/)[0].replace(/[`*]/g, '');
        if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
          problem('error', file, i + 1, `concept heading must start with a PascalCase name: "${text}"`);
          continue;
        }
        const id = `${context}.${name}`;
        if (fm.type === 'aggregate' && id === fm.id) continue;
        define(model.concepts, id, { id, context, name, file, line: i, end, docType: fm.type }, 'concept');
      }
    }
  }

  resolveCodeRoot(model, codeRootArg);
  collectCitations(model);
  return model;
}

/** Context names mentioned in a table cell; "all" means every context. */
export function contextsIn(cell, model) {
  const text = plainCell(cell);
  if (/\ball\b/i.test(text)) return [...model.contexts.keys()];
  return [...model.contexts.keys()].filter((name) => new RegExp(`\\b${name}\\b`).test(text));
}

function resolveCodeRoot(model, codeRootArg) {
  const setting = codeRootArg ?? model.index?.fm?.code_root;
  model.codeRoot = setting ? path.resolve(codeRootArg ? process.cwd() : model.root, setting) : null;
  model.codeAvailable = Boolean(model.codeRoot && fs.existsSync(model.codeRoot));
  if (!model.codeRoot) model.codeNotice = 'No code_root set: code references were not checked.';
  else if (!model.codeAvailable) model.codeNotice = `Code root ${model.codeRoot} not found: code references were not checked.`;
}

/**
 * Every code path the ontology cites, with the definition it belongs to: the `###` definition the citation
 * sits under, else the document's id. Front matter `code_refs` belong to the document.
 */
function collectCitations(model) {
  for (const doc of model.docs) {
    if (!doc.fm || doc.fm.type === 'meta') continue;
    for (const ref of doc.fm.code_refs ?? []) {
      const [p, symbol] = ref.split('#');
      model.citations.push({ path: p, symbol, file: doc.file, line: 0, owner: doc.fm.id, context: doc.fm.context, docType: doc.fm.type, frontMatter: true });
    }
    let owner = doc.fm.id;
    for (let i = doc.bodyStart; i < doc.prose.length; i += 1) {
      const line = doc.prose[i];
      const h2 = /^##\s/.test(line);
      const h3 = /^###\s+(.+?)\s*$/.exec(line);
      if (h2) owner = doc.fm.id;
      if (h3) owner = definitionIdAt(model, doc, i) ?? doc.fm.id;
      for (const match of line.matchAll(/`([^`\s]+)`/g)) {
        const [p, symbol] = match[1].split('#');
        if (CODE_PATH.test(p) && !p.includes('<')) {
          model.citations.push({ path: p, symbol, file: doc.file, line: i, owner, context: doc.fm.context, docType: doc.fm.type });
        }
      }
    }
  }
}

/** The id defined by the `###` heading at a line, if any. */
export function definitionIdAt(model, doc, line) {
  for (const map of [model.rules, model.useCases, model.concepts]) {
    for (const entry of map.values()) if (entry.file === doc.file && entry.line === line) return entry.id;
  }
  return null;
}

/** Finds any defined thing by id: concept, rule, use case, question, decision, REL, FLOW, SD, ACT, context or doc. */
export function lookup(model, id) {
  const maps = [
    ['concept', model.concepts],
    ['rule', model.rules],
    ['use case', model.useCases],
    ['question', model.questions],
    ['decision', model.decisions],
    ['relationship', model.relationships],
    ['flow', model.flows],
    ['subdomain', model.subdomains],
    ['actor', model.actors],
  ];
  for (const [kind, map] of maps) if (map.has(id)) return { kind, ...map.get(id) };
  if (model.contexts.has(id)) return { kind: 'context', id, file: model.contexts.get(id).doc.file, line: 0 };
  const doc = model.docs.find((d) => d.fm?.id === id);
  return doc ? { kind: 'document', id, file: doc.file, line: 0 } : null;
}

/** The source lines of a definition (its whole heading block, or the whole file for documents). */
export function definitionText(model, entry) {
  const doc = model.docs.find((d) => d.file === entry.file);
  if (!doc) return '';
  if (!entry.line) return doc.lines.join('\n');
  const [start, end] = blockRange(doc.lines, entry.line);
  return doc.lines.slice(start, end).join('\n').trimEnd();
}

/** All code files under the code root, skipping dependency and build folders. */
export function codeFiles(model, { include = /\.(ts|tsx|js|jsx|mjs|cjs|py|cs|java|kt|go|rb|rs|php)$/ } = {}) {
  if (!model.codeAvailable) return [];
  const skip = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'out', 'coverage', 'vendor', 'target', '__pycache__', '.venv', 'bin', 'obj']);
  const out = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name) || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (include.test(entry.name)) out.push(toPosix(path.relative(model.codeRoot, full)));
    }
  };
  visit(model.codeRoot);
  return out;
}

export const TEST_FILE = /(\.(test|spec)\.[cm]?[jt]sx?$)|(__tests__\/)|(^|\/)tests?\/|(_test\.(go|py)$)|((^|\/)test_[^/]+\.py$)|(Tests?\.(cs|java|kt)$)/;
