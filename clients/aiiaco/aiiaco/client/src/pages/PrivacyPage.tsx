/*
 * AiiACo Privacy Policy Page - /privacy
 * Comprehensive privacy policy covering:
 *   - Voice AI (AiA) call data
 *   - Website analytics (GA4)
 *   - Email & SMS communications (Resend, Telnyx)
 *   - Third-party services (ElevenLabs, Calendly, GoHighLevel)
 *   - Data retention & security
 *   - CCPA / GDPR rights
 */
import SEO from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const FF_DISPLAY =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
const FF_TEXT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

const h2Style: React.CSSProperties = {
  fontFamily: FF_DISPLAY,
  fontSize: "22px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.92)",
  margin: "32px 0 8px",
  letterSpacing: "-0.2px",
};

const h3Style: React.CSSProperties = {
  fontFamily: FF_DISPLAY,
  fontSize: "17px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.85)",
  margin: "20px 0 6px",
};

const pStyle: React.CSSProperties = {
  margin: "0 0 14px",
};

const strongStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.90)",
};

const linkStyle: React.CSSProperties = {
  color: "#D4A843",
  textDecoration: "none",
};

const listStyle: React.CSSProperties = {
  margin: "8px 0 14px",
  paddingLeft: "24px",
  listStyleType: "disc",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const tableWrapStyle: React.CSSProperties = {
  overflowX: "auto",
  margin: "12px 0 20px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontFamily: FF_TEXT,
  fontSize: "13.5px",
  lineHeight: 1.6,
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 14px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.85)",
  background: "rgba(184,156,74,0.08)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 14px",
  color: "rgba(200,215,230,0.72)",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  verticalAlign: "top",
};

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy | AiiACo"
        description="AiiACo privacy policy - how we collect, use, store, and protect your information, including voice AI call data, website analytics, and enterprise engagement data."
        path="/privacy"
        noindex={false}
      />
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#03050A" }}
      >
        <Navbar />
        <main
          className="flex-1"
          style={{ paddingTop: "100px", paddingBottom: "100px" }}
        >
          <div className="container" style={{ maxWidth: "760px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div
                className="section-pill"
                style={{ marginBottom: "24px", width: "fit-content" }}
              >
                <span className="dot" />
                Legal
              </div>
              <h1
                style={{
                  fontFamily: FF_DISPLAY,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.97)",
                  margin: "0 0 12px",
                  letterSpacing: "-0.8px",
                  lineHeight: 1.1,
                }}
              >
                Privacy Policy
              </h1>
              <p
                style={{
                  fontFamily: FF_TEXT,
                  fontSize: "14px",
                  color: "rgba(200,215,230,0.50)",
                  margin: "0 0 24px",
                }}
              >
                Last updated: March 15, 2026
              </p>
              <div
                className="gold-divider"
                style={{ marginBottom: "32px" }}
              />

              {/* Body */}
              <div
                style={{
                  fontFamily: FF_TEXT,
                  fontSize: "15px",
                  lineHeight: 1.75,
                  color: "rgba(200,215,230,0.72)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {/* ─── Introduction ─── */}
                <p style={pStyle}>
                  AiiACo, LLC ("AiiACo," "we," "us," or "our") operates the
                  website{" "}
                  <a href="https://aiiaco.com" style={linkStyle}>
                    aiiaco.com
                  </a>{" "}
                  and provides AI integration, operational intelligence, and
                  managed automation services. This Privacy Policy explains what
                  information we collect, how we use it, who we share it with,
                  and the choices you have regarding your data.
                </p>
                <p style={pStyle}>
                  By using our website, calling our phone line, or engaging with
                  our services, you acknowledge that you have read and understood
                  this policy. If you do not agree with these practices, please
                  do not use our services.
                </p>

                {/* ─── 1. Information We Collect ─── */}
                <h2 style={h2Style}>1. Information We Collect</h2>
                <p style={pStyle}>
                  We collect information through several channels depending on
                  how you interact with AiiACo. The categories below describe
                  each type of data and the context in which it is gathered.
                </p>

                <h3 style={h3Style}>
                  1.1 Voice AI Conversations (AiA Diagnostic Calls)
                </h3>
                <p style={pStyle}>
                  When you call our phone line or initiate a voice conversation
                  through our website, you interact with{" "}
                  <strong style={strongStyle}>AiA</strong>, our AI-powered
                  diagnostic agent. During these conversations, we may collect:
                </p>
                <ul style={listStyle}>
                  <li>
                    Your name, company name, email address, and phone number (if
                    voluntarily provided during the call)
                  </li>
                  <li>
                    A full transcript of the conversation, generated
                    automatically by our voice AI provider
                  </li>
                  <li>
                    Business information you share, including industry, team
                    size, pain points, budget range, and operational challenges
                  </li>
                  <li>
                    Call metadata such as duration, timestamp, and the diagnostic
                    track recommendation (Operator, Agent, or Corporate)
                  </li>
                  <li>
                    AI-generated analysis of the conversation, including
                    extracted pain points, wants, and qualification scores
                  </li>
                </ul>
                <p style={pStyle}>
                  <strong style={strongStyle}>Important:</strong> AiA will never
                  pressure you to share personal information. You may decline to
                  provide any details, and the conversation will continue without
                  interruption.
                </p>

                <h3 style={h3Style}>1.2 Website Forms & Contact Submissions</h3>
                <p style={pStyle}>
                  When you submit a contact form, request an upgrade assessment,
                  or book a strategy call through our website, we collect the
                  information you provide, which typically includes your name,
                  email address, company name, phone number, and details about
                  your business needs.
                </p>

                <h3 style={h3Style}>1.3 Automatically Collected Data</h3>
                <p style={pStyle}>
                  When you visit our website, certain information is collected
                  automatically through analytics and standard web technologies:
                </p>
                <ul style={listStyle}>
                  <li>
                    IP address, browser type, operating system, and device
                    information
                  </li>
                  <li>
                    Pages visited, time spent on pages, referral source, and
                    navigation patterns
                  </li>
                  <li>
                    Interaction events such as button clicks, form interactions,
                    and scroll depth
                  </li>
                </ul>

                <h3 style={h3Style}>1.4 Scheduling & Booking Data</h3>
                <p style={pStyle}>
                  When you book a strategy call through our integrated scheduling
                  system, we receive your name, email, selected time slot, and
                  any notes you include with the booking.
                </p>

                {/* ─── 2. How We Use Your Information ─── */}
                <h2 style={h2Style}>2. How We Use Your Information</h2>
                <p style={pStyle}>
                  We use the information we collect for the following purposes:
                </p>

                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Purpose</th>
                        <th style={thStyle}>Data Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tdStyle}>
                          Respond to your inquiry and assess engagement fit
                        </td>
                        <td style={tdStyle}>
                          Contact info, business details, call transcripts
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>
                          Generate personalized diagnostic reports and
                          recommendations
                        </td>
                        <td style={tdStyle}>
                          Call transcripts, AI-extracted insights, qualification
                          data
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>
                          Send follow-up emails and scheduling confirmations
                        </td>
                        <td style={tdStyle}>Name, email address, call summary</td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>
                          Send SMS notifications related to your engagement
                        </td>
                        <td style={tdStyle}>Phone number, engagement status</td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>
                          Improve our website, services, and AI agent
                          performance
                        </td>
                        <td style={tdStyle}>
                          Analytics data, aggregated call patterns, interaction
                          events
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>
                          Internal operations, lead management, and quality
                          assurance
                        </td>
                        <td style={tdStyle}>
                          All collected data, used by authorized personnel only
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p style={pStyle}>
                  We do not use your information for purposes unrelated to our
                  services. We do not sell your personal information to third
                  parties.
                </p>

                {/* ─── 3. Third-Party Services ─── */}
                <h2 style={h2Style}>3. Third-Party Services</h2>
                <p style={pStyle}>
                  We use trusted third-party services to operate our platform.
                  Each provider processes data only as necessary to deliver the
                  specific service described below.
                </p>

                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Service</th>
                        <th style={thStyle}>Provider</th>
                        <th style={thStyle}>Purpose</th>
                        <th style={thStyle}>Data Shared</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tdStyle}>Voice AI Agent</td>
                        <td style={tdStyle}>ElevenLabs</td>
                        <td style={tdStyle}>
                          Powers AiA voice conversations, generates transcripts
                        </td>
                        <td style={tdStyle}>
                          Voice audio, conversation content
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>Email Delivery</td>
                        <td style={tdStyle}>Resend</td>
                        <td style={tdStyle}>
                          Sends follow-up emails, diagnostic reports, and
                          scheduling confirmations
                        </td>
                        <td style={tdStyle}>
                          Name, email address, email content
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>SMS Messaging</td>
                        <td style={tdStyle}>Telnyx</td>
                        <td style={tdStyle}>
                          Sends text message notifications and follow-ups
                        </td>
                        <td style={tdStyle}>Phone number, message content</td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>Scheduling</td>
                        <td style={tdStyle}>Calendly</td>
                        <td style={tdStyle}>
                          Manages strategy call bookings and calendar
                          availability
                        </td>
                        <td style={tdStyle}>
                          Name, email, selected time slot
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>Website Analytics</td>
                        <td style={tdStyle}>Google Analytics 4</td>
                        <td style={tdStyle}>
                          Measures website traffic, user behavior, and conversion
                          events
                        </td>
                        <td style={tdStyle}>
                          Anonymized usage data, IP address (truncated), device
                          info
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p style={pStyle}>
                  Each third-party provider maintains its own privacy policy
                  governing how it handles the data it receives. We encourage you
                  to review those policies directly. We do not authorize any
                  third-party provider to use your data for purposes beyond
                  delivering the service to AiiACo.
                </p>

                {/* ─── 4. Cookies & Tracking ─── */}
                <h2 style={h2Style}>4. Cookies and Tracking Technologies</h2>
                <p style={pStyle}>
                  Our website uses a limited set of cookies and tracking
                  technologies:
                </p>
                <ul style={listStyle}>
                  <li>
                    <strong style={strongStyle}>
                      Google Analytics cookies
                    </strong>{" "}
                    - used to understand how visitors interact with our website,
                    including page views, session duration, and referral sources.
                    Google Analytics uses first-party cookies and does not
                    identify you personally. You can opt out using the{" "}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={linkStyle}
                    >
                      Google Analytics Opt-out Browser Add-on
                    </a>
                    .
                  </li>
                  <li>
                    <strong style={strongStyle}>Session cookies</strong> - used
                    to maintain your session state if you log in to any
                    authenticated area of our platform. These are strictly
                    necessary and expire when you close your browser or after a
                    set period.
                  </li>
                </ul>
                <p style={pStyle}>
                  We do not use advertising cookies, retargeting pixels, or
                  cross-site tracking technologies.
                </p>

                {/* ─── 5. Voice Recording & Call Data ─── */}
                <h2 style={h2Style}>5. Voice Recording and Call Data</h2>
                <p style={pStyle}>
                  Calls with AiA are processed in real time by our voice AI
                  provider (ElevenLabs). The following applies to all voice
                  interactions:
                </p>
                <ul style={listStyle}>
                  <li>
                    Voice audio is processed to generate a text transcript and is
                    not stored as raw audio by AiiACo after the call concludes.
                  </li>
                  <li>
                    Text transcripts are retained and used for lead
                    qualification, follow-up communications, and service
                    improvement.
                  </li>
                  <li>
                    AI-generated analysis (pain points, recommendations,
                    qualification scores) is derived from the transcript and
                    stored alongside your lead record.
                  </li>
                  <li>
                    You may request deletion of your call transcript and
                    associated data at any time (see Section 8).
                  </li>
                </ul>
                <p style={pStyle}>
                  By initiating a call with AiA, you consent to the processing
                  of your voice input for the purposes described above. If you
                  prefer not to have your conversation transcribed, you may
                  contact us through our website forms instead.
                </p>

                {/* ─── 6. Data Retention ─── */}
                <h2 style={h2Style}>6. Data Retention</h2>
                <p style={pStyle}>
                  We retain your personal information only for as long as
                  necessary to fulfill the purposes described in this policy:
                </p>
                <ul style={listStyle}>
                  <li>
                    <strong style={strongStyle}>Lead and contact data</strong>{" "}
                    is retained for up to 24 months after your last interaction
                    with us, unless you request earlier deletion.
                  </li>
                  <li>
                    <strong style={strongStyle}>Call transcripts</strong> are
                    retained for up to 12 months for quality assurance and
                    service improvement purposes.
                  </li>
                  <li>
                    <strong style={strongStyle}>
                      Email and SMS communication logs
                    </strong>{" "}
                    are retained for up to 12 months.
                  </li>
                  <li>
                    <strong style={strongStyle}>Website analytics data</strong>{" "}
                    is retained according to Google Analytics default retention
                    settings (14 months) and does not contain personally
                    identifiable information.
                  </li>
                  <li>
                    <strong style={strongStyle}>
                      Active client engagement data
                    </strong>{" "}
                    is retained for the duration of the engagement plus 36
                    months.
                  </li>
                </ul>

                {/* ─── 7. Data Security ─── */}
                <h2 style={h2Style}>7. Data Security</h2>
                <p style={pStyle}>
                  We implement appropriate technical and organizational measures
                  to protect your information against unauthorized access,
                  alteration, disclosure, or destruction. These measures include:
                </p>
                <ul style={listStyle}>
                  <li>
                    Encrypted data transmission (TLS/SSL) for all website
                    traffic and API communications
                  </li>
                  <li>
                    Access controls limiting data access to authorized personnel
                    on a need-to-know basis
                  </li>
                  <li>
                    Secure cloud infrastructure with industry-standard
                    encryption at rest
                  </li>
                  <li>
                    Webhook signature verification for all inbound data from
                    third-party services
                  </li>
                  <li>
                    Regular security reviews of our systems and third-party
                    integrations
                  </li>
                </ul>
                <p style={pStyle}>
                  While we take reasonable precautions, no method of electronic
                  transmission or storage is completely secure. We cannot
                  guarantee absolute security of your data.
                </p>

                {/* ─── 8. Your Rights ─── */}
                <h2 style={h2Style}>8. Your Rights and Choices</h2>
                <p style={pStyle}>
                  Depending on your jurisdiction, you may have the following
                  rights regarding your personal information:
                </p>

                <h3 style={h3Style}>For All Users</h3>
                <ul style={listStyle}>
                  <li>
                    <strong style={strongStyle}>Access:</strong> Request a copy
                    of the personal information we hold about you.
                  </li>
                  <li>
                    <strong style={strongStyle}>Correction:</strong> Request
                    correction of inaccurate or incomplete information.
                  </li>
                  <li>
                    <strong style={strongStyle}>Deletion:</strong> Request
                    deletion of your personal information, including call
                    transcripts and lead records.
                  </li>
                  <li>
                    <strong style={strongStyle}>Opt-out of communications:</strong>{" "}
                    Unsubscribe from follow-up emails or SMS at any time by
                    replying STOP or clicking the unsubscribe link.
                  </li>
                </ul>

                <h3 style={h3Style}>
                  California Residents (CCPA / CPRA)
                </h3>
                <p style={pStyle}>
                  If you are a California resident, you have additional rights
                  under the California Consumer Privacy Act (CCPA) and the
                  California Privacy Rights Act (CPRA):
                </p>
                <ul style={listStyle}>
                  <li>
                    The right to know what personal information we collect, use,
                    and disclose about you
                  </li>
                  <li>
                    The right to request deletion of your personal information
                  </li>
                  <li>
                    The right to opt out of the sale or sharing of your personal
                    information - <strong style={strongStyle}>we do not sell
                    your personal information</strong>
                  </li>
                  <li>
                    The right to non-discrimination for exercising your privacy
                    rights
                  </li>
                </ul>

                <h3 style={h3Style}>
                  European Economic Area Residents (GDPR)
                </h3>
                <p style={pStyle}>
                  If you are located in the European Economic Area, you have
                  rights under the General Data Protection Regulation (GDPR),
                  including the right to access, rectify, erase, restrict
                  processing, data portability, and object to processing. Our
                  legal basis for processing your data is legitimate interest
                  (responding to your inquiry and providing our services) and, in
                  the case of voice calls, your consent.
                </p>

                {/* ─── 9. Enterprise Client Data ─── */}
                <h2 style={h2Style}>9. Enterprise Client Data</h2>
                <p style={pStyle}>
                  When AiiACo provides managed AI integration services to
                  enterprise clients, we may access and process business data
                  belonging to the client organization. The handling of such data
                  is governed by the specific engagement agreement between AiiACo
                  and the client, which includes:
                </p>
                <ul style={listStyle}>
                  <li>
                    Confidentiality obligations and non-disclosure provisions
                  </li>
                  <li>
                    Data processing terms specifying permitted uses and
                    restrictions
                  </li>
                  <li>
                    Data return and destruction procedures upon engagement
                    conclusion
                  </li>
                  <li>
                    Compliance with industry-specific regulations applicable to
                    the client's sector
                  </li>
                </ul>
                <p style={pStyle}>
                  Enterprise client data is never used for marketing, shared with
                  other clients, or used to train AI models beyond the scope of
                  the specific engagement.
                </p>

                {/* ─── 10. Children's Privacy ─── */}
                <h2 style={h2Style}>10. Children's Privacy</h2>
                <p style={pStyle}>
                  Our services are designed for business professionals and are
                  not directed at individuals under the age of 18. We do not
                  knowingly collect personal information from children. If we
                  become aware that we have collected information from a child
                  under 18, we will take steps to delete that information
                  promptly.
                </p>

                {/* ─── 11. Changes to This Policy ─── */}
                <h2 style={h2Style}>11. Changes to This Policy</h2>
                <p style={pStyle}>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices, services, or applicable law. When we
                  make material changes, we will update the "Last updated" date
                  at the top of this page. We encourage you to review this policy
                  periodically.
                </p>

                {/* ─── 12. Contact Us ─── */}
                <h2 style={h2Style}>12. Contact Us</h2>
                <p style={pStyle}>
                  If you have questions about this Privacy Policy, wish to
                  exercise your data rights, or need to report a privacy concern,
                  you may contact us through:
                </p>
                <ul style={listStyle}>
                  <li>
                    <strong style={strongStyle}>Website:</strong>{" "}
                    <a href="/upgrade" style={linkStyle}>
                      aiiaco.com/upgrade
                    </a>{" "}
                    (Request Upgrade form)
                  </li>
                  <li>
                    <strong style={strongStyle}>Phone:</strong> +1 (888)
                    808-0001 (speak with AiA, our AI agent, or request a human
                    callback)
                  </li>
                  <li>
                    <strong style={strongStyle}>Email:</strong>{" "}
                    <a href="mailto:privacy@aiiaco.com" style={linkStyle}>
                      privacy@aiiaco.com
                    </a>
                  </li>
                </ul>
                <p style={pStyle}>
                  We aim to respond to all privacy-related requests within 30
                  days.
                </p>

                {/* ─── Separator ─── */}
                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.06)",
                    margin: "32px 0 24px",
                  }}
                />
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(200,215,230,0.40)",
                    margin: 0,
                  }}
                >
                  AiiACo, LLC · Operational Intelligence for the Corporate Age ·{" "}
                  <a href="https://aiiaco.com" style={{ ...linkStyle, fontSize: "13px" }}>
                    aiiaco.com
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
