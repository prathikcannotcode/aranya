#!/usr/bin/env node

/**
 * Post-write validation hook. Validates JSON/JSONL files against their layout
 * schema after every write. Used as a PostToolUse hook on Write, Edit and MultiEdit.
 * Exits 2 so the agent sees the errors and fixes the file.
 */

import { resolve, relative } from 'node:path';
import { checkFile } from './lib.mjs';

const root = process.cwd();

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let filePath;
  try { filePath = JSON.parse(raw).tool_input?.file_path; }
  catch { process.exit(0); }
  if (!filePath) process.exit(0);

  const rel = relative(root, resolve(root, filePath)).replace(/\\/g, '/');
  const errors = checkFile(rel, root);
  if (errors.length) {
    console.error(`Validation failed for ${rel}:\n  ${errors.join('\n  ')}`);
    process.exit(2);
  }
  process.exit(0);
});
