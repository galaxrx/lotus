#!/usr/bin/env node
// Galaxera Product Advisor — Codex consultation wrapper.
//
// Invokes OpenAI Codex as a READ-ONLY product/UX/UI advisor and streams its
// Markdown review to stdout. Advisory only: Codex is run in a read-only sandbox
// and must never edit, install, commit, push, or deploy.
//
// Usage:
//   node consult-codex.mjs [--mode pre-implementation|post-implementation] \
//                          [--context <file>] [--timeout <ms>]
//   ... | node consult-codex.mjs --mode post-implementation   # context on stdin
//
// Exit codes:
//   0  success (Codex review printed to stdout)
//   1  usage / empty-input error
//   2  Codex executable not found (install/auth required)
//   3  installed Codex cannot be run read-only — refusing to auto-invoke
//   4  Codex invocation failed (spawn error or timeout)
//   5  Codex ran but exited non-zero
//
// No external dependencies. Uses only Node's stdlib. Args are passed to Codex as
// an array (never through a shell) so paths with spaces and arbitrary context
// are safe. Secrets and environment variables are never logged.

import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = resolve(__dirname, '..');
const CONTRACT_PATH = join(SKILL_DIR, 'references', 'review-contract.md');

const DEFAULT_TIMEOUT_MS = Number(process.env.CODEX_TIMEOUT_MS || 180000);

function die(code, msg) {
  process.stderr.write(msg.endsWith('\n') ? msg : msg + '\n');
  process.exit(code);
}

// ---- Parse arguments -------------------------------------------------------
function parseArgs(argv) {
  const out = { mode: 'pre-implementation', context: null, timeout: DEFAULT_TIMEOUT_MS };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--mode' || a === '-m') out.mode = argv[++i];
    else if (a === '--context' || a === '-c') out.context = argv[++i];
    else if (a === '--timeout' || a === '-t') out.timeout = Number(argv[++i]);
    else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: consult-codex.mjs [--mode pre-implementation|post-implementation] ' +
          '[--context <file>] [--timeout <ms>]\n' +
          'Context may also be provided on stdin.\n'
      );
      process.exit(0);
    } else if (!a.startsWith('-') && !out.context) {
      out.context = a; // positional context file
    } else {
      die(1, `Unknown argument: ${a}`);
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

const VALID_MODES = new Set(['pre-implementation', 'post-implementation']);
if (!VALID_MODES.has(args.mode)) {
  die(1, `Invalid --mode "${args.mode}". Use "pre-implementation" or "post-implementation".`);
}
if (!Number.isFinite(args.timeout) || args.timeout <= 0) {
  args.timeout = DEFAULT_TIMEOUT_MS;
}

// ---- Read context (file or stdin) ------------------------------------------
function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

let contextText = '';
if (args.context) {
  const p = resolve(args.context);
  if (!existsSync(p) || !statSync(p).isFile()) {
    die(1, `Context file not found: ${args.context}`);
  }
  contextText = readFileSync(p, 'utf8');
} else if (!process.stdin.isTTY) {
  contextText = readStdin();
}

if (!contextText || contextText.trim().length === 0) {
  die(
    1,
    'No consultation context provided. Pass --context <file> or pipe the context ' +
      'package on stdin. The context must include the feature request, the user ' +
      'problem, Claude\'s proposed solution, the proposed journey, files expected ' +
      'to change, and (post-implementation) a diff/verification summary.'
  );
}

// ---- Locate the Codex executable -------------------------------------------
function findCodex() {
  const override = process.env.CODEX_BIN;
  if (override && existsSync(override)) return override;
  const isWin = process.platform === 'win32';
  const probe = isWin ? 'where' : 'command';
  const probeArgs = isWin ? ['codex'] : ['-v', 'codex'];
  try {
    const found = execFileSync(probe, probeArgs, {
      stdio: ['ignore', 'pipe', 'ignore'],
      shell: isWin, // `where` is a shell builtin on Windows; arg is a fixed literal
    })
      .toString()
      .split(/\r?\n/)[0]
      .trim();
    if (found) return found;
  } catch {
    /* not found */
  }
  return null;
}

const codexBin = findCodex();
if (!codexBin) {
  die(
    2,
    [
      'Codex CLI not found — the Galaxera Product Advisor cannot run.',
      '',
      'One-time setup required:',
      '  1. Install the Codex CLI, e.g.  npm i -g @openai/codex   (or your org\'s',
      '     approved distribution). Do NOT let Claude install global packages',
      '     without your approval.',
      '  2. Authenticate:  codex login   (or set the API key your Codex build',
      '     expects). Never paste credentials into the repo or into chat.',
      '  3. Re-run the consultation.',
      '',
      'If Codex is installed under a non-standard path, set CODEX_BIN=/path/to/codex.',
    ].join('\n')
  );
}

// ---- Confirm we can run Codex READ-ONLY ------------------------------------
// Only use flags the locally installed CLI actually documents.
function codexHelp() {
  let text = '';
  for (const argv of [['exec', '--help'], ['--help']]) {
    try {
      text +=
        '\n' +
        execFileSync(codexBin, argv, {
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 15000,
        }).toString();
    } catch (e) {
      if (e.stdout) text += '\n' + e.stdout.toString();
      if (e.stderr) text += '\n' + e.stderr.toString();
    }
  }
  return text;
}

const help = codexHelp();
const supports = (flag) => help.includes(flag);

// Build the exec command using ONLY verified flags.
const cmd = ['exec'];

// Read-only enforcement is mandatory. Prefer `--sandbox read-only`.
let readOnlyEnforced = false;
if (supports('--sandbox')) {
  cmd.push('--sandbox', 'read-only');
  readOnlyEnforced = true;
} else if (supports('--read-only')) {
  cmd.push('--read-only');
  readOnlyEnforced = true;
}

if (!readOnlyEnforced) {
  die(
    3,
    [
      'The installed Codex CLI does not expose a verified read-only mode',
      '(no --sandbox or --read-only flag found in its help output).',
      'Refusing to invoke Codex automatically, because read-only operation cannot',
      'be guaranteed. Upgrade Codex to a version that supports a read-only sandbox,',
      'or run the consultation manually with an explicit read-only configuration.',
    ].join('\n')
  );
}

// Never require approvals in a non-interactive run; keep it fully read-only.
if (supports('--ask-for-approval')) cmd.push('--ask-for-approval', 'never');
// Allow running even if invoked from outside a git worktree.
if (supports('--skip-git-repo-check')) cmd.push('--skip-git-repo-check');

// ---- Assemble the prompt ---------------------------------------------------
let contract = '';
try {
  contract = readFileSync(CONTRACT_PATH, 'utf8');
} catch {
  contract =
    'You are the Galaxera Product Advisor: an independent, read-only senior ' +
    'product/UX/UI/accessibility reviewer. Challenge the proposal; do not just ' +
    'agree. Return a Markdown review titled "# Galaxera Product Review" with a ' +
    'Verdict of PROCEED | REVISE | REJECT | INSUFFICIENT_CONTEXT and the sections ' +
    'the Galaxera review contract defines.';
}

const prompt = [
  contract.trim(),
  '',
  '---',
  `CONSULTATION MODE: ${args.mode}`,
  args.mode === 'pre-implementation'
    ? 'Challenge the feature concept and the proposed plan before any code is written.'
    : 'Review the implemented experience and the relevant changes described below.',
  '',
  'Respond with the required Markdown contract ONLY. Do not modify any files.',
  '',
  '---',
  'CONTEXT PACKAGE FROM CLAUDE:',
  '',
  contextText.trim(),
].join('\n');

// ---- Invoke Codex ----------------------------------------------------------
const child = spawn(codexBin, cmd, {
  stdio: ['pipe', 'inherit', 'inherit'],
  env: process.env,
});

let timedOut = false;
const timer = setTimeout(() => {
  timedOut = true;
  child.kill('SIGKILL');
}, args.timeout);

child.on('error', (err) => {
  clearTimeout(timer);
  die(4, `Failed to launch Codex: ${err.message}`);
});

child.on('close', (code, signal) => {
  clearTimeout(timer);
  if (timedOut) {
    die(4, `Codex consultation timed out after ${args.timeout} ms.`);
  }
  if (code === 0) {
    process.exit(0);
  }
  die(5, `Codex exited with ${code !== null ? `code ${code}` : `signal ${signal}`}.`);
});

// Feed the prompt via stdin (avoids arg-length limits and shell interpolation).
child.stdin.on('error', () => {
  /* ignore EPIPE if Codex closes stdin early */
});
child.stdin.write(prompt);
child.stdin.end();
