# Security policy

## Reporting a vulnerability

Report security issues privately through [GitHub security advisories](https://github.com/prathikcannotcode/aranya/security/advisories/new). Do not open a public issue.

Include what you found, how to reproduce it, and the impact.

## In scope

- Bypasses of the write-guard hook (writing outside `layout.json`, editing the catalog, rewriting a flag log, recording `expert_validated`, smuggling a secret past the patterns)
- Schema and catalog validation bypasses
- Any path where Aranya copies matter data somewhere the user did not ask for

## Known limits

- Hooks guard Claude Code's Write, Edit, MultiEdit and NotebookEdit tools. A shell command run through the Bash tool is not intercepted. The calculator's `--out` checks itself: it writes only a new `matters/<id>/calc/<run>.json` and never overwrites one. Keep Bash permissions narrow (`.claude/settings.json` allows only the validate, test and calculator commands by default).
- `onFailure: block` needs Claude Code 2.1.295 or newer. On older versions, a hook that cannot start at all does not block the write.
- The hook command looks for the guard under `${CLAUDE_PROJECT_DIR}`, the folder a session started in, then relative to the working directory. A session that moved here from elsewhere and then changed into a subdirectory can't find it, so writes are blocked until it returns to the repo root.
- On Windows without Git Bash, Claude Code runs hooks in PowerShell, which can't parse this command. The write-guard then blocks every write, and post-write validation does not run. Install Git for Windows.
- The guard blocks a hook event it cannot parse, one with no `tool_name` or `tool_input`, and a file tool with no path. An event from a tool that writes no file, such as TodoWrite caught by a loose matcher, passes. The post-write validator reports an event it cannot parse instead of skipping it.
- A finding on an instrument-level catalog entry fails when its `provision` names a numbered section, para, rule, schedule or appendix ("s.33A", "Appendix IV") that the entry's own summary does not quote. A part named without a number, such as "General Condition", still passes. So does a number the summary uses for something else (the CPCB scale factor 1.5 reads as a clause 1.5), and a finding on a section's own entry that also names a neighbouring section.
- Validation checks that a finding matches a catalog entry. It can't check that the entry is correct, that a `validated_by` name is genuine, or what a Markdown draft claims. A person has to review those.
- The secret patterns catch common key formats. They are a tripwire, not a scanner.

## Your data

Aranya runs locally on your machine and your model provider. It has no server and no telemetry. Matters you create stay in your clone and are gitignored by default. Client matters can be confidential or privileged, so keep them out of any public fork.
