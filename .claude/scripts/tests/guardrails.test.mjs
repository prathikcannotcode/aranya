import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLayout, matchRule, checkFile, workspaceRoot, frontmatterErrors } from '../lib.mjs';

const scripts = join(dirname(fileURLToPath(import.meta.url)), '..');
const repo = join(scripts, '..', '..');

function run(script, { cwd = repo, input, args = [] } = {}) {
  return spawnSync(process.execPath, [join(scripts, script), ...args], {
    cwd, input: typeof input === 'string' ? input : input && JSON.stringify(input), encoding: 'utf8',
  });
}

// A throwaway workspace with the real layout, schemas and catalog and one flag log.
function workspace() {
  const dir = mkdtempSync(join(tmpdir(), 'aranya-'));
  mkdirSync(join(dir, '.claude/schemas'), { recursive: true });
  for (const f of ['layout.json', 'finding.schema.json', 'flag.schema.json', 'calc-result.schema.json', 'catalog.schema.json', 'sourced-item.schema.json']) {
    copyFileSync(join(repo, '.claude/schemas', f), join(dir, '.claude/schemas', f));
  }
  mkdirSync(join(dir, 'catalog'));
  copyFileSync(join(repo, 'catalog/provisions.json'), join(dir, 'catalog/provisions.json'));
  mkdirSync(join(dir, 'matters/m1/findings'), { recursive: true });
  mkdirSync(join(dir, 'matters/m1/calc'));
  writeFileSync(join(dir, 'matters/m1/flags.jsonl'), '{"a":1}\n{"b":2}\n');
  return dir;
}

const realFinding = () => JSON.parse(readFileSync(join(repo, 'matters/sample-estuary/findings/F-0001.json'), 'utf8'));
const realRun = () => JSON.parse(readFileSync(join(repo, 'matters/sample-estuary/calc/run-1.json'), 'utf8'));

test('sample workspace passes schema validation', () => {
  const r = run('validate.mjs', { args: ['--strict'] });
  assert.equal(r.status, 0, r.stderr);
});

test('layout matches data paths and rejects strays', () => {
  const layout = loadLayout(repo);
  assert.equal(matchRule(layout, 'matters/m1/findings/F-0001.json').schema, 'finding.schema.json');
  assert.equal(matchRule(layout, 'matters/m1/flags.jsonl').append_only, true);
  assert.equal(matchRule(layout, 'catalog/provisions.json').readonly, true);
  assert.equal(matchRule(layout, 'matters/m1/inputs/run-2.json').schema, 'injury-params.schema.json');
  assert.equal(matchRule(layout, 'src/app.js'), undefined);
});

test('agents cannot write the guards that bind them', () => {
  const layout = loadLayout(repo);
  for (const p of ['.claude/scripts/write-guard.mjs', '.claude/schemas/layout.json', '.claude/schemas/calc-result.schema.json', '.claude/settings.json', '.claude/settings.local.json', 'package.json']) { // package.json: `npm test` is pre-approved, so its scripts are a guard too
    assert.equal(matchRule(layout, p), undefined, p);
  }
  assert.ok(matchRule(layout, '.claude/skills/env-catalog/SKILL.md'));
});

test('write-guard enforces layout, the read-only catalog and append-only flags', () => {
  const dir = workspace();
  const guard = input => run('write-guard.mjs', { cwd: dir, input }).status;
  const log = 'matters/m1/flags.jsonl';

  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: 'README.md', content: 'hi' } }), 0);
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: 'src/app.js', content: 'hi' } }), 2);
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: '../elsewhere/x.md', content: 'hi' } }), 2);
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: 'catalog/provisions.json', content: '{}' } }), 2);

  assert.equal(guard({ tool_name: 'Edit', tool_input: { file_path: log, old_string: '{"b":2}\n', new_string: '{"b":2}\n{"c":3}\n' } }), 0);
  assert.equal(guard({ tool_name: 'Edit', tool_input: { file_path: log, old_string: '{"a":1}', new_string: '{"a":9}' } }), 2);
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: log, content: '{"b":2}\n' } }), 2);
  assert.equal(guard({ tool_name: 'MultiEdit', tool_input: { file_path: log, edits: [{ old_string: '{"b":2}', new_string: '' }] } }), 2);

  writeFileSync(join(dir, log), '{"a":1}\r\n{"b":2}\r\n');
  assert.equal(guard({ tool_name: 'Write', tool_input: { file_path: log, content: '{"a":1}\n{"b":2}\n{"c":3}\n' } }), 0, 'CRLF checkout must not block a real append');
  rmSync(dir, { recursive: true });
});

test('write-guard stops an agent recording expert validation', () => {
  const dir = workspace();
  const r = run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path: 'matters/m1/calc/run-1.json', content: '{ "validation_status": "expert_validated" }' } } });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /only a named human expert/);

  const file = 'matters/m1/calc/run-1.json';
  const guard = (tool_name, tool_input) => run('write-guard.mjs', { cwd: dir, input: { tool_name, tool_input: { file_path: file, ...tool_input } } }).status;
  writeFileSync(join(dir, file), '{ "validation_status": "pending_expert_review", "label": "x" }');
  assert.equal(guard('Edit', { old_string: 'pending_expert_review', new_string: 'expert_validated' }), 2, 'an Edit that swaps only the value');
  assert.equal(guard('Write', { content: '{ "validation_status": "expert\\u005fvalidated" }' }), 2, 'a unicode escape');
  assert.equal(guard('Edit', { old_string: '"x"', new_string: '"y"' }), 0, 'an ordinary edit still passes');
  rmSync(dir, { recursive: true });
});

test('another spelling of a guarded path is still guarded', { skip: !existsSync(join(repo, 'PACKAGE.JSON')) && 'case-sensitive disk' }, () => {
  const dir = workspace();
  const guard = (file_path, content) => run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path, content } } }).status;
  assert.equal(guard('catalog/Provisions.json', '{}'), 2);
  assert.equal(guard('matters/m1/FLAGS.jsonl', ''), 2);
  rmSync(dir, { recursive: true });
});

test('write-guard catches key formats and leaves ordinary prose alone', () => {
  const dir = workspace();
  const guard = content => run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path: 'README.md', content } } }).status;
  for (const s of ['key AKIA' + 'Q'.repeat(16), 'github_pat_' + 'a'.repeat(40), 'sk-ant-api03-' + 'a'.repeat(32), '-----BEGIN OPENSSH ' + 'PRIVATE KEY-----', 'pass' + 'word=plainvalue']) {
    assert.equal(guard(s), 2, s);
  }
  assert.equal(guard('Database pass' + 'word: hardcoded in config'), 0);
  rmSync(dir, { recursive: true });
});

test('hooks find the workspace from a subdirectory and block with exit 2', () => {
  const dir = workspace();
  const cwd = join(dir, 'matters/m1/findings');
  assert.equal(workspaceRoot(cwd), workspaceRoot(dir));
  const blocked = run('write-guard.mjs', { cwd, input: { tool_name: 'Write', tool_input: { file_path: join(dir, 'src/app.js'), content: 'x' } } });
  assert.equal(blocked.status, 2, blocked.stderr);
  const viaEvent = run('write-guard.mjs', { cwd: tmpdir(), input: { cwd, tool_name: 'Write', tool_input: { file_path: join(dir, 'src/app.js'), content: 'x' } } });
  assert.equal(viaEvent.status, 2, viaEvent.stderr);
  const unreadable = run('write-guard.mjs', { cwd: dir, input: { cwd: '/no/such/dir', tool_name: 'Write', tool_input: { file_path: join(dir, 'README.md'), content: 'x' } } });
  assert.equal(unreadable.status, 0, unreadable.stderr);
  rmSync(dir, { recursive: true });
});

test('write-guard fails closed on events it cannot read', () => {
  const dir = workspace();
  const guard = input => run('write-guard.mjs', { cwd: dir, input }).status;
  for (const input of ['', 'not json', 'null', '{}', { tool_name: 'Write' }, { tool_name: 'Write', tool_input: {} }, { tool_name: 'Edit', tool_input: { file_path: '' } }]) {
    assert.equal(guard(input), 2, JSON.stringify(input));
  }
  assert.equal(guard({ tool_name: 'TodoWrite', tool_input: { todos: [] } }), 0, 'a tool that writes no file, caught by a loose matcher');
  assert.equal(guard({ tool_name: 'NotebookEdit', tool_input: { notebook_path: 'src/x.ipynb', new_source: 'x' } }), 2);
  assert.equal(guard({ tool_name: 'NotebookEdit', tool_input: { notebook_path: 'catalog/provisions.json', new_source: '{}' } }), 2);
  assert.equal(guard({ tool_name: 'NotebookEdit', tool_input: { notebook_path: 'matters/m1/flags.jsonl', new_source: '{"c":3}' } }), 2);
  assert.equal(guard({ tool_name: 'NotebookEdit', tool_input: { notebook_path: 'docs/x.ipynb', new_source: 'x' } }), 0);
  const { hooks } = JSON.parse(readFileSync(join(repo, '.claude/settings.json'), 'utf8'));
  assert.match(hooks.PreToolUse[0].matcher, /\bNotebookEdit\b/);
  rmSync(dir, { recursive: true });
});

test('write-guard fails closed when the layout is broken', () => {
  const dir = workspace();
  writeFileSync(join(dir, '.claude/schemas/layout.json'), '{ not json');
  const r = run('write-guard.mjs', { cwd: dir, input: { tool_name: 'Write', tool_input: { file_path: 'README.md', content: 'x' } } });
  assert.equal(r.status, 2);
  rmSync(dir, { recursive: true });
});

test('a finding must point at a real catalog entry', () => {
  const dir = workspace();
  const check = finding => {
    writeFileSync(join(dir, 'matters/m1/findings/F-1.json'), JSON.stringify(finding));
    return checkFile('matters/m1/findings/F-1.json', dir).join('\n');
  };
  assert.equal(check(realFinding()), '');

  const { source_url, verification, ...unsourced } = realFinding();
  assert.match(check(unsourced), /missing required "source_url"/);
  assert.match(check({ ...realFinding(), catalog_id: 'made-up-2031' }), /"made-up-2031" is not in catalog/);
  const { catalog_id, ...noEntry } = realFinding();
  assert.match(check(noEntry), /missing required "catalog_id"/);
  assert.match(check({ ...realFinding(), source_url: 'https://indiankanoon.org/doc/1/' }), /source_url: must match/);
  assert.match(check({ ...realFinding(), verification: 'unverified' }), /verification: must match/);

  const catalog = JSON.parse(readFileSync(join(repo, 'catalog/provisions.json'), 'utf8'));
  const water = catalog.instruments.find(e => e.id === 'water-1974');
  const onWater = provision => check({ ...realFinding(), catalog_id: water.id, source_url: water.source_url, verification: water.verification, provision });
  for (const p of ['s.999', 'Section 33A', 'para 7', 'Schedule I', 'Appendix IV', 'Rule 5(1)', 'clause (k)']) {
    assert.match(onWater(p), /holds only as a whole instrument/, p);
  }
  for (const p of ['The Act as a whole', 'Water (Prevention and Control of Pollution) Act, 1974', 'Hazardous Waste Rules 2016', "the Act's 2010 amendment"]) {
    assert.equal(onWater(p), '', p);
  }
  rmSync(dir, { recursive: true });
});

test('expert validation needs a name and a date', () => {
  const dir = workspace();
  const check = result => {
    writeFileSync(join(dir, 'matters/m1/calc/run.json'), JSON.stringify(result));
    return checkFile('matters/m1/calc/run.json', dir).join('\n');
  };
  assert.equal(check(realRun()), '');
  assert.match(check({ ...realRun(), validation_status: 'expert_validated' }), /needs validated_by/);
  assert.equal(check({ ...realRun(), validation_status: 'expert_validated', validated_by: 'Named Ecologist', validated_at: '2026-11-04' }), '');
  assert.match(check({ ...realRun(), methodology_status: 'established' }), /must be one of novel_persuasive/);
  rmSync(dir, { recursive: true });
});

test('validate-on-write exits 2 so the agent sees errors', () => {
  const dir = workspace();
  writeFileSync(join(dir, 'matters/m1/findings/F-1.json'), JSON.stringify({ ...realFinding(), catalog_id: 'made-up' }));
  const r = run('validate-on-write.mjs', { cwd: dir, input: { tool_input: { file_path: 'matters/m1/findings/F-1.json' } } });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /not in catalog/);
  assert.equal(run('validate-on-write.mjs', { cwd: dir, input: 'not json' }).status, 2, 'an unreadable event must not pass silently');
  rmSync(dir, { recursive: true });
});

test('frontmatter must be valid YAML', () => {
  const skill = description => `---\nname: x\ndescription: ${description}\n---\n`;
  assert.deepEqual(frontmatterErrors(skill('Plain text. Use for things.'), 'x'), []);
  assert.deepEqual(frontmatterErrors(skill('"Quoted: with a colon and \\"inner\\" quotes."'), 'x'), []);
  assert.match(frontmatterErrors(skill('Bare: colon'), 'x').join(), /not valid YAML/);
  assert.match(frontmatterErrors('---\nname: y\n---\n', 'x').join(), /needs "name: x".*needs a description/);
});

test('hook commands find the guard, even when the project dir is stale', { skip: process.platform === 'win32' }, () => { // bash on Windows may resolve to WSL
  const { hooks } = JSON.parse(readFileSync(join(repo, '.claude/settings.json'), 'utf8'));
  const hook = (event, cwd, projectDir, file) => spawnSync('bash', ['-c', hooks[event][0].hooks[0].command], {
    cwd, encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
    input: JSON.stringify({ tool_name: 'Write', tool_input: { file_path: join(repo, file), content: 'x' } }),
  }).status;
  assert.equal(hook('PreToolUse', repo, repo, 'src/app.js'), 2);
  assert.equal(hook('PreToolUse', repo, repo, 'README.md'), 0);
  assert.equal(hook('PreToolUse', join(repo, 'docs'), repo, 'src/app.js'), 2, 'after a cd');
  assert.equal(hook('PreToolUse', repo, '/no/such/dir', 'src/app.js'), 2, 'session moved in from elsewhere');
  assert.equal(hook('PreToolUse', repo, '/no/such/dir', 'README.md'), 0, 'session moved in from elsewhere');
  assert.equal(hook('PreToolUse', join(repo, 'docs'), '/no/such/dir', 'README.md'), 1, 'cannot find the guard, so onFailure: block applies');
  assert.equal(hook('PostToolUse', repo, '/no/such/dir', 'README.md'), 0);
  assert.equal(hooks.PreToolUse[0].hooks[0].onFailure, 'block');
});
