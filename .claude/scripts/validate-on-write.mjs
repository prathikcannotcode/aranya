#!/usr/bin/env node

/**
 * Post-write validation hook. Validates JSON/JSONL files against their layout
 * schema after every write. Used as a PostToolUse hook on Write, Edit and MultiEdit.
 * Exits 2 so the agent sees the errors and fixes the file.
 */

import { resolve, relative } from 'node:path';
import { checkFile, workspaceRoot, realPath } from './lib.mjs';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let event;
  try { event = JSON.parse(raw); }
  catch { process.exit(0); }
  const filePath = event.tool_input?.file_path;
  if (!filePath) process.exit(0);

  const start = [event.cwd, process.cwd(), process.env.CLAUDE_PROJECT_DIR].find(dir => dir && workspaceRoot(dir));
  if (!start) process.exit(0);
  const root = realPath(workspaceRoot(start));

  const rel = relative(root, realPath(resolve(start, filePath))).replace(/\\/g, '/');
  const errors = checkFile(rel, root);
  if (errors.length) {
    console.error(`Validation failed for ${rel}:\n  ${errors.join('\n  ')}`);
    process.exit(2);
  }
  process.exit(0);
});
