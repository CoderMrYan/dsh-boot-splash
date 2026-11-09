/**
 * Inline entry injected into the index document. It runs before the application
 * module, so the overlay covers the first paint and the boot page.
 * @module dsh-boot-splash/inline
 */
import { startBootSplash } from '../client/boot-splash.ts'

startBootSplash()
