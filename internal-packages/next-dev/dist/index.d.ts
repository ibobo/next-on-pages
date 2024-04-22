import { type GetPlatformProxyOptions } from 'wrangler';
export * from './deprecated';
/**
 * Sets up the Cloudflare platform that need to be available during development time (using
 * Next.js' standard dev server)
 *
 * Note: the function is an async one but it doesn't need to be awaited
 *
 * @param options options how the function should operate and if/where to persist the platform data
 */
export declare function setupDevPlatform(options: GetPlatformProxyOptions): Promise<void>;
