/**
 * Returns a function that generates unique table names for tests (e.g. "prefix1", "prefix2", ...).
 * Use when multiple tests or backends need distinct table/store names to avoid collisions.
 */
export function createUniqueTableNameGenerator(prefix: string): () => string {
  let counter = 0;
  return () => {
    counter += 1;
    return `${prefix}${counter}`;
  };
}
