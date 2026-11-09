import test from 'node:test'
import assert from 'node:assert/strict'
import { apply } from '../lib/index.js'

function fakeContext() {
  let transform
  const disposers = []
  const ctx = {
    get(name) {
      if (name !== 'webServer') return undefined
      return {
        tapIndex(fn) {
          transform = fn
          return () => { disposers.push('tap') }
        },
      }
    },
    effect(fn) {
      const dispose = fn()
      disposers.push(dispose)
      return dispose
    },
  }
  return { ctx, get transform() { return transform }, disposers }
}

test('injects the inline splash before body content', () => {
  const fake = fakeContext()
  apply(fake.ctx)
  const transform = fake.transform
  assert.equal(typeof transform, 'function')
  const html = transform('<html><body class="app"><div id="root"></div></body></html>')
  assert.match(html, /<body class="app"><script data-dsh-boot-splash>/)
  assert.match(html, /TAP TO SKIP/)
  assert.match(html, /<\/script><div id="root"><\/div><\/body>/)
})

test('a profile without the webserver is a no-op', () => {
  assert.doesNotThrow(() => apply({ get: () => undefined }))
})
