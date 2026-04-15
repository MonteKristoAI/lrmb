/**
 * PortalSettings - Client account settings.
 * Company info, contact details, password change.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import PortalLayout from "@/components/PortalLayout";
import { toast } from "sonner";
import { Settings, Save, Loader2 } from "lucide-react";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const inputStyle: React.CSSProperties = {
  fontFamily: FF, fontSize: 14, color: "rgba(255,255,255,0.88)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 8, padding: "12px 14px", width: "100%",
  outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontFamily: FF, fontSize: 12, fontWeight: 600,
  color: "rgba(200,215,230,0.55)", display: "block", marginBottom: 6,
  textTransform: "uppercase", letterSpacing: "0.04em",
};

export default function PortalSettings() {
  const meQuery = trpc.vaas.auth.me.useQuery(undefined, { retry: false });
  const client = meQuery.data;

  const [companyName, setCompanyName] = useState(client?.companyName ?? "");
  const [contactName, setContactName] = useState(client?.contactName ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(client?.websiteUrl ?? "");

  // Sync state when data loads
  if (client && !companyName && client.companyName) {
    setCompanyName(client.companyName);
    setContactName(client.contactName ?? "");
    setWebsiteUrl(client.websiteUrl ?? "");
  }

  return (
    <PortalLayout>
      <div style={{ maxWidth: 600 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(184,156,74,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Settings size={22} style={{ color: "#B89C4A" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: FFD, fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
              Account Settings
            </h1>
            <p style={{ fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.50)", marginTop: 2 }}>
              {client?.email}
            </p>
          </div>
        </div>

        {/* Company info */}
        <div style={{
          background: "rgba(8,14,24,0.72)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: 28, marginBottom: 20,
        }}>
          <h2 style={{
            fontFamily: FFD, fontSize: 16, fontWeight: 700,
            color: "rgba(255,255,255,0.80)", marginBottom: 20, marginTop: 0,
          }}>
            Company Information
          </h2>

          <label style={labelStyle}>Company Name</label>
          <input
            type="text" value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={{ ...inputStyle, marginBottom: 16 }}
          />

          <label style={labelStyle}>Contact Name</label>
          <input
            type="text" value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            style={{ ...inputStyle, marginBottom: 16 }}
          />

          <label style={labelStyle}>Website URL</label>
          <input
            type="url" value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://yourcompany.com"
            style={{ ...inputStyle, marginBottom: 24 }}
          />

          <button
            onClick={() => toast.info("Profile update coming soon")}
            style={{
              fontFamily: FF, fontSize: 14, fontWeight: 700,
              color: "#03050A", background: "rgba(184,156,74,0.90)",
              border: "none", borderRadius: 8, padding: "13px 28px",
              cursor: "pointer", width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            Save Changes <Save size={16} />
          </button>
        </div>

        {/* Account details (read-only) */}
        <div style={{
          background: "rgba(8,14,24,0.72)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: 28,
        }}>
          <h2 style={{
            fontFamily: FFD, fontSize: 16, fontWeight: 700,
            color: "rgba(255,255,255,0.80)", marginBottom: 20, marginTop: 0,
          }}>
            Account Details
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.40)", marginBottom: 4 }}>Email</div>
              <div style={{ fontFamily: FF, fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{client?.email ?? "-"}</div>
            </div>
            <div>
              <div style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.40)", marginBottom: 4 }}>Account Status</div>
              <div style={{
                fontFamily: FF, fontSize: 14, fontWeight: 600,
                color: client?.status === "active" ? "rgba(80,220,150,1)" : "#B89C4A",
              }}>
                {client?.status === "active" ? "Active" : client?.status === "trial" ? "Trial" : client?.status ?? "-"}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.40)", marginBottom: 4 }}>Member Since</div>
              <div style={{ fontFamily: FF, fontSize: 14, color: "rgba(255,255,255,0.75)" }}>
                {client?.createdAt ? new Date(client.createdAt).toLocaleDateString() : "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`input:focus { border-color: rgba(184,156,74,0.40) !important; }`}</style>
    </PortalLayout>
  );
}
