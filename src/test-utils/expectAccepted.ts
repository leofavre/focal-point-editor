import type { Result } from "../helpers/errorHandling";

/**
 * Awaits a Promise<Result<T, R>> and returns the accepted value, or throws if the result is rejected.
 * Useful in tests when calling storage service methods and expecting success.
 */
export async function expectAccepted<T, R extends string>(
  promise: Promise<Result<T, R>>,
): Promise<T> {
  const result = await promise;
  if (result.rejected != null) {
    throw new Error(`Expected accepted result but got rejected: ${result.rejected.reason}`);
  }
  return result.accepted as T;
}
