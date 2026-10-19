import { ApiError } from "./error";

export const API_ROOT = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
export const API_BASE = `${API_ROOT}/api/v1`;

type Envelope<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: { total: number };
  errors?: { path: string; message: string }[];
};

export type Options = { method?: string; body?: unknown; auth?: boolean };

let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const hasAccessToken = (): boolean => accessToken !== null;

async function send(path: string, options: Options): Promise<Response> {
  const method = options.method ?? (options.body === undefined ? "GET" : "POST");

  try {
    return await fetch(`${API_BASE}${path}`, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && options.auth !== false
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
      },
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    });
  } catch {
    throw new ApiError("Could not reach the server. Is the API running?", 0);
  }
}

async function unwrap<T>(res: Response): Promise<T> {
  const payload = (await res.json().catch(() => ({}))) as Envelope<T>;

  if (!res.ok || !payload.success) {
    const first = payload.errors?.[0];
    throw new ApiError(
      payload.message ?? first?.message ?? "Something went wrong. Please try again.",
      res.status,
      first?.path,
      first?.message,
    );
  }
  return payload.data as T;
}

export async function refreshSession<T>(): Promise<T> {
  const res = await send("/auth/refresh", { method: "POST", auth: false });
  return unwrap<T>(res);
}

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  let res = await send(path, options);

  if (res.status === 401 && options.auth !== false && !path.startsWith("/auth/")) {
    const renewed = await refreshSession<{ accessToken: string }>().catch(() => null);
    if (!renewed) {
      setAccessToken(null);
      throw new ApiError("Your session has expired. Please sign in again.", 401);
    }
    setAccessToken(renewed.accessToken);
    res = await send(path, options);
  }

  return unwrap<T>(res);
}
