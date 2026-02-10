export type Err<R extends string> = { reason: R };

export type Result<A, R extends string> =
  | { accepted: A; rejected?: never }
  | { accepted?: never; rejected: Err<R> };

export function accept<A>(accepted: A): Result<A, never> {
  return { accepted };
}

export function reject<R extends string>(rejected: Err<R>): Result<never, R> {
  return { rejected };
}

export function processResults<A, R extends string>(
  results: Result<A, R>[],
): { accepted: A[]; rejected: Err<R>[] } {
  const { accepted, rejected } = results.reduce(
    (acc, result) => {
      if (result.accepted != null) {
        acc.accepted.push(result.accepted);
      } else if (result.rejected != null) {
        acc.rejected.push(result.rejected);
      }
      return acc;
    },
    { accepted: [] as A[], rejected: [] as Err<R>[] },
  );

  return { accepted, rejected };
}

/**
 * Wraps a Promise so that it never rejects: on fulfillment returns accept(value),
 * on rejection returns reject({ reason }).
 */
export async function resultFromPromise<A, R extends string>(
  promise: Promise<A>,
  reason: R,
): Promise<Result<A, R>> {
  try {
    const value = await promise;
    return accept(value);
  } catch {
    return reject({ reason });
  }
}
