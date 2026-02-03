import slugify from "@sindresorhus/slugify";

/**
 * Generates a unique, URL-friendly image ID from a filename.
 * Uses slugify for the name part (transliterates accents, e.g. café → cafe).
 * Extension is stripped. On collision, appends -2, -3, etc.
 *
 * Mutates `usedIds` by adding the returned ID so that subsequent calls
 * (e.g. when adding multiple images in a batch) produce unique IDs.
 *
 * @returns A unique ID (e.g. "my-photo", "my-photo-2")
 */
export function createImageId(name: string, usedIds: Set<string>): string {
  const baseName = name.split(/[/\\]/).pop() ?? "";
  const lastDot = baseName.lastIndexOf(".");
  const nameWithoutExt = lastDot > 0 ? baseName.slice(0, lastDot) : baseName;

  const base = slugify(nameWithoutExt) || "image";

  let candidate = base;
  let suffix = 2;

  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(candidate);
  return candidate;
}
