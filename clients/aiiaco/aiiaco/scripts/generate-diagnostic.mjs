import https from "https";
import { createConnection } from "mysql2/promise";
import { config } from "dotenv";
config({ path: ".env" });

const lead = {
  id: 30001,
  name: "Maria L Castronovo",
  company: "Alliedbestsellers",
  email: "alliedbestsellers@gmail.com",
  phone: "5149099983",
  problemCategory: "We're growing but can't scale without adding headcount",
  problemDetail: null,
  callPreference: "afternoon",
  leadSource: "Navbar - Request Upgrade",
  createdAt: "2026-03-08T02:04:44.000Z",
};

const PROBLEM_MAP = {
  "My team spends too much time on manual, repetitive tasks": {
    pillar: "Operational AI Systems",
    signal: "High manual overhead across internal workflows",
    urgency: "High",
    aiiaFit: "Workflow automation, task routing, and AI-assisted execution layers",
  },
  "We lose leads because follow-up is slow or inconsistent": {
    pillar: "AI Revenue Engine",
    signal: "Revenue leakage from pipeline gaps",
    urgency: "Critical",
    aiiaFit: "Automated follow-up sequencing, lead scoring, and CRM intelligence",
  },
  "Our data lives in multiple systems and we can't trust the numbers": {
    pillar: "Operational AI Systems",
    signal: "Fragmented data infrastructure and reporting blind spots",
    urgency: "High",
    aiiaFit: "Data unification layer, real-time dashboards, and AI-driven reporting",
  },
  "Document processing and approvals take too long": {
    pillar: "Operational AI Systems",
    signal: "Document bottlenecks slowing delivery and compliance",
    urgency: "Medium",
    aiiaFit: "AI document processing, automated approval workflows",
  },
  "Client communication requires too much manual coordination": {
    pillar: "AI Revenue Engine",
    signal: "Communication overhead reducing capacity",
    urgency: "High",
    aiiaFit: "AI-assisted client communication, automated touchpoint management",
  },
  "We lack real-time visibility into operations and performance": {
    pillar: "Operational AI Systems",
    signal: "Leadership operating without live operational data",
    urgency: "High",
    aiiaFit: "Real-time operational dashboards, AI performance monitoring",
  },
  "Proposal and deliverable creation is slow and resource-heavy": {
    pillar: "Operational AI Systems",
    signal: "Delivery capacity constrained by manual production",
    urgency: "Medium",
    aiiaFit: "AI-assisted proposal generation, templated delivery systems",
  },
  "We're growing but can't scale without adding headcount": {
    pillar: "AI Revenue Engine + Operational AI Systems",
    signal: "Growth ceiling caused by linear headcount dependency",
    urgency: "Critical",
    aiiaFit: "AI infrastructure that decouples revenue growth from headcount - the core AiiACo thesis",
  },
};

const context = PROBLEM_MAP[lead.problemCategory] || {
  pillar: "Full Diagnostic Required",
  signal: "Custom situation - requires discovery call",
  urgency: "Medium",
  aiiaFit: "Tailored AI infrastructure design",
};

async function callLLM(messages) {
  const baseUrl = process.env.BUILT_IN_FORGE_API_URL;
  const endpoint = `${baseUrl.replace(/\/$/, "")}/v1/chat/completions`;

  const payload = JSON.stringify({
    model: "gpt-4o",
    messages,
    temperature: 0.7,
    max_tokens: 1200,
  });

  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.BUILT_IN_FORGE_API_KEY,
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.choices?.[0]?.message?.content || "");
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function sendNotification(title, content) {
  const baseUrl = process.env.BUILT_IN_FORGE_API_URL;
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
  const endpoint = new URL("webdevtoken.v1.WebDevService/SendNotification", normalizedBase).toString();

  const payload = JSON.stringify({ title, content });

  return new Promise((resolve, reject) => {
    const url = new URL(endpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: "Bearer " + process.env.BUILT_IN_FORGE_API_KEY,
        "content-type": "application/json",
        "connect-protocol-version": "1",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(res.statusCode));
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log("Generating AI diagnostic for:", lead.name);

  const diagnostic = await callLLM([
    {
      role: "system",
      content: `You are AiiACo's internal lead intelligence system. AiiACo is an AI infrastructure firm that designs, deploys, and manages AI inside the operational and revenue systems of modern businesses ($5M-$100M revenue). AiiACo's three service pillars are:
1. Database Reactivation - cleaning and reactivating dormant CRM databases to generate new conversations from existing assets
2. AI Revenue Engine - AI-assisted outbound prospecting, automated follow-up sequencing, lead scoring, and conversion intelligence
3. Operational AI Systems - custom AI integrations embedded in field operations, communications, reporting, and workflow coordination

Your job is to produce a sharp, concise, investor-grade lead diagnostic for the AiiACo owner (Nemr Hallak) based on a prospect's intake answers. The diagnostic should:
- Identify the core operational problem and its business impact
- Map it to the relevant AiiACo service pillar(s)
- Assess urgency and fit
- Suggest 3 specific, actionable next steps for the sales call
- Be written in a direct, confident, executive tone - no fluff, no filler

Format the output as plain text with clear section headers using ALL CAPS labels.`,
    },
    {
      role: "user",
      content: `Generate a lead diagnostic for the following prospect:

LEAD INFORMATION:
- Name: ${lead.name}
- Company: ${lead.company}
- Email: ${lead.email}
- Phone: ${lead.phone}
- Lead Source: ${lead.leadSource}
- Call Preference: ${lead.callPreference}
- Submitted: ${new Date(lead.createdAt).toLocaleString("en-US", { timeZone: "America/New_York" })} EST

INTAKE ANSWERS:
- Primary Challenge Selected: "${lead.problemCategory}"
${lead.problemDetail ? `- Additional Detail Provided: "${lead.problemDetail}"` : "- Additional Detail: Not provided"}

INTERNAL SIGNAL MAPPING:
- Matched Pillar: ${context.pillar}
- Operational Signal: ${context.signal}
- Urgency: ${context.urgency}
- AiiACo Fit: ${context.aiiaFit}

Generate the diagnostic now.`,
    },
  ]);

  console.log("\n=== DIAGNOSTIC OUTPUT ===\n");
  console.log(diagnostic);

  // Send as notification
  const notifTitle = `NEW LEAD DIAGNOSTIC - ${lead.name} (${lead.company})`;
  const notifContent = `LEAD: ${lead.name} | ${lead.company}
EMAIL: ${lead.email}
MOBILE: +1 (514) 909-9983
CALL PREFERENCE: Afternoon (Weekdays 12pm - 5pm)
SOURCE: ${lead.leadSource}
SUBMITTED: ${new Date(lead.createdAt).toLocaleString("en-US", { timeZone: "America/New_York" })} EST

─────────────────────────────────────
AI DIAGNOSTIC
─────────────────────────────────────

${diagnostic}`;

  const status = await sendNotification(notifTitle, notifContent);
  console.log("\nNotification sent - status:", status);
}

main().catch(console.error);
