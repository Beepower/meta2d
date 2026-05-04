// D-P0-21 dual-pattern verify for core.ts V2 + 卫星 receiver list
import * as fs from 'node:fs'
import * as path from 'node:path'

const enriched = JSON.parse(fs.readFileSync('docs/refactor-public-api/11-scan-scripts/core-apis-enriched.json', 'utf8'))
const names = enriched.filter(e => e.kind === 'class-method' || e.kind === 'class-property').map(e => e.name)

function walkDir(root, filter) {
  const out = []
  if (!fs.existsSync(root)) return out
  const stack = [root]
  while (stack.length > 0) {
    const dir = stack.pop()
    let entries
    try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { continue }
    for (const ent of entries) {
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) stack.push(full)
      else if (ent.isFile() && filter(full)) out.push(full)
    }
  }
  return out
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

function dualVerify(name, contents, strictRecvList) {
  const escName = escapeRegex(name)
  const recvStrict = strictRecvList.map(r => escapeRegex(r)).join('|')
  const strictPattern = new RegExp(`(?:[\\w.]+\\.)?(?:${recvStrict})\\.${escName}\\b`, 'g')
  const broadPattern = new RegExp(`(?:[\\w.]+\\.)?[\\w]+\\.${escName}\\b`, 'g')
  const strictMatches = contents.match(strictPattern) || []
  const broadMatches = contents.match(broadPattern) || []
  return { strict: strictMatches.length, broad: broadMatches.length, broadSamples: broadMatches.slice(0, 3) }
}

// V2
const v2Sep = path.sep
const v2Files = walkDir('src/engine/adapters/meta2d', p => {
  if (!p.endsWith('.ts')) return false
  if (p.includes(`${v2Sep}overlay${v2Sep}`)) return false
  return true
})
const v2Contents = v2Files.map(f => fs.readFileSync(f, 'utf8')).join('\n')

let v2StrictHits = 0, v2BroadHits = 0
const v2BroadOnly = []
for (const name of names) {
  const r = dualVerify(name, v2Contents, ['meta2d', 'm2d', 'engine'])
  if (r.strict > 0) v2StrictHits++
  if (r.broad > 0) v2BroadHits++
  if (r.broad > 0 && r.strict === 0) v2BroadOnly.push({ name, broadCount: r.broad, samples: r.broadSamples })
}
console.log('V2 dual-pattern verify:')
console.log(`  Strict (meta2d|m2d|engine) hit names: ${v2StrictHits}`)
console.log(`  Broad (any receiver) hit names: ${v2BroadHits}`)
console.log(`  Ratio broad/strict: ${(v2BroadHits / Math.max(v2StrictHits, 1)).toFixed(2)}`)
console.log(`  Threshold (1.3x): ${v2BroadHits > v2StrictHits * 1.3 ? '⚠️ EXCEEDED — review broad-only samples' : '✅ within threshold'}`)
console.log(`  Broad-only count: ${v2BroadOnly.length}`)
console.log('  Top 10 broad-only samples:')
v2BroadOnly.slice(0, 10).forEach(b => console.log(`    ${b.name} (${b.broadCount} hits) → ${b.samples.join(' | ')}`))

// Satellite
console.log('')
const satRoots = ['flow', 'form', 'fta', 'chart', 'svg'].map(s => path.resolve('..', 'meta2d.js', 'packages', `${s}-diagram`, 'src'))
const satFiles = []
for (const root of satRoots) satFiles.push(...walkDir(root, p => p.endsWith('.ts')))
const satContents = satFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n')

let satStrictHits = 0, satBroadHits = 0
const satBroadOnly = []
for (const name of names) {
  const r = dualVerify(name, satContents, ['parent', 'meta2d', 'globalStore'])
  if (r.strict > 0) satStrictHits++
  if (r.broad > 0) satBroadHits++
  if (r.broad > 0 && r.strict === 0) satBroadOnly.push({ name, broadCount: r.broad, samples: r.broadSamples })
}
console.log('Satellite dual-pattern verify:')
console.log(`  Strict (parent|meta2d|globalStore) hit names: ${satStrictHits}`)
console.log(`  Broad (any receiver) hit names: ${satBroadHits}`)
console.log(`  Ratio broad/strict: ${(satBroadHits / Math.max(satStrictHits, 1)).toFixed(2)}`)
console.log(`  Threshold (1.3x): ${satBroadHits > satStrictHits * 1.3 ? '⚠️ EXCEEDED — review broad-only samples' : '✅ within threshold'}`)
console.log(`  Broad-only count: ${satBroadOnly.length}`)
console.log('  Top 10 broad-only samples:')
satBroadOnly.slice(0, 10).forEach(b => console.log(`    ${b.name} (${b.broadCount} hits) → ${b.samples.join(' | ')}`))
