"use client";

type RefreshCallback = (accessToken: string, user: any) => void;

let refreshPromise: Promise<string | null> | null = null;
let onRefreshSuccess: RefreshCallback | null = null;
let onRefreshFailure: (() => void) | null = null;

export function registerAuthCallback(
  onSuccess: RefreshCallback,
  onFailue: () => void,
) {
  onRefreshSuccess = onSuccess;
  onRefreshFailure = onFailue;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        onRefreshFailure?.();
        return null;
      }

      const json = await res.json();
      const { accessToken, user } = json.data;
      onRefreshSuccess?.(accessToken, user);
      return accessToken;
    } catch {
      onRefreshFailure?.();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function authFetch(
  url: string,
  accessToken: string | null,
  options: RequestInit = {},
): Promise<Response> {
  const makeRequest = (token: string | null) =>
    fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let response = await makeRequest(accessToken);

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (!newAccessToken) {
      return response;
    }

    response = await makeRequest(newAccessToken);
  }

  return response;
}
