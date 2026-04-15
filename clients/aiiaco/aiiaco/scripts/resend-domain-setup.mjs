/**
 * Resend Domain Verification Setup
 * Creates the aiiaco.com domain in Resend and returns the DNS records needed.
 */
import dotenv from "dotenv";
dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY not set");
  process.exit(1);
}

const BASE = "https://api.resend.com";

async function resendRequest(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Resend API error:", data);
    process.exit(1);
  }
  return data;
}

// 1. List existing domains to avoid duplicates
const { data: domains } = await resendRequest("GET", "/domains");
const existing = (domains ?? []).find((d) => d.name === "aiiaco.com");

let domain;
if (existing) {
  console.log("Domain already exists - fetching records...");
  domain = await resendRequest("GET", `/domains/${existing.id}`);
} else {
  console.log("Creating aiiaco.com domain in Resend...");
  domain = await resendRequest("POST", "/domains", { name: "aiiaco.com", region: "us-east-1" });
}

console.log("\n=== RESEND DOMAIN VERIFICATION RECORDS ===");
console.log(`Domain: ${domain.name}`);
console.log(`Status: ${domain.status}`);
console.log(`Domain ID: ${domain.id}`);
console.log("\nAdd these DNS records to your aiiaco.com domain:\n");

for (const record of domain.records ?? []) {
  console.log(`Type:     ${record.record_type ?? record.type}`);
  console.log(`Name:     ${record.name}`);
  console.log(`Value:    ${record.value}`);
  console.log(`TTL:      ${record.ttl ?? "Auto"}`);
  console.log(`Priority: ${record.priority ?? "N/A"}`);
  console.log("---");
}

console.log("\nOnce added, run: node scripts/resend-domain-verify.mjs to trigger verification.");
