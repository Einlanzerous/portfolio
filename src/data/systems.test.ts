import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { systems, CATS, slugOf } from './systems'
import { pendingAssets } from './pending-assets'

const PUBLIC = resolve(import.meta.dirname, '../../public')

function assetPaths() {
  const out: string[] = []
  for (const s of systems) {
    if (s.img) out.push(s.img)
    if (s.arch) out.push(s.arch)
    for (const f of s.features ?? []) if (f.screen) out.push(f.screen.src)
  }
  return out
}

describe('systems.ts', () => {
  it('every referenced asset exists under public/, or is declared pending', () => {
    const missing = assetPaths().filter(p => !existsSync(resolve(PUBLIC, p)) && !pendingAssets.has(p))
    expect(missing).toEqual([])
  })

  it('pending-assets lists only paths that are still referenced and still missing', () => {
    const referenced = new Set(assetPaths())
    const stale = [...pendingAssets].filter(p => !referenced.has(p) || existsSync(resolve(PUBLIC, p)))
    expect(stale).toEqual([])
  })

  it('hues are unique and in range', () => {
    const hues = systems.map(s => s.h)
    expect(new Set(hues).size).toBe(hues.length)
    for (const h of hues) expect(h).toBeGreaterThanOrEqual(0), expect(h).toBeLessThan(360)
  })

  it('names and slugs are unique; every group is a filter', () => {
    const names = systems.map(s => s.name)
    expect(new Set(names).size).toBe(names.length)
    expect(new Set(names.map(slugOf)).size).toBe(names.length)
    for (const s of systems) expect(CATS).toContain(s.group)
  })

  it('documented entries carry a tag, a blurb and at least one feature', () => {
    for (const s of systems.filter(s => !s.pending)) {
      expect(s.tag, s.name).toBeTruthy()
      expect(s.blurb, s.name).toBeTruthy()
      expect(s.features?.length ?? 0, s.name).toBeGreaterThan(0)
    }
  })

  it('names fit the hero: ≤ 18 characters', () => {
    for (const s of systems) expect(s.name.length, s.name).toBeLessThanOrEqual(18)
  })
})
