import { build } from 'esbuild'

await build({
  entryPoints: ['src/boot/auto.ts'],
  bundle: true,
  format: 'iife',
  loader: { '.css': 'text' },
  target: 'es2022',
  outfile: 'lib/boot.js',
  logLevel: 'info',
})
