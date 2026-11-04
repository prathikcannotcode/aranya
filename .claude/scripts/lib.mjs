/**
 * Shared helpers for Aranya's hooks and scripts: workspace layout and JSON
 * Schema validation. Node built-ins only, so a fresh clone needs no install.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const SCHEMA_DIR = '.claude/schemas';
const SKIP_DIRS = new Set(['.git', 'node_modules']);

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
  return records.flatMap(([at, value]) => validate(schema, value, at, root));
}

export function packageVersion(root = process.cwd()) {
  return JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
}
