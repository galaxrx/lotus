#!/usr/bin/env node
/**
 * consult-codex.mjs — read-only bridge to the OpenAI Codex CLI for the
 * `product-advisor` skill.
 *
 * It composes the authoritative review contract (references/review-contract.md)
 * with a context package that Claude assembles, then runs `codex exec` in a
 * read-only sandbox so Codex can act as an independent product/UX/UI/accessibility
 * reviewer WITHOUT modifying the repository. Codex's Markdown review is written to
 * stdout; diagnostics go to stderr; a non-zero exit means the consultation failed.
 *
 * No third-party dependencies — Node's standard library only, so it runs on any
 * machine that already has Node (which Claude Code requires) without adding to the
 * project's dependency tree.
 *
 * Usage:
 *   node consult-codex.mjs --mode pre-implementation  --context ./context.md
 *   node consult-codex.mjs --mode post-implementation --context ./context.md --cd "/path/with spaces"
 *   printf '%s' "$CONTEXT" | node consult-codex.mjs --mode pre-implementation
 *
 * Flags:
 *   --mode <pre-implementation|post-implementation>  Default: pre-implementation
 *   --context <file>    Path to the context package. If omitted, read from stdin.
 *   --cd <dir>          Working root Codex should reason about. Default: cwd.
 *   --model <model>     Optional Codex model override (else Codex config default).
 *   --timeout <seconds> Hard cap on the Codex run. Default: 600.
 *   --help
 */

import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const CONTRACT_PATH = resolve(SCRIPT_DIR, '..', 'references', 'review-contract.md');
const VALID_MODES = new Set(['pre-implementation', 'post-implementation']);

// Distinct, documented exit codes so callers can tell failures apart.
const EXIT = {
  OK: 0,
  USAGE: 2,          // bad/missing arguments or empty context
  CODEX_MISSING: 3,  // codex not installed / not on PATH
  TIMEOUT: 4,        // consultation exceeded --timeout
  CODEX_FAILED: 5,   // codex ran but returned an error (often auth)
  INTERNAL: 6,       // unexpected wrapper error
};

function fail(code, message) {
  process.stderr.write(`[product-advisor] ${message}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const opts = { mode: 'pre-implementation', context: null, cd: process.cwd(), model: null, timeout: 600 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[i + 1];
      if (v === undefined) fail(EXIT.USAGE, `Missing value for ${a}`);
      i++;
      return v;
    };
    switch (a) {
      case '--mode': opts.mode = next(); break;
      case '--context': opts.context = next(); break;
      case '--cd': opts.cd = next(); break;
      case '--model': opts.model = next(); break;
      case '--timeout': opts.timeout = Number.parseInt(next(), 10); break;
      case '-h':
      case '--help': opts.help = true; break;
      default: fail(EXIT.USAGE, `Unknown argument: ${a}`);
    }
  }
  return opts;
}

function printHelp() {
  process.stdout.write(
    'consult-codex.mjs — read-only Product Advisor consultation via the Codex CLI\n\n' +
    'Usage:\n' +
    '  node consult-codex.mjs --mode <pre-implementation|post-implementation> [--context FILE] [--cd DIR] [--model NAME] [--timeout SECONDS]\n\n' +
    'If --context is omitted, the context package is read from stdin.\n' +
    'Codex runs read-only; it will not modify files. The Markdown review is printed to stdout.\n'
  );
}

function readContext(opts) {
  if (opts.context) {
    const p = resolve(opts.context);
    if (!existsSync(p)) fail(EXIT.USAGE, `Context file not found: ${p}`);
    let text;
    try { text = readFileSync(p, 'utf8'); }
    catch (e) { fail(EXIT.USAGE, `Could not read context file: ${e.message}`); }
    if (!text.trim()) fail(EXIT.USAGE, `Context file is empty: ${p}`);
    return text;
  }
  // Read from stdin.
  if (process.stdin.isTTY) {
    fail(EXIT.USAGE, 'No --context file given and stdin is a terminal. Provide --context FILE or pipe the context package in.');
  }
  let text = '';
  try { text = readFileSync(0, 'utf8'); }
  catch (e) { fail(EXIT.USAGE, `Could not read context from stdin: ${e.message}`); }
  if (!text.trim()) fail(EXIT.USAGE, 'Context package from stdin is empty.');
  return text;
}

function codexAvailable() {
  // Spawn with shell:false so a PATH lookup happens without shell interpolation.
  try {
    const r = spawnSync('codex', ['--version'], { stdio: 'ignore', shell: false });
    return r.status === 0 && !r.error;
  } catch {
    return false;
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) { printHelp(); process.exit(EXIT.OK); }

  if (!VALID_MODES.has(opts.mode)) {
    fail(EXIT.USAGE, `Invalid --mode "${opts.mode}". Use pre-implementation or post-implementation.`);
  }
  if (!Number.isFinite(opts.timeout) || opts.timeout <= 0) {
    fail(EXIT.USAGE, `Invalid --timeout; expected a positive number of seconds.`);
  }
  if (!existsSync(CONTRACT_PATH)) {
    fail(EXIT.INTERNAL, `Review contract missing at ${CONTRACT_PATH}. The skill install is incomplete.`);
  }

  // Validate the working root, but do not require it to be a git repo.
  const workdir = resolve(opts.cd);
  try {
    if (!statSync(workdir).isDirectory()) fail(EXIT.USAGE, `--cd is not a directory: ${workdir}`);
  } catch {
    fail(EXIT.USAGE, `--cd directory not found: ${workdir}`);
  }

  const context = readContext(opts);

  if (!codexAvailable()) {
    fail(
      EXIT.CODEX_MISSING,
      'Codex CLI not found on PATH. The Product Advisor consultation was skipped and nothing was changed.\n' +
      '        To enable it, install and authenticate Codex, then retry:\n' +
      '          npm install -g @openai/codex\n' +
      '          codex login\n' +
      '        (Verify with: codex --version)'
    );
  }

  const contract = readFileSync(CONTRACT_PATH, 'utf8');
  const composedPrompt =
    `${contract}\n\n` +
    `---\n\n` +
    `## Consultation mode\n\n${opts.mode}\n\n` +
    `In ${opts.mode} mode, ${opts.mode === 'pre-implementation'
      ? 'challenge the feature concept and the proposed plan before any code is written.'
      : 'review the implemented experience using the diff summary, verification evidence, and read-only inspection of the working tree.'}\n\n` +
    `---\n\n` +
    `## Context package from Claude\n\n${context}\n`;

  // Temp file for Codex's final message, kept OUTSIDE the working tree so the
  // consultation never writes into the repository.
  let workTmp;
  try { workTmp = mkdtempSync(join(tmpdir(), 'product-advisor-')); }
  catch (e) { fail(EXIT.INTERNAL, `Could not create temp dir: ${e.message}`); }
  const lastMessagePath = join(workTmp, 'review.md');

  const cleanup = () => { try { rmSync(workTmp, { recursive: true, force: true }); } catch {} };

  // Read-only invocation. --sandbox read-only blocks all writes; --ephemeral avoids
  // persisting session files; no approval-bypass flags are passed. Args are an
  // array (shell:false) so paths with spaces and special characters are safe.
  const args = [
    'exec',
    '--sandbox', 'read-only',
    '--skip-git-repo-check',
    '--ephemeral',
    '--color', 'never',
    '--output-last-message', lastMessagePath,
    '-C', workdir,
  ];
  if (opts.model) args.push('-m', opts.model);
  args.push('-'); // read the prompt from stdin

  const child = spawn('codex', args, { stdio: ['pipe', 'pipe', 'pipe'], shell: false });

  let stdoutBuf = '';
  let stderrBuf = '';
  child.stdout.on('data', (d) => { stdoutBuf += d.toString(); });
  child.stderr.on('data', (d) => { stderrBuf += d.toString(); });

  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    child.kill('SIGTERM');
    setTimeout(() => { try { child.kill('SIGKILL'); } catch {} }, 5000).unref();
  }, opts.timeout * 1000);

  child.on('error', (e) => {
    clearTimeout(timer);
    cleanup();
    if (e && e.code === 'ENOENT') fail(EXIT.CODEX_MISSING, 'Codex CLI disappeared from PATH mid-run.');
    fail(EXIT.INTERNAL, `Failed to launch Codex: ${e.message}`);
  });

  child.on('close', (code) => {
    clearTimeout(timer);

    if (timedOut) {
      if (stderrBuf.trim()) process.stderr.write(stderrBuf);
      cleanup();
      fail(EXIT.TIMEOUT, `Codex consultation exceeded ${opts.timeout}s and was stopped. No changes were made.`);
    }

    // Prefer the captured final message; fall back to stdout if needed.
    let review = '';
    try { if (existsSync(lastMessagePath)) review = readFileSync(lastMessagePath, 'utf8'); } catch {}
    if (!review.trim()) review = stdoutBuf;

    if (code !== 0) {
      if (stderrBuf.trim()) process.stderr.write(stderrBuf);
      const authish = /login|auth|unauthor|credential|api key|sign in/i.test(stderrBuf);
      cleanup();
      fail(
        EXIT.CODEX_FAILED,
        `Codex exited with status ${code}. The consultation did not complete.` +
        (authish ? '\n        This looks like an authentication problem — run `codex login` and retry.' : '')
      );
    }

    if (!review.trim()) {
      if (stderrBuf.trim()) process.stderr.write(stderrBuf);
      cleanup();
      fail(EXIT.CODEX_FAILED, 'Codex completed but returned no review text.');
    }

    process.stdout.write(review.endsWith('\n') ? review : review + '\n');
    cleanup();
    process.exit(EXIT.OK);
  });

  // Feed the composed prompt to Codex and close stdin.
  child.stdin.on('error', () => { /* ignore EPIPE if codex exits early */ });
  child.stdin.write(composedPrompt);
  child.stdin.end();
}

try { main(); }
catch (e) { fail(EXIT.INTERNAL, `Unexpected error: ${e && e.message ? e.message : e}`); }
