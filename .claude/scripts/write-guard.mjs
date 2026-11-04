#!/usr/bin/env node

/**
 * Write-guard hook. Blocks:
 * 1. Writes outside the workspace layout (.claude/schemas/layout.json)
 * 2. Rewrites of append-only logs (breach-log.jsonl, rights-log.jsonl)
 * 3. Content containing secret-shaped strings (API keys, passwords, tokens)
 *
 * Used as a PreToolUse hook on Write, Edit and MultiEdit.
 * Reads the event from stdin, exits 2 to block with a message.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { loadLayout, matchRule } from './lib.mjs';

const root = process.cwd();

const SECRET_PATTERNS = [
  /(?:api[_-]?key|apikey)\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}/i,
  /(?:secret|password|passwd|pwd)\s*[:=]\s*["']?[^\s"']{8,}/i,
  /(?:bearer|token)\s+[A-Za-z0-9_\-\.]{20,}/i,
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /ghp_[A-Za-z0-9]{36}/,
  /sk-[A-Za-z0-9]{32,}/,
];

function block(reason) {
  console.error(`Write blocked: ${reason}`);
  process.exit(2);
}

function editsOf(input) {
  if (Array.isArray(input.edits)) return input.edits;
  if (input.old_string !== undefined) return [input];
  return [];
}

// The file content after the tool runs, so append-only checks see the real result.
function contentAfter(before, toolName, input) {
  if (toolName === 'Write') return input.content ?? '';
  let text = before;
  for (const { old_string: from, new_string: to, replace_all } of editsOf(input)) {
    if (replace_all) text = text.split(from).join(to);
    else {
      const i = text.indexOf(from);
      if (i !== -1) text = text.slice(0, i) + to + text.slice(i + from.length);
    }
  }
  return text;
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let event;
  try { event = JSON.parse(raw); }
  catch { process.exit(0); } // not a tool event we understand; nothing to guard

  const input = event.tool_input ?? {};
  const filePath = input.file_path;
  if (!filePath) process.exit(0);

  const abs = resolve(root, filePath);
  const rel = relative(root, abs).replace(/\\/g, '/');
  if (rel === '..' || rel.startsWith('../') || isAbsolute(rel)) block(`path outside workspace: ${filePath}`);

  const rule = matchRule(loadLayout(root), rel);
  if (!rule) block(`path not in workspace layout: ${rel}. Add a rule to .claude/schemas/layout.json first.`);

  if (rule.append_only && existsSync(abs)) {
    const before = readFileSync(abs, 'utf8');
    if (!contentAfter(before, event.tool_name, input).startsWith(before)) {
      block(`${rel} is append-only. Add new entries at the end; never modify or delete existing ones.`);
    }
  }

  const content = [input.content, ...editsOf(input).map(e => e.new_string)].filter(Boolean).join('\n');
  if (SECRET_PATTERNS.some(p => p.test(content))) {
    block('content looks like it contains a secret (API key, password, or token). Store secrets in environment variables or encrypted references.');
  }

  process.exit(0);
});
