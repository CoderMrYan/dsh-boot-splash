import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('the built browser bundle is present and touch-aware', async () => {
  const source = await readFile(new URL('../lib/boot.js', import.meta.url), 'utf8')
  assert.ok(source.length > 10_000)
  assert.match(source, /TAP TO SKIP/)
  assert.match(source, /pointer: coarse/)
})
