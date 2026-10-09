// Renders each system's architecture map (FOLIO-10, epic FOLIO-3).
//
//   bun run archify [slug…]        (no slugs = every system in the table)
//
// The source of truth is the owning repo's docs/architecture.archify.json — the
// same IR the estate wiki renders (SERV-159). This script reads it from the
// local checkout when there is one (else the GitHub contents API, so private
// repos work with the box's `gh` auth), strips the evidence, renders it with
// construct-server's vendored archify and writes the result under
// public/systems/<slug>/ as a committed snapshot. It runs on the box by hand,
// never in CI: the renderer is not vendored here and the output is a snapshot
// on purpose. Output is byte-stable across runs apart from `rendered_at`.
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

interface Source { repo: string; path: string; local: string }

// One line per system. `local` is where the repo is checked out on the box.
const SOURCES: Record<string, Source> = {
  switchyard: { repo: 'Einlanzerous/switchyard', path: 'docs/architecture.archify.json', local: '~/projects/switchyard' },
}

const HOME = homedir()
const ROOT = resolve(import.meta.dirname, '..')
const ARCHIFY_DIR = process.env.ARCHIFY_DIR ?? join(HOME, 'construct-server/wiki/vendor/archify')
const expand = (p: string) => p.replace(/^~(?=\/|$)/, HOME)

function fail(msg: string): never {
  console.error(`render-archify: ${msg}`)
  process.exit(1)
}

function run(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' })
  if (r.error) fail(`${cmd} failed to start: ${r.error.message}`)
  return r
}

function archifyVersion(): string {
  const rel = JSON.parse(readFileSync(join(ARCHIFY_DIR, 'skill-release.json'), 'utf8')) as { version?: string }
  return rel.version ?? 'unknown'
}

function readIR(src: Source): { text: string; revision: string; fetchedFrom: 'local' | 'github' } {
  const local = expand(src.local)
  const file = join(local, src.path)
  if (existsSync(file)) {
    const head = run('git', ['-C', local, 'rev-parse', 'HEAD'])
    if (head.status !== 0) fail(`git rev-parse failed in ${local}: ${head.stderr}`)
    const dirty = run('git', ['-C', local, 'status', '--porcelain', '--', src.path]).stdout.trim() !== ''
    return { text: readFileSync(file, 'utf8'), revision: head.stdout.trim() + (dirty ? '-dirty' : ''), fetchedFrom: 'local' }
  }
  console.log(`  no local checkout at ${file}; fetching from GitHub`)
  const r = run('gh', ['api', `repos/${src.repo}/contents/${src.path}`])
  if (r.status !== 0) fail(`gh api failed for ${src.repo}/${src.path}: ${r.stderr}`)
  const body = JSON.parse(r.stdout) as { content: string; sha: string; encoding: string }
  if (body.encoding !== 'base64') fail(`unexpected encoding ${body.encoding} from the contents API`)
  // The contents API's sha is the blob's, not a commit's — still enough to tell
  // whether the file has changed since the snapshot.
  return { text: Buffer.from(body.content, 'base64').toString('utf8'), revision: body.sha, fetchedFrom: 'github' }
}

interface IR { meta?: Record<string, unknown>; components?: Array<Record<string, unknown>> }

// Evidence is stripped on purpose (invariant 5). archify verifies every
// `sources[]` entry against the repo's object store at `meta.repository`'s
// pinned revision and refuses to render without `--repo-root`; and even a
// verified render would put SRC deep links into a private repo on a public
// page, where they are dead. The estate wiki carries the evidenced render.
function strip(ir: IR): number {
  let removed = 0
  for (const c of ir.components ?? []) {
    if (Array.isArray(c.sources)) { removed += c.sources.length; delete c.sources }
  }
  if (ir.meta && 'repository' in ir.meta) delete ir.meta.repository
  return removed
}

function render(input: string, output: string, profile: string): boolean {
  console.log(`  rendering --quality ${profile}`)
  const r = run('node', [join(ARCHIFY_DIR, 'bin/archify.mjs'), 'render', 'architecture', input, output, '--quality', profile])
  const diag = (r.stdout + r.stderr).trim()
  if (diag) console.log(diag.split('\n').map(l => '    ' + l).join('\n'))
  return r.status === 0
}

function one(slug: string, src: Source, version: string) {
  console.log(`${slug} ← ${src.repo}/${src.path}`)
  const { text, revision, fetchedFrom } = readIR(src)
  const ir = JSON.parse(text) as IR
  const removed = strip(ir)
  console.log(`  read from ${fetchedFrom} @ ${revision}; stripped ${removed} source refs and meta.repository`)

  const tmp = mkdtempSync(join(tmpdir(), 'archify-'))
  try {
    const stripped = join(tmp, `${slug}.json`), out = join(tmp, 'archify.html')
    writeFileSync(stripped, JSON.stringify(ir, null, 2) + '\n')

    // The IR's own profile first; `standard` when it will not pass (showcase
    // enforces label clearances the author may not have tuned yet).
    const wanted = typeof ir.meta?.quality_profile === 'string' ? ir.meta.quality_profile : 'standard'
    let profile = wanted
    if (!render(stripped, out, profile)) {
      if (profile === 'standard') fail(`${slug}: archify refused the IR at --quality standard (diagnostics above)`)
      console.log(`  ${profile} failed; falling back to standard`)
      profile = 'standard'
      if (!render(stripped, out, profile)) fail(`${slug}: archify refused the IR at --quality standard too (diagnostics above)`)
    }

    const dir = join(ROOT, 'public/systems', slug)
    mkdirSync(dir, { recursive: true })
    copyFileSync(out, join(dir, 'archify.html'))
    const meta = {
      repo: src.repo, path: src.path, revision, fetched_from: fetchedFrom,
      archify_version: version, quality_profile: profile, rendered_at: new Date().toISOString(),
    }
    writeFileSync(join(dir, 'archify.src.json'), JSON.stringify(meta, null, 2) + '\n')
    console.log(`  wrote public/systems/${slug}/archify.html (+ archify.src.json, profile ${profile})`)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

if (!existsSync(join(ARCHIFY_DIR, 'bin/archify.mjs'))) {
  fail(`no archify renderer at ${ARCHIFY_DIR} (bin/archify.mjs missing).\n` +
    '  This script runs on the box against construct-server\'s vendored copy; set ARCHIFY_DIR to point at another checkout.')
}
const slugs = process.argv.slice(2)
const unknown = slugs.filter(s => !(s in SOURCES))
if (unknown.length) fail(`unknown system(s): ${unknown.join(', ')} — known: ${Object.keys(SOURCES).join(', ')}`)
const version = archifyVersion()
console.log(`archify ${version} at ${ARCHIFY_DIR}`)
for (const slug of slugs.length ? slugs : Object.keys(SOURCES)) one(slug, SOURCES[slug]!, version)
