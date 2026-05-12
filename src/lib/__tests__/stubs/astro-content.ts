/**
 * Stub for `astro:content` virtual module — only used during vitest runs.
 *
 * editorial-pages.ts imports `getCollection` from astro:content, which is a
 * Vite virtual module that only resolves inside an Astro build/dev process.
 * In vitest we don't need real content; the snapshot tests pass fixtures
 * directly, so we expose a stub that returns empty arrays.
 */

export async function getCollection(_name: string): Promise<unknown[]> {
  return [];
}

export async function getEntry(): Promise<undefined> {
  return undefined;
}

export async function getEntries(): Promise<unknown[]> {
  return [];
}
