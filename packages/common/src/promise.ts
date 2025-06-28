export async function safeResult<T>(promise: Promise<T>): Promise<{
  data: T | null;
  error: Error | null;
}> {
  try {
    const result = await promise;
    return {
      data: result,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

export async function unwrapSafePromise<T, E = Error>(
  promise: Promise<{
    data: T | null;
    error: E;
  }>
): Promise<T> {
  const { error, data } = await promise;
  if (error) throw error;
  if (data === null) throw new Error("No data was provided");

  return data;
}
