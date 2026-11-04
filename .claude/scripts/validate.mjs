#!/usr/bin/env node

/**
 * Validates workspace JSON/JSONL files against their schemas and checks that
 * every skill has the SKILL.md frontmatter Claude Code needs to discover it.
 *
 * Run: npm run validate
 *      npm run validate -- --strict   (also fails on data files outside the layout)
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { listFiles, loadLayout, matchRule, checkFile, frontmatterErrors } from './lib.mjs';

const root = process.cwd();
const strict = process.argv.includes('--strict');
const layout = loadLayout(root);
let errors = 0;
let checked = 0;

function fail(message) {
  console.error(message);
  errors++;
}

for (const rel of listFiles(root)) {
  const ext = extname(rel);
  if (strict && /^(matters|catalog)\//.test(rel) && !matchRule(layout, rel)) {
    fail(`OUTSIDE LAYOUT: ${rel}`);
  }
  if (ext !== '.json' && ext !== '.jsonl') continue;
  checked++;
  for (const e of checkFile(rel, root, layout)) fail(`INVALID: ${rel}\n  ${e}`);
}

const skillsDir = join(root, '.claude/skills');
let skills = 0;
for (const name of existsSync(skillsDir) ? readdirSync(skillsDir) : []) {
  const file = join(skillsDir, name, 'SKILL.md');
  if (!existsSync(file)) { fail(`SKILL: .claude/skills/${name} has no SKILL.md`); continue; }
  skills++;
  for (const e of frontmatterErrors(readFileSync(file, 'utf8'), name)) fail(`SKILL: ${name}/SKILL.md ${e}`);
}

console.log(`Checked ${checked} data files and ${skills} skills, ${errors} error(s).`);
if (errors > 0) process.exit(1);
if (strict && checked === 0) {
  console.error('No JSON files found in workspace.');
  process.exit(1);
}
