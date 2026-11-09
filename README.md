# dsh-boot-splash

[English](README.md) | [简体中文](README.zh-CN.md)

A full-screen boot sequence and synthesized startup score for the
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI.

It is a **host-side profile plugin**: it registers an index transform that
injects one self-contained script before the application module, so the overlay
covers the first paint and the framework-free boot page without editing or
forking DSH.

## What it does

- About 6.1 seconds of ignition, diagnostics, whale convergence, neural-link
  handshake, and online states.
- Click, tap, `Esc`, `Enter`, or `Space` skips it.
- On touch devices the hint reads **TAP TO SKIP**.
- The startup score is synthesized with the Web Audio API; when autoplay is
  blocked, the HUD offers `ENABLE AUDIO` and the first click enables sound
  without skipping.
- No DSH Client API, React, or build-time integration: the injected code is
  plain DOM, Canvas, and Web Audio.

## Install

From GitHub:

```sh
dsh plugin --profile web add github:CoderMrYan/dsh-boot-splash
```

From a local checkout:

```sh
dsh plugin --profile web add D:\applications\dsh\dsh-boot-splash
```

Then reload the page. `lib/index.js` reads `lib/boot.js` on every index
response, so a rebuilt `lib/boot.js` takes effect on the next page load without
restarting the Host.

Compatibility: DSH `>=0.2.0-rc.2`.

## Configuration

- `localStorage.dsh.boot.splash.off = '1'` disables the sequence.
- `localStorage.dsh.boot.sound.muted = '1'` starts muted.
- `?boot=1` forces a replay; `?boot=0` disables it for one load.
- It plays once per tab; clear
  `sessionStorage.dsh.boot.splash.plugin.seen.v1` to replay.

## Build

The inline browser bundle is `lib/boot.js`; it is committed so consumers do not
need a build step.

```sh
npm install
npm run build
```

`npm run build` runs `tools/scope-css.mjs` (prefixes every CSS class with
`dbs-` so the injected stylesheet cannot collide with the app) and bundles
`src/boot/auto.ts` with esbuild.

## Test

```sh
npm test
npm run check
```

`test/apply.test.js` exercises the Host index transform with a fake web server;
`test/bundle.test.js` checks the built bundle is present and touch-aware.

## Layout

- `lib/index.js` — Host plugin: reads `lib/boot.js` and registers the index tap.
- `lib/boot.js` — generated inline browser bundle.
- `src/client/boot-splash.ts` — visual sequence and handoff.
- `src/client/boot-sound.ts` — synthesized score.
- `src/client/styles.css` — source stylesheet.
- `src/boot/auto.ts` — inline entry that starts the sequence.
- `cordis.patch.yml` — installs the `boot-splash` row.

## Notes

The DeepSeek Harness name and branding belong to their respective owners. This
repository contains an independent boot animation implementation; the code is
MIT-licensed.

## License

MIT.
