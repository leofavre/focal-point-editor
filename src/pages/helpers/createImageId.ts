import slugify from "@sindresorhus/slugify";
import type { ImageId } from "../../types";

/**
 * Generates a URL-friendly image ID from a filename.
 * Uses slugify for the name part (transliterates accents, e.g. café → cafe).
 * Extension is stripped.
 *
 * When `usedIds` is provided: avoids collisions by appending -2, -3, etc., and
 * mutates `usedIds` by adding the returned ID so that subsequent calls
 * (e.g. when adding multiple images in a batch) produce unique IDs.
 *
 * When `usedIds` is omitted: returns the base ID only (no collision avoidance).
 * Use this when you want to intentionally overwrite an existing record with the same id.
 *
 * @returns An ID (e.g. "my-photo", or "my-photo-2" when usedIds is passed and "my-photo" is taken)
 */
export function createImageId(name: string, usedIds?: Set<string>): ImageId {
  const baseName = name.split(/[/\\]/).pop() ?? "";
  const lastDot = baseName.lastIndexOf(".");
  const nameWithoutExt = lastDot > 0 ? baseName.slice(0, lastDot) : baseName;

  const base = slugify(nameWithoutExt) || "image";

  if (usedIds == null) {
    return base as ImageId;
  }

  let candidate = base;
  let suffix = 2;

  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(candidate);
  return candidate as ImageId;
}
