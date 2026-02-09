export type Error<R extends string> = { reason: R };

export type Result<S, R extends string> =
  | { success: S; error?: never }
  | { success?: never; error: Error<R> };

export function ok<S>(success: S): Result<S, never> {
  return { success };
}

export function err<R extends string>(error: Error<R>): Result<never, R> {
  return { error };
}
