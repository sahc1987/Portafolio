export interface CspOptions {
  analytics?: boolean;
}
export function inlineScriptHashes(html: string): string[];
export function buildCsp(hashes: readonly string[], options?: CspOptions): string;
export function injectCsp(html: string, options?: CspOptions): string;
