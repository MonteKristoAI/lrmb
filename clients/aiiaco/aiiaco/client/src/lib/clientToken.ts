/**
 * Client portal session token helpers.
 * Stored in localStorage so the token survives page refreshes and
 * works across proxy environments where cookies may be blocked.
 */

const CLIENT_TOKEN_KEY = "aiiaco_client_token";

export function getClientToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(CLIENT_TOKEN_KEY) : null;
}

export function setClientToken(token: string): void {
  localStorage.setItem(CLIENT_TOKEN_KEY, token);
}

export function clearClientToken(): void {
  localStorage.removeItem(CLIENT_TOKEN_KEY);
}
