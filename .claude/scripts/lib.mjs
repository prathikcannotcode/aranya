/**
 * Shared helpers for Aranya's hooks and scripts: workspace layout and JSON
 * Schema validation. Node built-ins only, so a fresh clone needs no install.
 */

import { readFileSync, readdirSync, statSync, existsSync, realpathSync } from 'node:fs';
import { join, extname, relative, resolve, dirname, basename } from 'node:path';

const SCHEMA_DIR = '.claude/schemas';
const SKIP_DIRS = new Set(['.git', 'node_modules']);

/** The nearest directory at or above `start` holding a workspace layout, so hooks survive a `cd` and worktrees. */
export function workspaceRoot(start = process.cwd()) {
  for (let dir = resolve(start); ; dir = dirname(dir)) {
    if (existsSync(join(dir, SCHEMA_DIR, 'layout.json'))) return dir;
    if (dirname(dir) === dir) return undefined;
  }
}

/** The path as the disk spells it, so another case or a symlink cannot dodge a layout rule. */
export function realPath(path) {
  if (existsSync(path)) return realpathSync.native(path);
  const parent = dirname(path);
  return parent === path ? path : join(realPath(parent), basename(path));
}

/** Problems with a SKILL.md frontmatter. A bare `: ` or ` #` in a value is not valid YAML. */
export function frontmatterErrors(text, name) {
  const front = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const errors = [];
  if (!new RegExp(`^name: ${name}\\s*$`, 'm').test(front)) errors.push(`frontmatter needs "name: ${name}"`);
  const description = front.match(/^description: (.+?)\s*$/m)?.[1];
  if (!description) errors.push('frontmatter needs a description');
  else if (description.startsWith('"') ? !/^"(?:[^"\\]|\\.)*"$/.test(description) : /: | #/.test(description)) {
    errors.push('description is not valid YAML: wrap it in double quotes and escape inner quotes');
  }
  return errors;
}

export function loadLayout(root = process.cwd()) {
  const layout = JSON.parse(readFileSync(join(root, SCHEMA_DIR, 'layout.json'), 'utf8'));
  return layout.paths.map(rule => ({ ...rule, regex: patternToRegex(rule.pattern) }));
}

// `*` matches one path segment, `**` matches any depth.
function patternToRegex(pattern) {
  const escape = s => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const body = pattern.split('**').map(part => part.split('*').map(escape).join('[^/]+')).join('.*');
  return new RegExp(`^${body}$`);
}

export function matchRule(layout, relPath) {
  return layout.find(rule => rule.regex.test(relPath));
}

/** Workspace-relative paths (forward slashes) of every file under `dir`. */
export function listFiles(dir, root = dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, root));
    else out.push(relative(root, full).replace(/\\/g, '/'));
  }
  return out;
}

// ---------------------------------------------------------------------------
// JSON Schema validation
// shortcut: covers the draft 2020-12 keywords our schemas use and throws on any
// other keyword, so a schema can never pass silently. Swap in ajv if schemas
// need oneOf/allOf/$defs.

const SUPPORTED = new Set([
  '$schema', '$id', '$ref', 'title', 'description', 'default', 'examples',
  'type', 'enum', 'required', 'properties', 'additionalProperties', 'items',
  'pattern', 'format', 'minLength', 'minimum', 'maximum', 'minItems',
]);

const FORMATS = {
  'date-time': v => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/.test(v) && !Number.isNaN(Date.parse(v)),
  date: v => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)),
  uri: v => /^https?:\/\/[^\s]+$/.test(v),
};

const TYPES = {
  string: v => typeof v === 'string',
  number: v => typeof v === 'number' && Number.isFinite(v),
  integer: v => Number.isInteger(v),
  boolean: v => typeof v === 'boolean',
  null: v => v === null,
  array: v => Array.isArray(v),
  object: v => v !== null && typeof v === 'object' && !Array.isArray(v),
};

const schemaCache = new Map();

export function loadSchema(name, root = process.cwd()) {
  const file = join(root, SCHEMA_DIR, name);
  if (!schemaCache.has(file)) schemaCache.set(file, JSON.parse(readFileSync(file, 'utf8')));
  return schemaCache.get(file);
}

/** Returns a list of human-readable errors; empty means valid. */
export function validate(schema, value, at = '$', root = process.cwd(), errors = []) {
  for (const key of Object.keys(schema)) {
    if (!SUPPORTED.has(key)) throw new Error(`Unsupported schema keyword "${key}" at ${at}`);
  }
  if (schema.$ref) return validate(loadSchema(schema.$ref, root), value, at, root, errors);

  const types = [].concat(schema.type ?? []);
  if (types.length && !types.some(t => TYPES[t]?.(value))) {
    errors.push(`${at}: expected ${types.join(' or ')}`);
    return errors;
  }
  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${at}: must be one of ${schema.enum.map(String).join(', ')}`);
  }
  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) errors.push(`${at}: does not match ${schema.pattern}`);
    if (schema.format && FORMATS[schema.format] && !FORMATS[schema.format](value)) errors.push(`${at}: not a valid ${schema.format}`);
    if (schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${at}: shorter than ${schema.minLength}`);
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) errors.push(`${at}: below minimum ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) errors.push(`${at}: above maximum ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) errors.push(`${at}: needs at least ${schema.minItems} item(s)`);
    if (schema.items) value.forEach((item, i) => validate(schema.items, item, `${at}[${i}]`, root, errors));
  }
  if (TYPES.object(value)) {
    for (const key of schema.required ?? []) {
      if (!(key in value)) errors.push(`${at}: missing required "${key}"`);
    }
    for (const [key, child] of Object.entries(value)) {
      if (schema.properties?.[key]) validate(schema.properties[key], child, `${at}.${key}`, root, errors);
      else if (schema.additionalProperties === false) errors.push(`${at}: unexpected property "${key}"`);
    }
  }
  return errors;
}

/** Parses a .json/.jsonl file and validates it against the schema its layout rule names. */
export function checkFile(relPath, root = process.cwd(), layout = loadLayout(root)) {
  const ext = extname(relPath);
  if (ext !== '.json' && ext !== '.jsonl') return [];
  const text = readFileSync(join(root, relPath), 'utf8');

  const records = [];
  if (ext === '.json') {
    try { records.push(['$', JSON.parse(text)]); }
    catch (e) { return [`invalid JSON: ${e.message}`]; }
  } else {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      try { records.push([`line ${i + 1}`, JSON.parse(lines[i])]); }
      catch (e) { return [`line ${i + 1}: invalid JSON: ${e.message}`]; }
    }
  }

  const rule = matchRule(layout, relPath);
  if (!rule?.schema) return [];
  const schema = loadSchema(rule.schema, root);
  return records.flatMap(([at, value]) => {
    const errors = validate(schema, value, at, root);
    if (errors.length) return errors;
    if (rule.schema === 'finding.schema.json') return findingSourceErrors(value, at, root);
    if (rule.schema === 'calc-result.schema.json') return expertGateErrors(value, at);
    return [];
  });
}

// A section, para, rule or schedule followed by its number: "s.15(3)", "para 7", "Schedule I", "Appendix IV".
// Up to three digits, so a year ("Rules 2016") is not read as a rule number.
// shortcut: a part named without a number, such as "General Condition", is not caught; widen the list if runs show it.
const NAMES_A_PART = /\b(?:ss?\.|(?:sections?|paras?|paragraphs?|rules?|regulations?|clauses?|schedules?|appendix|appendices|articles?|arts?|items?)\.?)\s*(?:\d{1,3}(?!\d)|[IVXL]+\b|\([a-z0-9]+\))/i;

// A finding must point at a catalog entry and repeat its source and state, so neither can be made up.
function findingSourceErrors(finding, at, root) {
  const catalog = JSON.parse(readFileSync(join(root, 'catalog/provisions.json'), 'utf8'));
  const entry = Object.values(catalog).filter(Array.isArray).flat().find(e => e.id === finding.catalog_id);
  if (!entry) return [`${at}.catalog_id: "${finding.catalog_id}" is not in catalog/provisions.json`];
  const errors = [];
  // An instrument entry vouches for the instrument as a whole, not for a section nobody has catalogued.
  if (catalog.instruments?.includes(entry) && NAMES_A_PART.test(finding.provision)) {
    errors.push(`${at}.provision: "${finding.provision}" names part of ${entry.id}, which the catalog holds only as a whole instrument. Cite that part's own catalog entry, or raise a flag and ask a human to add one.`);
  }
  if (finding.source_url !== entry.source_url) errors.push(`${at}.source_url: must match the catalog entry (${entry.source_url})`);
  if (finding.verification !== entry.verification) errors.push(`${at}.verification: must match the catalog entry (${entry.verification})`);
  return errors;
}

function expertGateErrors(result, at) {
  if (result.validation_status !== 'expert_validated' || (result.validated_by && result.validated_at)) return [];
  return [`${at}: expert_validated needs validated_by (the expert's name) and validated_at`];
}

export function packageVersion(root = process.cwd()) {
  return JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
}
