#!/usr/bin/env node

/**
 * Write-guard hook. Blocks:
 * 1. Writes outside the workspace layout (.claude/schemas/layout.json)
 * 2. Writes to read-only paths (the legal catalog)
 * 3. Rewrites of append-only logs (flags.jsonl)
 * 4. An agent recording a calculator result as expert_validated
 * 5. Content containing secret-shaped strings (API keys, passwords, tokens)
 *
 * Used as a PreToolUse hook on Write, Edit and MultiEdit.
 * Reads the event from stdin, exits 2 to block with a message.
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { loadLayout, matchRule, workspaceRoot } from './lib.mjs';

const SECRET_PATTERNS = [
  /(?:api[_-]?key|apikey)["']?\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}/i,
  // A quoted or assigned value, or a bare `key: value` with a digit or symbol, so "password: hardcoded" in prose passes.
  /(?:secret|password|passwd|pwd)["']?\s*(?:[:=]\s*["'][^\s"']{8,}|=\s*[^\s"']{8,}|:\s*(?=[^\s"']*[\d!@#$%^&*])[^\s"']{8,})/i,
  /(?:bearer|token)\s+[A-Za-z0-9_\-\.]{20,}/i,
  /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/,
  /AKIA[0-9A-Z]{16}/,
  /gh[pousr]_[A-Za-z0-9]{36}/,
  /github_pat_[A-Za-z0-9_]{22,}/,
  /\bsk-[A-Za-z0-9_\-]{32,}/,
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

const lf = text => text.replace(/\r\n/g, '\n');

function guard(event) {
  const input = event.tool_input ?? {};
  const filePath = input.file_path;
  if (!filePath) return;

  // The event's cwd follows Claude; the others cover a cwd this platform can't read.
  const start = [event.cwd, process.cwd(), process.env.CLAUDE_PROJECT_DIR].find(dir => dir && workspaceRoot(dir));
  if (!start) block('no workspace layout found at or above the working directory');
  const root = workspaceRoot(start);

  const abs = resolve(start, filePath);
  const rel = relative(root, abs).replace(/\\/g, '/');
  if (rel === '..' || rel.startsWith('../') || isAbsolute(rel)) block(`path outside workspace: ${filePath}`);

  const rule = matchRule(loadLayout(root), rel);
  if (!rule) block(`path not in workspace layout: ${rel}. Agents may not write here; a maintainer can change the layout by hand.`);
  if (rule.readonly) block(`${rel} is read-only for agents. Ask a human to add or verify the entry against its primary source.`);

  if (rule.append_only && existsSync(abs)) {
    const before = readFileSync(abs, 'utf8');
    if (!lf(contentAfter(before, event.tool_name, input)).startsWith(lf(before))) {
      block(`${rel} is append-only. Add new entries at the end; never modify or delete existing ones.`);
    }
  }

  const content = [input.content, ...editsOf(input).map(e => e.new_string)].filter(Boolean).join('\n');
  if (/"validation_status"\s*:\s*"expert_validated"/.test(content)) {
    block('only a named human expert records expert_validated, by hand, with validated_by and validated_at.');
  }
  if (SECRET_PATTERNS.some(p => p.test(content))) {
    block('content looks like it contains a secret (API key, password, or token). Store secrets in environment variables or encrypted references.');
  }
}

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let event;
  try { event = JSON.parse(raw); }
  catch { process.exit(0); } // not a tool event we understand; nothing to guard

  // Only exit 2 blocks, so an unexpected error here must not let the write through.
  try { guard(event); }
  catch (e) { block(`guard error: ${e.message}`); }
  process.exit(0);
});
