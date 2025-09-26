type TReturn<T> =
  | {
      value: T;
      error: null;
    }
  | {
      error: any;
      value: null;
    };

export async function tryCatch<T>(callback: () => T): Promise<TReturn<T>> {
  try {
    const value = await callback();
    return { value, error: null };
  } catch (err) {
    return { value: null, error: err };
  }
}
