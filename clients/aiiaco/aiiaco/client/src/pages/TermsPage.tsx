/*
 * AiiACo Terms of Service Page - /terms
 * Comprehensive terms modeled after enterprise AI leaders (Palantir, DataRobot).
 * 16 sections covering: acceptance, website use, IP, AI services, voice recording,
 * user content, prohibited conduct, third-party services, disclaimers, liability,
 * indemnification, governing law, dispute resolution, modifications, severability, contact.
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
  margin: "36px 0 8px",
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

const olStyle: React.CSSProperties = {
  margin: "8px 0 14px",
  paddingLeft: "24px",
  listStyleType: "lower-alpha",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const capsStyle: React.CSSProperties = {
  textTransform: "uppercase" as const,
  fontWeight: 600,
  color: "rgba(200,215,230,0.80)",
  letterSpacing: "0.2px",
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

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service | AiiACo"
        description="AiiACo terms of service governing use of our website, AI integration platform, voice diagnostic services, and enterprise engagement models."
        path="/terms"
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
                Terms of Service
              </h1>
              <p
                style={{
                  fontFamily: FF_TEXT,
                  fontSize: "14px",
                  color: "rgba(200,215,230,0.50)",
                  margin: "0 0 24px",
                }}
              >
                Last updated: March 17, 2026
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
                  These Terms of Service ("Terms") constitute a legally binding
                  agreement between you ("you," "your," or "User") and AiiACo,
                  LLC, a Delaware limited liability company doing business as AI
                  Integration Authority ("AiiACo," "AiiA," "we," "us," or "our").
                  These Terms govern your access to and use of the website located
                  at{" "}
                  <a href="https://aiiaco.com" style={linkStyle}>
                    aiiaco.com
                  </a>
                  , including all subdomains, associated web properties, voice
                  services, and any content, functionality, or services offered on
                  or through the website (collectively, the "Platform").
                </p>
                <p style={pStyle}>
                  Please read these Terms carefully before using the Platform. By
                  accessing or using any part of the Platform, you acknowledge that
                  you have read, understood, and agree to be bound by these Terms
                  and our{" "}
                  <a href="/privacy" style={linkStyle}>
                    Privacy Policy
                  </a>
                  , which is incorporated herein by reference. If you do not agree
                  to these Terms, you must not access or use the Platform.
                </p>

                {/* ─── 1. Acceptance of Terms ─── */}
                <h2 style={h2Style}>1. Acceptance of Terms</h2>
                <p style={pStyle}>
                  By accessing the Platform, you represent and warrant that you are
                  at least 18 years of age and have the legal capacity to enter
                  into a binding agreement. If you are accessing the Platform on
                  behalf of a company, organization, or other legal entity, you
                  represent and warrant that you have the authority to bind that
                  entity to these Terms, in which case "you" and "your" refer to
                  that entity.
                </p>
                <p style={pStyle}>
                  Your continued use of the Platform following the posting of any
                  changes to these Terms constitutes acceptance of those changes.
                  We encourage you to review these Terms periodically.
                </p>

                {/* ─── 2. Modifications ─── */}
                <h2 style={h2Style}>2. Modifications to Terms</h2>
                <p style={pStyle}>
                  AiiACo reserves the right to modify, amend, or replace these
                  Terms at any time in its sole discretion. When we make material
                  changes, we will update the "Last updated" date at the top of
                  this page and, where appropriate, provide additional notice
                  through the Platform or via email. Changes become effective
                  immediately upon posting unless otherwise stated.
                </p>
                <p style={pStyle}>
                  Your continued use of the Platform after any modification
                  constitutes your binding acceptance of the modified Terms. If you
                  do not agree to the modified Terms, your sole remedy is to
                  discontinue use of the Platform.
                </p>

                {/* ─── 3. Description of Services ─── */}
                <h2 style={h2Style}>3. Description of Services</h2>
                <p style={pStyle}>
                  AiiACo is the AI Integration Authority for the Corporate Age. We
                  design, deploy, and manage enterprise AI infrastructure across
                  three engagement models:
                </p>
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Model</th>
                        <th style={thStyle}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ ...tdStyle, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                          Operator Package
                        </td>
                        <td style={tdStyle}>
                          Managed AI integration for operational workflows - from
                          cold email automation to CRM intelligence and process
                          optimization.
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                          Agent Package
                        </td>
                        <td style={tdStyle}>
                          AI workforce deployment - SDR agents, AI receptionists,
                          custom-trained knowledge workers, and autonomous
                          decision-making systems.
                        </td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                          Corporate Package
                        </td>
                        <td style={tdStyle}>
                          Full enterprise AI transformation - combining Operator
                          and Agent packages with ongoing management, corporate
                          image, and operational infrastructure.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style={pStyle}>
                  The Platform also provides access to{" "}
                  <strong style={strongStyle}>AiA</strong>, our AI-powered
                  diagnostic intelligence agent, which conducts voice-based
                  assessments to evaluate your operational readiness and recommend
                  an appropriate engagement path. AiA is available through the
                  website and via telephone at +1 (888) 808-0001.
                </p>
                <p style={pStyle}>
                  Specific terms governing individual service engagements,
                  including scope, deliverables, timelines, performance metrics,
                  and fees, are defined in separate Master Service Agreements
                  ("MSA") or Statements of Work ("SOW") executed between you and
                  AiiACo. In the event of a conflict between these Terms and any
                  MSA or SOW, the MSA or SOW shall prevail with respect to the
                  subject matter of that engagement.
                </p>

                {/* ─── 4. Website Access & License ─── */}
                <h2 style={h2Style}>4. Website Access and License</h2>
                <p style={pStyle}>
                  Subject to your compliance with these Terms, AiiACo grants you a
                  limited, non-exclusive, non-transferable, revocable license to
                  access and use the Platform for your personal or internal
                  business purposes. This license does not include the right to:
                </p>
                <ol style={olStyle}>
                  <li>
                    Modify, copy, distribute, transmit, display, perform,
                    reproduce, publish, license, create derivative works from,
                    transfer, or sell any content, information, software, products,
                    or services obtained from the Platform;
                  </li>
                  <li>
                    Use any data mining, robots, scraping, or similar data
                    gathering or extraction methods on the Platform;
                  </li>
                  <li>
                    Frame, mirror, or otherwise incorporate any part of the
                    Platform into any other website or application without prior
                    written consent;
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any portion of the
                    Platform, other accounts, computer systems, or networks
                    connected to the Platform;
                  </li>
                  <li>
                    Use the Platform in any manner that could disable, overburden,
                    damage, or impair the Platform or interfere with any other
                    party's use of the Platform.
                  </li>
                </ol>
                <p style={pStyle}>
                  AiiACo reserves the right to revoke this license and restrict
                  access to the Platform at any time, for any reason, without
                  notice or liability.
                </p>

                {/* ─── 5. Intellectual Property ─── */}
                <h2 style={h2Style}>5. Intellectual Property</h2>
                <h3 style={h3Style}>5.1 AiiACo Content</h3>
                <p style={pStyle}>
                  All content on the Platform - including but not limited to text,
                  graphics, logos, icons, images, audio clips, video, data
                  compilations, software, methodologies, frameworks, diagnostic
                  models, and the overall design and structure of the Platform
                  (collectively, "AiiACo Content") - is the exclusive property of
                  AiiACo or its licensors and is protected by United States and
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property laws.
                </p>
                <p style={pStyle}>
                  The AiiACo name, AiiA name, the AiiACo logo, and all related
                  names, logos, product and service names, designs, and slogans are
                  trademarks of AiiACo. You may not use such marks without the
                  prior written permission of AiiACo. All other names, logos,
                  product and service names, designs, and slogans on the Platform
                  are the trademarks of their respective owners.
                </p>

                <h3 style={h3Style}>5.2 Proprietary Methodologies</h3>
                <p style={pStyle}>
                  AiiACo's diagnostic frameworks, integration methodologies,
                  engagement models, scoring algorithms, and operational playbooks
                  constitute proprietary trade secrets. Access to these
                  methodologies through the Platform or through engagement with
                  AiiACo does not grant you any ownership interest or license to
                  use, reproduce, or disclose such methodologies outside the scope
                  of an executed engagement agreement.
                </p>

                {/* ─── 6. AI Services & Voice Recording ─── */}
                <h2 style={h2Style}>6. AI Services and Voice Recording</h2>
                <h3 style={h3Style}>6.1 AI-Generated Content</h3>
                <p style={pStyle}>
                  The Platform utilizes artificial intelligence technologies to
                  generate diagnostic assessments, recommendations, conversation
                  summaries, and other outputs ("AI Outputs"). AI Outputs are
                  provided for informational purposes only and do not constitute
                  professional advice, legal counsel, financial guidance, or a
                  guarantee of any specific business outcome.
                </p>
                <p style={pStyle}>
                  While AiiACo strives to ensure the accuracy and relevance of AI
                  Outputs, artificial intelligence systems may produce results that
                  are incomplete, inaccurate, or unsuitable for your specific
                  circumstances. You acknowledge that you are solely responsible
                  for evaluating and acting upon any AI Outputs, and that AiiACo
                  shall not be liable for any decisions made or actions taken based
                  on AI Outputs.
                </p>

                <h3 style={h3Style}>6.2 Voice Conversations</h3>
                <p style={pStyle}>
                  By initiating a voice conversation with AiA - whether through the
                  website or by calling our telephone number - you acknowledge and
                  consent to the following:
                </p>
                <ul style={listStyle}>
                  <li>
                    Your conversation will be recorded and transcribed using
                    third-party voice AI technology provided by ElevenLabs, Inc.
                  </li>
                  <li>
                    Transcripts and AI-generated analyses of your conversation will
                    be stored and used to provide you with diagnostic
                    recommendations, follow-up communications, and service
                    proposals.
                  </li>
                  <li>
                    Personal information you voluntarily share during the
                    conversation (such as your name, email, phone number, and
                    business details) will be processed in accordance with our{" "}
                    <a href="/privacy" style={linkStyle}>
                      Privacy Policy
                    </a>
                    .
                  </li>
                  <li>
                    You may decline to provide any personal information during the
                    conversation without affecting the quality of the diagnostic
                    assessment.
                  </li>
                </ul>
                <p style={pStyle}>
                  If you do not consent to recording, you must not initiate or
                  continue a voice conversation. Disconnecting the call at any
                  point constitutes withdrawal of consent for future recording of
                  that session.
                </p>

                <h3 style={h3Style}>6.3 Conversation Continuity</h3>
                <p style={pStyle}>
                  The Platform offers a conversation continuity feature that allows
                  returning users to resume previous interactions with AiA. Access
                  to prior conversation history requires identity verification
                  through a time-limited, single-use magic link sent to your email
                  address. AiiACo implements this verification to protect the
                  privacy and confidentiality of your conversation data.
                </p>

                {/* ─── 7. User Content ─── */}
                <h2 style={h2Style}>7. User Content</h2>
                <p style={pStyle}>
                  "User Content" means any information, data, text, or other
                  materials that you submit, upload, or transmit through the
                  Platform, including but not limited to form submissions, voice
                  conversation content, and communications sent through the
                  Platform.
                </p>
                <p style={pStyle}>
                  You retain ownership of your User Content. By submitting User
                  Content through the Platform, you grant AiiACo a worldwide,
                  non-exclusive, royalty-free, sublicensable license to use,
                  reproduce, process, adapt, and display your User Content solely
                  for the purposes of operating the Platform, providing services to
                  you, improving our AI systems, and fulfilling our obligations
                  under any engagement agreement.
                </p>
                <p style={pStyle}>
                  You represent and warrant that you own or have the necessary
                  rights to submit your User Content and that your User Content
                  does not violate any applicable law or infringe upon the rights
                  of any third party.
                </p>

                {/* ─── 8. Prohibited Conduct ─── */}
                <h2 style={h2Style}>8. Prohibited Conduct</h2>
                <p style={pStyle}>
                  You agree not to engage in any of the following prohibited
                  activities:
                </p>
                <ul style={listStyle}>
                  <li>
                    Using the Platform for any unlawful purpose or in violation of
                    any applicable local, state, national, or international law or
                    regulation
                  </li>
                  <li>
                    Impersonating any person or entity, or falsely stating or
                    misrepresenting your affiliation with a person or entity
                  </li>
                  <li>
                    Attempting to probe, scan, or test the vulnerability of the
                    Platform or any related system or network, or breaching any
                    security or authentication measures
                  </li>
                  <li>
                    Interfering with or disrupting the integrity or performance of
                    the Platform or the data contained therein
                  </li>
                  <li>
                    Using the Platform to transmit any viruses, worms, defects,
                    Trojan horses, or other items of a destructive nature
                  </li>
                  <li>
                    Collecting or harvesting any personally identifiable
                    information from the Platform, including account names and
                    email addresses
                  </li>
                  <li>
                    Using the Platform to send unsolicited commercial
                    communications or spam
                  </li>
                  <li>
                    Reverse-engineering, decompiling, disassembling, or otherwise
                    attempting to derive the source code or underlying algorithms
                    of any part of the Platform
                  </li>
                  <li>
                    Using AiA voice services to record, redistribute, or
                    commercially exploit conversation content without AiiACo's
                    prior written consent
                  </li>
                  <li>
                    Submitting false, misleading, or fraudulent information through
                    forms, voice conversations, or any other channel on the
                    Platform
                  </li>
                </ul>
                <p style={pStyle}>
                  AiiACo reserves the right to investigate and take appropriate
                  legal action against anyone who, in AiiACo's sole discretion,
                  violates this provision, including reporting such violations to
                  law enforcement authorities.
                </p>

                {/* ─── 9. Third-Party Services ─── */}
                <h2 style={h2Style}>9. Third-Party Services and Links</h2>
                <p style={pStyle}>
                  The Platform may contain links to third-party websites, services,
                  or applications that are not owned or controlled by AiiACo. We
                  utilize the following third-party services in the operation of
                  the Platform:
                </p>
                <div style={tableWrapStyle}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Service</th>
                        <th style={thStyle}>Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={tdStyle}>ElevenLabs</td>
                        <td style={tdStyle}>
                          Voice AI processing, speech synthesis, and conversation
                          transcription
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>Resend</td>
                        <td style={tdStyle}>
                          Transactional email delivery (follow-ups, summaries,
                          magic links)
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>Telnyx</td>
                        <td style={tdStyle}>
                          Telephony infrastructure and SMS messaging
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>Calendly</td>
                        <td style={tdStyle}>
                          Appointment scheduling and calendar integration
                        </td>
                      </tr>
                      <tr>
                        <td style={tdStyle}>Google Analytics</td>
                        <td style={tdStyle}>
                          Website traffic analysis and user behavior insights
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p style={pStyle}>
                  AiiACo has no control over and assumes no responsibility for the
                  content, privacy policies, or practices of any third-party
                  services. Your use of third-party services is governed by their
                  respective terms and policies. We encourage you to review the
                  terms and privacy policies of any third-party services you
                  interact with through the Platform.
                </p>

                {/* ─── 10. Confidentiality ─── */}
                <h2 style={h2Style}>10. Confidentiality</h2>
                <p style={pStyle}>
                  In the course of using the Platform or engaging with AiiACo
                  services, either party may disclose confidential information to
                  the other. "Confidential Information" means any non-public
                  information disclosed by one party to the other that is
                  designated as confidential or that reasonably should be
                  understood to be confidential given the nature of the information
                  and the circumstances of disclosure.
                </p>
                <p style={pStyle}>
                  Each party agrees to: (a) protect the other party's Confidential
                  Information using the same degree of care it uses to protect its
                  own confidential information, but in no event less than
                  reasonable care; (b) not use the other party's Confidential
                  Information for any purpose outside the scope of these Terms or
                  any applicable engagement agreement; and (c) not disclose the
                  other party's Confidential Information to any third party without
                  prior written consent, except as required by law.
                </p>
                <p style={pStyle}>
                  For enterprise engagements, confidentiality obligations are
                  further defined in the applicable MSA or NDA executed between the
                  parties.
                </p>

                {/* ─── 11. Data Security ─── */}
                <h2 style={h2Style}>11. Data Security</h2>
                <p style={pStyle}>
                  AiiACo implements industry-standard technical and organizational
                  measures to protect the security, integrity, and confidentiality
                  of information processed through the Platform. These measures
                  include but are not limited to:
                </p>
                <ul style={listStyle}>
                  <li>
                    Encryption of data in transit (TLS 1.2+) and at rest (AES-256)
                  </li>
                  <li>
                    Role-based access controls limiting data access to authorized
                    personnel
                  </li>
                  <li>
                    Regular security assessments and vulnerability monitoring
                  </li>
                  <li>
                    Secure cloud infrastructure hosted in SOC 2 compliant data
                    centers
                  </li>
                  <li>
                    Automated health monitoring of all critical system components
                  </li>
                </ul>
                <p style={pStyle}>
                  While we strive to protect your information, no method of
                  transmission over the Internet or method of electronic storage is
                  completely secure. AiiACo cannot guarantee the absolute security
                  of your data and shall not be liable for any unauthorized access,
                  use, or disclosure of your information resulting from
                  circumstances beyond our reasonable control.
                </p>

                {/* ─── 12. Disclaimer of Warranties ─── */}
                <h2 style={h2Style}>12. Disclaimer of Warranties</h2>
                <p style={{ ...pStyle, ...capsStyle }}>
                  THE PLATFORM AND ALL CONTENT, SERVICES, FEATURES, AND
                  FUNCTIONALITY THEREOF ARE PROVIDED ON AN "AS IS" AND "AS
                  AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                  OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW,
                  AIIACO DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
                  BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
                  FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                </p>
                <p style={{ ...pStyle, ...capsStyle }}>
                  AIIACO DOES NOT WARRANT THAT: (A) THE PLATFORM WILL BE
                  UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE; (B) THE RESULTS
                  OBTAINED FROM THE USE OF THE PLATFORM, INCLUDING AI-GENERATED
                  DIAGNOSTICS AND RECOMMENDATIONS, WILL BE ACCURATE, RELIABLE, OR
                  SUITABLE FOR YOUR SPECIFIC BUSINESS NEEDS; (C) ANY ERRORS IN THE
                  PLATFORM WILL BE CORRECTED; OR (D) THE PLATFORM IS FREE OF
                  VIRUSES OR OTHER HARMFUL COMPONENTS.
                </p>
                <p style={{ ...pStyle, ...capsStyle }}>
                  NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY
                  YOU FROM AIIACO OR THROUGH THE PLATFORM SHALL CREATE ANY WARRANTY
                  NOT EXPRESSLY STATED IN THESE TERMS. AI OUTPUTS, INCLUDING
                  DIAGNOSTIC ASSESSMENTS, QUALIFICATION SCORES, AND ENGAGEMENT
                  RECOMMENDATIONS, ARE GENERATED BY AUTOMATED SYSTEMS AND ARE NOT
                  A SUBSTITUTE FOR PROFESSIONAL JUDGMENT.
                </p>

                {/* ─── 13. Limitation of Liability ─── */}
                <h2 style={h2Style}>13. Limitation of Liability</h2>
                <p style={{ ...pStyle, ...capsStyle }}>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                  SHALL AIIACO, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS,
                  AFFILIATES, SUCCESSORS, OR ASSIGNS BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE
                  DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF
                  PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES,
                  ARISING OUT OF OR IN CONNECTION WITH: (A) YOUR ACCESS TO OR USE
                  OF, OR INABILITY TO ACCESS OR USE, THE PLATFORM; (B) ANY CONDUCT
                  OR CONTENT OF ANY THIRD PARTY ON THE PLATFORM; (C) ANY CONTENT
                  OBTAINED FROM THE PLATFORM, INCLUDING AI-GENERATED OUTPUTS; OR
                  (D) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR
                  TRANSMISSIONS OR CONTENT.
                </p>
                <p style={{ ...pStyle, ...capsStyle }}>
                  IN NO EVENT SHALL AIIACO'S TOTAL AGGREGATE LIABILITY ARISING OUT
                  OF OR RELATING TO THESE TERMS OR YOUR USE OF THE PLATFORM EXCEED
                  THE GREATER OF: (A) THE AMOUNTS YOU HAVE PAID TO AIIACO IN THE
                  TWELVE (12) MONTHS PRECEDING THE CLAIM; OR (B) ONE HUNDRED
                  UNITED STATES DOLLARS ($100.00).
                </p>
                <p style={pStyle}>
                  Some jurisdictions do not allow the exclusion or limitation of
                  certain warranties or liability. In such jurisdictions, AiiACo's
                  liability shall be limited to the greatest extent permitted by
                  applicable law.
                </p>

                {/* ─── 14. Indemnification ─── */}
                <h2 style={h2Style}>14. Indemnification</h2>
                <p style={pStyle}>
                  You agree to defend, indemnify, and hold harmless AiiACo, its
                  officers, directors, employees, agents, affiliates, successors,
                  and assigns from and against any and all claims, damages,
                  obligations, losses, liabilities, costs, and expenses (including
                  reasonable attorneys' fees) arising from: (a) your use of and
                  access to the Platform; (b) your violation of any provision of
                  these Terms; (c) your violation of any third-party right,
                  including any intellectual property, privacy, or proprietary
                  right; or (d) any claim that your User Content caused damage to a
                  third party.
                </p>
                <p style={pStyle}>
                  This indemnification obligation will survive the termination of
                  these Terms and your use of the Platform.
                </p>

                {/* ─── 15. Governing Law & Dispute Resolution ─── */}
                <h2 style={h2Style}>
                  15. Governing Law and Dispute Resolution
                </h2>
                <h3 style={h3Style}>15.1 Governing Law</h3>
                <p style={pStyle}>
                  These Terms shall be governed by and construed in accordance with
                  the laws of the State of Delaware, United States, without regard
                  to its conflict of law provisions. You agree to submit to the
                  personal and exclusive jurisdiction of the courts located within
                  the State of Delaware.
                </p>

                <h3 style={h3Style}>15.2 Informal Resolution</h3>
                <p style={pStyle}>
                  Before filing any formal legal proceeding, you agree to first
                  attempt to resolve any dispute informally by contacting AiiACo at{" "}
                  <a href="mailto:legal@aiiaco.com" style={linkStyle}>
                    legal@aiiaco.com
                  </a>
                  . We will attempt to resolve the dispute informally within thirty
                  (30) days of receiving your notice. If the dispute is not
                  resolved within this period, either party may proceed with formal
                  legal action.
                </p>

                <h3 style={h3Style}>15.3 Arbitration</h3>
                <p style={pStyle}>
                  Any dispute, controversy, or claim arising out of or relating to
                  these Terms that cannot be resolved through informal resolution
                  shall be settled by binding arbitration administered by the
                  American Arbitration Association ("AAA") in accordance with its
                  Commercial Arbitration Rules. The arbitration shall be conducted
                  in the State of Delaware. The arbitrator's decision shall be
                  final and binding and may be entered as a judgment in any court of
                  competent jurisdiction.
                </p>

                <h3 style={h3Style}>15.4 Class Action Waiver</h3>
                <p style={{ ...pStyle, ...capsStyle }}>
                  YOU AND AIIACO AGREE THAT EACH MAY BRING CLAIMS AGAINST THE
                  OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A
                  PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED,
                  OR REPRESENTATIVE ACTION. UNLESS BOTH YOU AND AIIACO AGREE
                  OTHERWISE, THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE
                  PERSON'S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A
                  REPRESENTATIVE OR CLASS PROCEEDING.
                </p>

                {/* ─── 16. General Provisions ─── */}
                <h2 style={h2Style}>16. General Provisions</h2>

                <h3 style={h3Style}>16.1 Entire Agreement</h3>
                <p style={pStyle}>
                  These Terms, together with the Privacy Policy and any applicable
                  MSA, SOW, or NDA, constitute the entire agreement between you and
                  AiiACo regarding your use of the Platform and supersede all prior
                  and contemporaneous understandings, agreements, representations,
                  and warranties, both written and oral, regarding the Platform.
                </p>

                <h3 style={h3Style}>16.2 Severability</h3>
                <p style={pStyle}>
                  If any provision of these Terms is held to be invalid, illegal,
                  or unenforceable by a court of competent jurisdiction, such
                  provision shall be modified to the minimum extent necessary to
                  make it valid and enforceable, or if modification is not
                  possible, shall be severed from these Terms. The remaining
                  provisions shall continue in full force and effect.
                </p>

                <h3 style={h3Style}>16.3 Waiver</h3>
                <p style={pStyle}>
                  No waiver of any term or condition of these Terms shall be deemed
                  a further or continuing waiver of such term or condition or a
                  waiver of any other term or condition. AiiACo's failure to assert
                  any right or provision under these Terms shall not constitute a
                  waiver of such right or provision.
                </p>

                <h3 style={h3Style}>16.4 Assignment</h3>
                <p style={pStyle}>
                  You may not assign or transfer these Terms, by operation of law
                  or otherwise, without AiiACo's prior written consent. AiiACo may
                  assign or transfer these Terms, in whole or in part, without
                  restriction. Any attempted assignment in violation of this
                  section shall be null and void.
                </p>

                <h3 style={h3Style}>16.5 Force Majeure</h3>
                <p style={pStyle}>
                  AiiACo shall not be liable for any failure or delay in performing
                  its obligations under these Terms where such failure or delay
                  results from circumstances beyond AiiACo's reasonable control,
                  including but not limited to acts of God, natural disasters,
                  pandemic, war, terrorism, riots, embargoes, acts of civil or
                  military authorities, fire, floods, accidents, strikes, or
                  shortages of transportation, facilities, fuel, energy, labor, or
                  materials.
                </p>

                <h3 style={h3Style}>16.6 Notices</h3>
                <p style={pStyle}>
                  All notices required or permitted under these Terms shall be in
                  writing and shall be deemed given when delivered personally, sent
                  by confirmed email, or sent by certified or registered mail,
                  return receipt requested, to the applicable party at the address
                  set forth below or at such other address as either party may
                  designate in writing.
                </p>

                <h3 style={h3Style}>16.7 Survival</h3>
                <p style={pStyle}>
                  The following sections shall survive any termination or
                  expiration of these Terms: Intellectual Property (Section 5),
                  Confidentiality (Section 10), Disclaimer of Warranties (Section
                  12), Limitation of Liability (Section 13), Indemnification
                  (Section 14), Governing Law and Dispute Resolution (Section 15),
                  and this General Provisions section (Section 16).
                </p>

                {/* ─── Contact ─── */}
                <h2 style={h2Style}>Contact</h2>
                <p style={pStyle}>
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div
                  style={{
                    background: "rgba(184,156,74,0.06)",
                    border: "1px solid rgba(184,156,74,0.15)",
                    borderRadius: "12px",
                    padding: "20px 24px",
                    margin: "8px 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    <strong style={strongStyle}>AiiACo, LLC</strong>
                  </p>
                  <p style={{ margin: 0 }}>AI Integration Authority</p>
                  <p style={{ margin: 0 }}>
                    Email:{" "}
                    <a href="mailto:legal@aiiaco.com" style={linkStyle}>
                      legal@aiiaco.com
                    </a>
                  </p>
                  <p style={{ margin: 0 }}>
                    Website:{" "}
                    <a href="https://aiiaco.com" style={linkStyle}>
                      aiiaco.com
                    </a>
                  </p>
                  <p style={{ margin: 0 }}>
                    Phone:{" "}
                    <a href="tel:+18888080001" style={linkStyle}>
                      +1 (888) 808-0001
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
