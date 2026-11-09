import { readFileSync } from 'node:fs'

/** Host plugin that injects the animation into every rendered index document. */
export const name = 'dsh-boot-splash'

/** The index tap needs the host Web server service. */
export const inject = ['webServer']

/**
 * Register an index transform that runs the animation before the application
 * module loads. The browser script is read per index response, so rebuilding
 * `lib/boot.js` takes effect on the next page load without reloading the host
 * plugin.
 * @param ctx - Host plugin context.
 */
export function apply(ctx) {
  const webServer = ctx.get('webServer')
  if (webServer === undefined) return
  const scriptUrl = new URL('./boot.js', import.meta.url)
  ctx.effect(
    () => webServer.tapIndex((html) => {
      let script
      try {
        script = readFileSync(scriptUrl, 'utf8')
      } catch (error) {
        console.debug('boot-splash: the browser script could not be read', error)
        return html
      }
      const inline = script.replace(/<\/script/gi, '<\\/script')
      const tag = `<script data-dsh-boot-splash>${inline}</script>`
      return html.replace(/<body([^>]*)>/i, `<body$1>${tag}`)
    }),
    'boot splash index tap',
  )
}
