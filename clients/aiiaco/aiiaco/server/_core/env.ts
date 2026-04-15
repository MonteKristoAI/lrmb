export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  /** Optional: Zapier / Make.com webhook URL for CRM routing */
  crmWebhookUrl: process.env.CRM_WEBHOOK_URL ?? "",
  /** Admin console session cookie name */
  adminSessionCookieName: "aiiaco_admin_session",
  /** ElevenLabs API key for TTS */
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY ?? "",
  /** Stripe */
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
};
