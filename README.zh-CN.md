# dsh-boot-splash

[English](README.md) | [简体中文](README.zh-CN.md)

一个给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web UI
用的全屏启动动画和合成启动音效。

它是一个 **Host 侧 profile 插件**：注册一个 index transform，在应用模块之前注入
一段自包含脚本，因此不需要修改或 fork DSH，就能覆盖首屏和框架加载前的启动页。

## 功能

- 约 6.1 秒：点火、诊断、鲸鱼汇聚、神经链路握手、上线。
- 点击、触摸、`Esc`、`Enter`、`Space` 都可以跳过。
- 触屏设备提示为 **TAP TO SKIP**。
- 启动音由 Web Audio API 实时合成；浏览器拦截自动播放时，HUD 会显示
  `ENABLE AUDIO`，第一次点击只开声音、不跳过动画。
- 不依赖 DSH Client API、React 或构建集成；注入代码是纯 DOM、Canvas 和
  Web Audio。

## 安装

从 GitHub：

```sh
dsh plugin --profile web add github:CoderMrYan/dsh-boot-splash
```

从本地 checkout：

```sh
dsh plugin --profile web add D:\applications\dsh\dsh-boot-splash
```

然后刷新页面。`lib/index.js` 每次 index 响应都会重新读取 `lib/boot.js`，所以
重新构建 `lib/boot.js` 后刷新页面即可生效，不需要重启 Host。

兼容性：DSH `>=0.2.0-rc.2`。

## 配置

- `localStorage.dsh.boot.splash.off = '1'` 关闭动画。
- `localStorage.dsh.boot.sound.muted = '1'` 静音启动。
- `?boot=1` 强制重播；`?boot=0` 本次加载禁用。
- 每个标签页只播放一次；清除
  `sessionStorage.dsh.boot.splash.plugin.seen.v1` 可重播。

## 构建

浏览器内联包是 `lib/boot.js`，已提交到仓库，普通用户不需要构建。

```sh
npm install
npm run build
```

`npm run build` 先运行 `tools/scope-css.mjs`（给所有 CSS 类加 `dbs-` 前缀，避免
和应用的样式冲突），再用 esbuild 打包 `src/boot/auto.ts`。

## 测试

```sh
npm test
npm run check
```

`test/apply.test.js` 用假的 web server 验证 Host index transform；
`test/bundle.test.js` 检查构建产物存在且包含触屏提示。

## 目录

- `lib/index.js` — Host 插件：读取 `lib/boot.js` 并注册 index tap。
- `lib/boot.js` — 生成的内联浏览器包。
- `src/client/boot-splash.ts` — 视觉序列与交接。
- `src/client/boot-sound.ts` — 合成音效。
- `src/client/styles.css` — 源样式。
- `src/boot/auto.ts` — 启动入口。
- `cordis.patch.yml` — 安装 `boot-splash` 行。

## 说明

DeepSeek Harness 的名称与品牌归其所有者。本仓库是独立的启动动画实现，代码使用
MIT 许可证。

## 许可证

MIT。
