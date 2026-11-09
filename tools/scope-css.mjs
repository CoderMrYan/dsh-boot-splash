import { readFileSync, writeFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/client/styles.css', import.meta.url), 'utf8')
const scoped = source.replace(/\.([A-Za-z_][\w-]*)/g, '.dbs-$1')
writeFileSync(new URL('../src/client/styles-scoped.css', import.meta.url), scoped)
console.log(`scoped ${scoped.length} bytes`)
