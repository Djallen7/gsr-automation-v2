# GSR Automation — Claude Code Rules

These rules are mandatory in every session. They exist because this system touches production hardware used by a ministry team.

## Security Rules

**Credentials**
- Never paste or expose credentials in chat
- Always retrieve via 1Password CLI: `op item get "[item name]" --fields password --reveal`
- Reference credentials by their 1Password item name only — never ask the user to paste a password

**SSH & Remote Access**
- Never SSH into any production machine without the user explicitly saying "yes, SSH into [machine name]"
- Never attempt login to any server, NAS, or network device without that exact confirmation

**Before any command touching a network resource, server, or shared drive**
- State exactly what the command will do
- State what else is connected to or could be affected by it
- Wait for confirmation before running

## Operational Rules

**Scope**
- Only touch the one folder explicitly designated for the current session
- Never access parent directories, adjacent shares, or broader network paths
- If scope is unclear, ask before doing anything

**Blast radius check**
- Before running any command: could this affect anything other than what we're working on?
- If yes, or if uncertain — stop and ask first

**ProPresenter**
- All ProPresenter automation work happens on a test machine only
- Never connect to or send commands to the production ProPresenter machine via any automated process until explicitly approved by David

**The David rule**
- Before any action, ask: if this goes wrong, does it fall on David to fix it?
- If yes — redesign the approach until the answer is no

## Context

Read `docs/MASTER_CONTEXT.md` at the start of any session to get full project context.
Read `docs/SESSION_HANDOFF.md` for where things left off.
