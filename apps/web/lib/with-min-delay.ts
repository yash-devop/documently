export async function withMinDelay<T>(
  promise: Promise<T>,
  minMs = 250,
): Promise<T> {
  const delayedPromise = new Promise<void>((resolve) =>
    setTimeout(resolve, minMs),
  );
  return Promise.all([promise, delayedPromise]).then(([data]) => data);
}
