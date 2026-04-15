export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Phone number - update this single constant when the Telnyx number is provisioned
// Set to null to fall back to Calendly booking link automatically
export const PHONE_NUMBER: string | null = null; // Temporarily disabled - SIP routing under repair
export const PHONE_NUMBER_DISPLAY: string | null = null; // Temporarily disabled

// Direct dial number - always visible as a subtle alternative beneath CTAs
export const DIRECT_DIAL = "888-808-0001";
export const DIRECT_DIAL_TEL = "tel:+18888080001";
export const CALENDLY_URL = "https://calendly.com/aiiaco";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
