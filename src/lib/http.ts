/** Helper de fetch para uso en Client Components contra nuestras propias rutas /api/*. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(json?.error ?? `Error ${res.status}`, res.status);
  }

  return json as TResponse;
}
