/**
 * Admin session token helpers.
 * Stored in localStorage so the token survives page refreshes and
 * works across proxy environments where cookies may be blocked.
 */

const ADMIN_TOKEN_KEY = "aiiaco_admin_token";

export function getAdminToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}
