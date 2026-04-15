/*
 * AiiACo - Admin Operations Console
 * Route: /admin-opsteam (not linked anywhere, not in sitemap)
 * Dedicated username/password auth - independent of Manus OAuth
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { setAdminToken, clearAdminToken } from "@/lib/adminToken";
import { toast } from "sonner";
import type { Lead } from "../../../drizzle/schema";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  fontFamily: FF,
  fontSize: "14px",
  color: "rgba(255,255,255,0.88)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "8px",
  padding: "10px 14px",
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
};

const btnGold: React.CSSProperties = {
  fontFamily: FF,
  fontSize: "14px",
  fontWeight: 700,
  color: "#03050A",
  background: "rgba(184,156,74,0.90)",
  border: "none",
  borderRadius: "8px",
  padding: "11px 28px",
  cursor: "pointer",
  width: "100%",
};

const btnGhost: React.CSSProperties = {
  fontFamily: FF,
  fontSize: "13px",
  fontWeight: 600,
  color: "rgba(200,215,230,0.55)",
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px",
  padding: "7px 16px",
  cursor: "pointer",
};

const btnDanger: React.CSSProperties = {
  fontFamily: FF,
  fontSize: "12px",
  fontWeight: 600,
  color: "rgba(255,100,100,0.80)",
  background: "rgba(255,60,60,0.06)",
  border: "1px solid rgba(255,60,60,0.18)",
  borderRadius: "6px",
  padding: "5px 12px",
  cursor: "pointer",
};

// ─── Status colours ───────────────────────────────────────────────────────────

const STATUS_COLORS: Record<Lead["status"], { bg: string; text: string; border: string }> = {
  new: { bg: "rgba(184,156,74,0.14)", text: "rgba(212,180,80,1)", border: "rgba(184,156,74,0.35)" },
  diagnostic_ready: { bg: "rgba(120,200,255,0.10)", text: "rgba(120,200,255,0.92)", border: "rgba(120,200,255,0.28)" },
  reviewed: { bg: "rgba(100,160,255,0.12)", text: "rgba(120,175,255,1)", border: "rgba(100,160,255,0.30)" },
  contacted: { bg: "rgba(80,220,150,0.12)", text: "rgba(80,220,150,1)", border: "rgba(80,220,150,0.30)" },
  closed: { bg: "rgba(255,255,255,0.05)", text: "rgba(200,215,230,0.40)", border: "rgba(255,255,255,0.10)" },
  incomplete: { bg: "rgba(255,180,60,0.10)", text: "rgba(255,180,60,0.90)", border: "rgba(255,180,60,0.25)" },
  abandoned: { bg: "rgba(255,80,80,0.08)", text: "rgba(255,80,80,0.65)", border: "rgba(255,80,80,0.18)" },
};

const STATUS_LABELS: Record<Lead["status"], string> = {
  new: "New", diagnostic_ready: "Diagnostic Ready", reviewed: "Reviewed", contacted: "Contacted", closed: "Closed", incomplete: "Incomplete", abandoned: "Abandoned",
};

const TYPE_LABELS: Record<Lead["type"], string> = {
  call: "Call Request", intake: "Full Intake",
};

// ─── Setup Page (first-time owner account creation) ───────────────────────────

function SetupPage({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "", displayName: "" });
  const [loading, setLoading] = useState(false);

  const setup = trpc.adminAuth.setup.useMutation({
    onSuccess: (data) => {
      if (data.token) setAdminToken(data.token);
      toast.success("Owner account created. Signing you in…");
      onDone();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    setup.mutate({
      username: form.username,
      password: form.password,
      displayName: form.displayName || undefined,
    });
    setLoading(false);
  };

  return (
    <div style={{ background: "#03050A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <img
            src="/images/logo-gold.webp"
            alt="AiiA logo"
            style={{ height: "56px", width: "auto", objectFit: "contain", margin: "0 auto 20px", display: "block" }}
          />
          <h1 style={{ fontFamily: FFD, fontSize: "26px", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: "0 0 8px" }}>Initial Setup</h1>
          <p style={{ fontFamily: FF, fontSize: "14px", color: "rgba(200,215,230,0.45)", margin: 0, lineHeight: 1.6 }}>
            Create your owner account to access the AiiACo Operations Console.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>Display Name</label>
            <input
              style={inputStyle}
              placeholder="Your name"
              value={form.displayName}
              onChange={(e) => setForm(f => ({ ...f, displayName: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>Username <span style={{ color: "rgba(212,180,80,0.7)" }}>*</span></label>
            <input
              style={inputStyle}
              placeholder="e.g. nemr"
              value={form.username}
              onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>Password <span style={{ color: "rgba(212,180,80,0.7)" }}>*</span></label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>Confirm Password <span style={{ color: "rgba(212,180,80,0.7)" }}>*</span></label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Repeat password"
              value={form.confirmPassword}
              onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
              required
              autoComplete="new-password"
            />
          </div>
          <button type="submit" style={{ ...btnGold, marginTop: "6px", opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? "Creating Account…" : "Create Owner Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const utils = trpc.useUtils();

  const login = trpc.adminAuth.login.useMutation({
    onSuccess: (data) => {
      if (data.token) setAdminToken(data.token);
      utils.adminAuth.me.invalidate();
      onLogin();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form);
  };

  return (
    <div style={{ background: "#03050A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <img
            src="/images/logo-gold.webp"
            alt="AiiA logo"
            style={{ height: "56px", width: "auto", objectFit: "contain", margin: "0 auto 20px", display: "block" }}
          />
          <h1 style={{ fontFamily: FFD, fontSize: "26px", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: "0 0 8px" }}>Operations Console</h1>
          <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.40)", margin: 0 }}>AiiACo - Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>Username</label>
            <input
              style={inputStyle}
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
              required
              autoComplete="username"
              autoFocus
            />
          </div>
          <div>
            <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.40)", display: "block", marginBottom: "6px" }}>Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" style={{ ...btnGold, marginTop: "6px", opacity: login.isPending ? 0.6 : 1 }} disabled={login.isPending}>
            {login.isPending ? "Signing In…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Lead Row ─────────────────────────────────────────────────────────────────

function LeadRow({ lead, onStatusChange }: { lead: Lead; onStatusChange: (id: number, status: Lead["status"]) => void }) {
  const [expanded, setExpanded] = useState(false);
  const c = STATUS_COLORS[lead.status];

  return (
    <>
      <tr
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
          <p style={{ fontFamily: FFD, fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: 0 }}>{lead.name}</p>
          <a href={`mailto:${lead.email}`} style={{ fontFamily: FF, fontSize: "12px", color: "rgba(184,156,74,0.70)", textDecoration: "none" }}>{lead.email}</a>
        </td>
        <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
          <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.55)" }}>{lead.company || "-"}</span>
        </td>
        <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
          <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px", background: lead.type === "intake" ? "rgba(184,156,74,0.08)" : "rgba(255,255,255,0.04)", color: lead.type === "intake" ? "rgba(184,156,74,0.80)" : "rgba(200,215,230,0.45)" }}>
            {TYPE_LABELS[lead.type]}
          </span>
        </td>
        <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
          <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.50)" }}>{lead.industry || "-"}</span>
        </td>
        <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
          <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", background: c.bg, color: c.text, border: `1px solid ${c.border}`, fontFamily: FF }}>
            {STATUS_LABELS[lead.status]}
          </span>
        </td>
        <td style={{ padding: "14px 16px", verticalAlign: "middle" }}>
          <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.35)" }}>
            {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </td>
        <td style={{ padding: "14px 16px", verticalAlign: "middle", textAlign: "right" }}>
          <span style={{ color: "rgba(200,215,230,0.30)", fontSize: "11px" }}>{expanded ? "▲" : "▼"}</span>
        </td>
      </tr>

      {expanded && (
        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <td colSpan={7} style={{ padding: "0 16px 20px", background: "rgba(184,156,74,0.02)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: "12px", padding: "16px 0 12px" }}>
              {lead.phone && (
                <div>
                  <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Phone</p>
                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.70)", margin: 0 }}>{lead.phone}</p>
                </div>
              )}
              {lead.engagementModel && (
                <div>
                  <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Engagement Model</p>
                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.70)", margin: 0 }}>{lead.engagementModel}</p>
                </div>
              )}
              {lead.annualRevenue && (
                <div>
                  <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Annual Revenue</p>
                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.70)", margin: 0 }}>{lead.annualRevenue}</p>
                </div>
              )}
              {lead.message && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Message</p>
                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.70)", margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{lead.message}</p>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.35)", alignSelf: "center", marginRight: "4px" }}>Move to:</span>
              {(["new", "reviewed", "contacted", "closed"] as Lead["status"][]).map((s) => {
                const sc = STATUS_COLORS[s];
                return (
                  <button
                    key={s}
                    onClick={(e) => { e.stopPropagation(); onStatusChange(lead.id, s); }}
                    disabled={lead.status === s}
                    style={{
                      fontFamily: FF, fontSize: "12px", fontWeight: 600, padding: "5px 14px", borderRadius: "6px",
                      border: `1px solid ${lead.status === s ? sc.border : "rgba(255,255,255,0.08)"}`,
                      background: lead.status === s ? sc.bg : "transparent",
                      color: lead.status === s ? sc.text : "rgba(200,215,230,0.50)",
                      cursor: lead.status === s ? "default" : "pointer",
                    }}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Admin Management Tab ─────────────────────────────────────────────────────

function AdminManagementTab({ currentUserId, currentRole }: { currentUserId: number; currentRole: string }) {
  const [showCreate, setShowCreate] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "", displayName: "", role: "admin" as "admin" | "owner" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const utils = trpc.useUtils();

  const { data: admins, isLoading } = trpc.adminAuth.listAdmins.useQuery();

  const createAdmin = trpc.adminAuth.createAdmin.useMutation({
    onSuccess: () => {
      toast.success("Admin user created");
      setShowCreate(false);
      setNewAdmin({ username: "", password: "", displayName: "", role: "admin" });
      utils.adminAuth.listAdmins.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteAdmin = trpc.adminAuth.deleteAdmin.useMutation({
    onSuccess: () => { toast.success("Admin removed"); utils.adminAuth.listAdmins.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const changePassword = trpc.adminAuth.changePassword.useMutation({
    onSuccess: () => { toast.success("Password updated"); setShowChangePassword(false); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); },
    onError: (e) => toast.error(e.message),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin.mutate(newAdmin);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error("Passwords do not match"); return; }
    changePassword.mutate({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
  };

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontFamily: FFD, fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 4px" }}>Admin Users</h2>
          <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.40)", margin: 0 }}>Manage who can access this console.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={btnGhost} onClick={() => setShowChangePassword(!showChangePassword)}>Change My Password</button>
          {currentRole === "owner" && (
            <button style={{ ...btnGold, width: "auto" }} onClick={() => setShowCreate(!showCreate)}>+ Add Admin</button>
          )}
        </div>
      </div>

      {/* Change password form */}
      {showChangePassword && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontFamily: FFD, fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "0 0 16px" }}>Change Password</h3>
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input style={inputStyle} type="password" placeholder="Current password" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} required autoComplete="current-password" />
            <input style={inputStyle} type="password" placeholder="New password (min. 8 chars)" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} required autoComplete="new-password" />
            <input style={inputStyle} type="password" placeholder="Confirm new password" value={pwForm.confirmPassword} onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))} required autoComplete="new-password" />
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={{ ...btnGold, width: "auto", padding: "10px 24px" }} disabled={changePassword.isPending}>
                {changePassword.isPending ? "Saving…" : "Update Password"}
              </button>
              <button type="button" style={btnGhost} onClick={() => setShowChangePassword(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Create admin form */}
      {showCreate && currentRole === "owner" && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(184,156,74,0.15)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontFamily: FFD, fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "0 0 16px" }}>New Admin User</h3>
          <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.35)", display: "block", marginBottom: "5px" }}>Display Name</label>
              <input style={inputStyle} placeholder="Full name" value={newAdmin.displayName} onChange={e => setNewAdmin(f => ({ ...f, displayName: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.35)", display: "block", marginBottom: "5px" }}>Username *</label>
              <input style={inputStyle} placeholder="e.g. marylou" value={newAdmin.username} onChange={e => setNewAdmin(f => ({ ...f, username: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.35)", display: "block", marginBottom: "5px" }}>Password *</label>
              <input style={inputStyle} type="password" placeholder="Min. 8 characters" value={newAdmin.password} onChange={e => setNewAdmin(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(200,215,230,0.35)", display: "block", marginBottom: "5px" }}>Role</label>
              <select
                style={{ ...inputStyle, appearance: "none" }}
                value={newAdmin.role}
                onChange={e => setNewAdmin(f => ({ ...f, role: e.target.value as "admin" | "owner" }))}
              >
                <option value="admin">Admin (leads access only)</option>
                <option value="owner">Owner (can manage admins)</option>
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "4px" }}>
              <button type="submit" style={{ ...btnGold, width: "auto", padding: "10px 24px" }} disabled={createAdmin.isPending}>
                {createAdmin.isPending ? "Creating…" : "Create Admin"}
              </button>
              <button type="button" style={btnGhost} onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Admin list */}
      {isLoading ? (
        <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.35)" }}>Loading…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {(admins ?? []).map((admin) => (
            <div key={admin.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "14px 18px" }}>
              <div>
                <p style={{ fontFamily: FFD, fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: "0 0 2px" }}>
                  {admin.displayName || admin.username}
                  {admin.id === currentUserId && <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(184,156,74,0.65)", marginLeft: "8px" }}>(you)</span>}
                </p>
                <p style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.40)", margin: 0 }}>@{admin.username}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                  fontFamily: FF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "3px 10px", borderRadius: "999px",
                  background: admin.role === "owner" ? "rgba(184,156,74,0.14)" : "rgba(255,255,255,0.05)",
                  color: admin.role === "owner" ? "rgba(212,180,80,1)" : "rgba(200,215,230,0.45)",
                  border: admin.role === "owner" ? "1px solid rgba(184,156,74,0.30)" : "1px solid rgba(255,255,255,0.08)",
                }}>
                  {admin.role}
                </span>
                {currentRole === "owner" && admin.id !== currentUserId && (
                  <button
                    style={btnDanger}
                    onClick={() => {
                      if (confirm(`Remove @${admin.username}?`)) deleteAdmin.mutate({ id: admin.id });
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Web Transcripts Tab ─────────────────────────────────────────────────────

/** Parse transcript JSON into typed message array */
function parseWebTranscript(jsonStr: string): Array<{ role: "user" | "ai"; text: string; timestamp?: string }> {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      return parsed.map((m: any) => ({
        role: m.role === "user" ? "user" as const : "ai" as const,
        text: m.text ?? m.message ?? "",
        timestamp: m.timestamp,
      }));
    }
  } catch { /* fall through */ }
  return [];
}

/** Format seconds to human-readable duration */
function fmtDuration(sec: number | null | undefined): string {
  if (!sec) return "-";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/** Format timestamp string to short time */
function fmtTime(ts?: string): string {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch { return ""; }
}

/** Check if a transcript is "live" - created recently and no duration (still in progress) */
function isLiveTranscript(t: any): boolean {
  if (t.durationSeconds != null && t.durationSeconds > 0) return false;
  const created = new Date(t.createdAt).getTime();
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;
  return created > fiveMinAgo;
}

/** Highlight search matches in text */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{
            background: "rgba(184,156,74,0.35)",
            color: "rgba(255,255,255,0.95)",
            borderRadius: "2px",
            padding: "0 2px",
          }}>{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/** Escape HTML special characters for safe injection */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Full transcript viewer panel - slide-out overlay */
function TranscriptPanel({ transcript: t, onClose, searchQuery }: { transcript: any; onClose: () => void; searchQuery?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = parseWebTranscript(t.transcript);
  const live = isLiveTranscript(t);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const copyAll = useCallback(() => {
    const text = messages.map(m => `${m.role === "ai" ? "AiA" : "Visitor"}: ${m.text}`).join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [messages]);

  const exportPdf = useCallback(() => {
    if (messages.length === 0) return;
    setExporting(true);
    try {
      const dateStr = new Date(t.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      const timeStr = new Date(t.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const name = t.visitorName || "Anonymous";
      const email = t.visitorEmail || "N/A";
      const phone = t.visitorPhone || "N/A";
      const duration = fmtDuration(t.durationSeconds);

      // Build HTML for PDF
      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, sans-serif; background: #03050A; color: #C8D7E6; padding: 40px; }
  .header { border-bottom: 2px solid rgba(184,156,74,0.30); padding-bottom: 24px; margin-bottom: 32px; }
  .logo-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
  .logo-text { font-size: 22px; font-weight: 700; color: #B89C4A; letter-spacing: 0.04em; }
  .subtitle { font-size: 11px; color: rgba(200,215,230,0.45); letter-spacing: 0.08em; text-transform: uppercase; }
  h1 { font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.92); margin-bottom: 12px; }
  .meta { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 8px; }
  .meta-item { font-size: 12px; color: rgba(200,215,230,0.55); }
  .meta-label { color: rgba(184,156,74,0.70); font-weight: 600; }
  .messages { margin-top: 24px; }
  .msg { margin-bottom: 20px; page-break-inside: avoid; }
  .speaker { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px; }
  .speaker-ai { color: rgba(184,156,74,0.80); }
  .speaker-visitor { color: rgba(120,200,255,0.80); }
  .bubble { padding: 12px 16px; border-radius: 10px; font-size: 13px; line-height: 1.65; max-width: 85%; }
  .bubble-ai { background: rgba(184,156,74,0.08); border: 1px solid rgba(184,156,74,0.15); border-radius: 2px 14px 14px 14px; }
  .bubble-visitor { background: rgba(120,200,255,0.06); border: 1px solid rgba(120,200,255,0.12); border-radius: 14px 2px 14px 14px; margin-left: auto; }
  .timestamp { font-size: 10px; color: rgba(200,215,230,0.25); margin-bottom: 4px; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center; }
  .footer p { font-size: 10px; color: rgba(200,215,230,0.30); }
</style></head><body>
  <div class="header">
    <div class="logo-row">
      <div class="logo-text">AiiACo</div>
    </div>
    <div class="subtitle">Conversation Transcript Report</div>
  </div>
  <h1>Conversation with ${escapeHtml(name)}</h1>
  <div class="meta">
    <div class="meta-item"><span class="meta-label">Date:</span> ${dateStr} at ${timeStr}</div>
    <div class="meta-item"><span class="meta-label">Email:</span> ${escapeHtml(email)}</div>
    <div class="meta-item"><span class="meta-label">Phone:</span> ${escapeHtml(phone)}</div>
    <div class="meta-item"><span class="meta-label">Duration:</span> ${duration}</div>
    <div class="meta-item"><span class="meta-label">Messages:</span> ${messages.length}</div>
    ${t.leadId ? `<div class="meta-item"><span class="meta-label">Lead:</span> #${t.leadId}</div>` : ""}
  </div>
  <div class="messages">
    ${messages.map(m => {
      const isAi = m.role === "ai";
      const ts = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
      return `<div class="msg">
        <div class="speaker ${isAi ? "speaker-ai" : "speaker-visitor"}">${isAi ? "AiA" : "Visitor"}</div>
        ${ts ? `<div class="timestamp">${ts}</div>` : ""}
        <div class="bubble ${isAi ? "bubble-ai" : "bubble-visitor"}">${escapeHtml(m.text)}</div>
      </div>`;
    }).join("")}
  </div>
  <div class="footer">
    <p>AiiACo · AI Integration Authority for the Corporate Age</p>
    <p>This transcript was generated from a conversation on aiiaco.com${t.source === "web_widget" ? " (floating widget)" : "/talk"}</p>
  </div>
</body></html>`;

      // Open in new window for print-to-PDF
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        // Slight delay for styles to load
        setTimeout(() => {
          win.print();
          setExporting(false);
        }, 500);
      } else {
        toast.error("Pop-up blocked. Please allow pop-ups for this site.");
        setExporting(false);
      }
    } catch {
      toast.error("Failed to generate PDF");
      setExporting(false);
    }
  }, [messages, t]);

  // Auto-scroll to bottom on new messages (live mode)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative", width: "100%", maxWidth: "640px",
          background: "#060A12", borderLeft: "1px solid rgba(184,156,74,0.15)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "slideInRight 0.25s ease-out",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              {live && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: "rgba(74,222,128,0.10)", color: "rgba(74,222,128,0.90)",
                  border: "1px solid rgba(74,222,128,0.25)", fontFamily: FF,
                }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80",
                    boxShadow: "0 0 8px rgba(74,222,128,0.6)",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }} />
                  Live
                </span>
              )}
              <h3 style={{ fontFamily: FFD, fontSize: "18px", fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
                {t.visitorName || "Anonymous"}
              </h3>
            </div>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {t.visitorEmail && (
                <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(184,156,74,0.70)" }}>
                  {t.visitorEmail}
                </span>
              )}
              {t.visitorPhone && (
                <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.50)" }}>
                  {t.visitorPhone}
                </span>
              )}
              <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.35)" }}>
                {new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" · "}
                {new Date(t.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px", alignItems: "center" }}>
              <span style={{
                fontFamily: FF, fontSize: "10px", fontWeight: 700,
                padding: "2px 8px", borderRadius: "4px",
                ...(t.source === "web_widget"
                  ? { color: "rgba(212,168,67,0.85)", background: "rgba(212,168,67,0.10)", border: "1px solid rgba(212,168,67,0.20)" }
                  : { color: "rgba(100,180,255,0.85)", background: "rgba(100,180,255,0.10)", border: "1px solid rgba(100,180,255,0.20)" }),
              }}>
                {t.source === "web_widget" ? "Widget" : "/talk page"}
              </span>
              <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.40)" }}>
                {messages.length} messages
              </span>
              <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.40)" }}>
                Duration: {fmtDuration(t.durationSeconds)}
              </span>
              {t.leadId && (
                <span style={{
                  fontFamily: FF, fontSize: "10px", fontWeight: 700,
                  color: "rgba(80,220,150,0.80)", background: "rgba(80,220,150,0.10)",
                  padding: "2px 8px", borderRadius: "4px",
                }}>
                  Lead #{t.leadId}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button
              onClick={exportPdf}
              disabled={messages.length === 0 || exporting}
              style={{
                fontFamily: FF, fontSize: "11px", fontWeight: 600, padding: "6px 14px",
                borderRadius: "6px", cursor: messages.length === 0 || exporting ? "not-allowed" : "pointer",
                border: "1px solid rgba(184,156,74,0.20)",
                background: "rgba(184,156,74,0.06)",
                color: "rgba(184,156,74,0.80)",
                opacity: messages.length === 0 ? 0.4 : 1,
              }}
            >
              {exporting ? "Exporting…" : "Download PDF"}
            </button>
            <button
              onClick={copyAll}
              disabled={messages.length === 0}
              style={{
                fontFamily: FF, fontSize: "11px", fontWeight: 600, padding: "6px 14px",
                borderRadius: "6px", cursor: messages.length === 0 ? "not-allowed" : "pointer",
                border: "1px solid rgba(255,255,255,0.10)",
                background: copied ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)",
                color: copied ? "rgba(74,222,128,0.90)" : "rgba(200,215,230,0.55)",
                opacity: messages.length === 0 ? 0.4 : 1,
              }}
            >
              {copied ? "Copied" : "Copy All"}
            </button>
            <button
              onClick={onClose}
              style={{
                fontFamily: FF, fontSize: "18px", fontWeight: 400, padding: "4px 10px",
                borderRadius: "6px", cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(200,215,230,0.55)",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Chat bubbles */}
        <div
          ref={scrollRef}
          style={{
            flex: 1, overflowY: "auto", padding: "24px",
            scrollBehavior: "smooth",
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.30)" }}>
                {live ? "Waiting for conversation to begin…" : "No messages in this transcript."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {messages.map((msg, i) => {
                const isAi = msg.role === "ai";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex", flexDirection: "column",
                      alignItems: isAi ? "flex-start" : "flex-end",
                      animation: "fadeInUp 0.2s ease-out",
                    }}
                  >
                    {/* Speaker + timestamp */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <span style={{
                        fontFamily: FF, fontSize: "10px", fontWeight: 700,
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        color: isAi ? "rgba(184,156,74,0.75)" : "rgba(120,200,255,0.75)",
                      }}>
                        {isAi ? "AiA" : "Visitor"}
                      </span>
                      {msg.timestamp && (
                        <span style={{ fontSize: "10px", color: "rgba(200,215,230,0.25)", fontFamily: FF }}>
                          {fmtTime(msg.timestamp)}
                        </span>
                      )}
                    </div>
                    {/* Bubble */}
                    <div style={{
                      maxWidth: "85%", padding: "12px 16px",
                      borderRadius: isAi ? "2px 14px 14px 14px" : "14px 2px 14px 14px",
                      background: isAi ? "rgba(184,156,74,0.08)" : "rgba(120,200,255,0.06)",
                      border: `1px solid ${isAi ? "rgba(184,156,74,0.15)" : "rgba(120,200,255,0.12)"}`,
                      fontFamily: FF, fontSize: "13px", lineHeight: 1.65,
                      color: "rgba(200,215,230,0.88)",
                    }}>
                      <HighlightText text={msg.text} query={searchQuery ?? ""} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

function WebTranscriptsTab() {
  const [liveMode, setLiveMode] = useState(false);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const prevCountRef = useRef(0);

  // Poll every 5s in live mode, otherwise static
  const { data: transcripts, isLoading } = trpc.talk.listTranscripts.useQuery(undefined, {
    refetchInterval: liveMode ? 5000 : false,
  });

  const all = transcripts ?? [];

  // Detect new transcripts arriving in live mode
  useEffect(() => {
    if (liveMode && all.length > prevCountRef.current && prevCountRef.current > 0) {
      toast.info("New transcript detected", { duration: 2000 });
    }
    prevCountRef.current = all.length;
  }, [all.length, liveMode]);

  const liveCount = all.filter(isLiveTranscript).length;

  const visible = all.filter((t: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (t.visitorName ?? "").toLowerCase().includes(q) ||
      (t.visitorEmail ?? "").toLowerCase().includes(q) ||
      (t.visitorPhone ?? "").toLowerCase().includes(q) ||
      (t.transcriptText ?? "").toLowerCase().includes(q)
    );
  });

  const viewingTranscript = viewingId != null ? all.find((t: any) => t.id === viewingId) : null;

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontFamily: FFD, fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: "0 0 4px" }}>Web Transcripts</h2>
          <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.40)", margin: 0 }}>Conversations from the /talk page and floating widget.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Live session count */}
          {liveCount > 0 && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontFamily: FF, fontSize: "12px", fontWeight: 600,
              color: "rgba(74,222,128,0.85)",
            }}>
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80",
                boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
              {liveCount} live
            </span>
          )}

          {/* Live mode toggle */}
          <button
            onClick={() => setLiveMode(!liveMode)}
            style={{
              fontFamily: FF, fontSize: "12px", fontWeight: 600, padding: "6px 14px",
              borderRadius: "6px", cursor: "pointer",
              border: `1px solid ${liveMode ? "rgba(74,222,128,0.30)" : "rgba(255,255,255,0.10)"}`,
              background: liveMode ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.04)",
              color: liveMode ? "rgba(74,222,128,0.90)" : "rgba(200,215,230,0.50)",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: liveMode ? "#4ade80" : "rgba(200,215,230,0.30)",
              transition: "background 0.2s",
            }} />
            {liveMode ? "Live" : "Live Mode"}
          </button>

          <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.35)" }}>{all.length} total</span>
        </div>
      </div>

      {/* Search */}
      <input
        style={{ ...inputStyle, maxWidth: "320px", marginBottom: "20px" }}
        placeholder="Search name, email, phone, or transcript…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isLoading ? (
        <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.35)" }}>Loading transcripts…</p>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontFamily: FFD, fontSize: "18px", color: "rgba(255,255,255,0.30)", margin: "0 0 8px" }}>No transcripts yet</p>
          <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.25)", margin: 0 }}>Transcripts from /talk page and widget conversations will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {visible.map((t: any) => {
            const messages = parseWebTranscript(t.transcript);
            const live = isLiveTranscript(t);
            const preview = messages.length > 0
              ? messages[messages.length - 1].text.slice(0, 80) + (messages[messages.length - 1].text.length > 80 ? "…" : "")
              : "No messages";

            return (
              <div
                key={t.id}
                onClick={() => setViewingId(t.id)}
                style={{
                  background: live ? "rgba(74,222,128,0.03)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${live ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "10px",
                  padding: "14px 18px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 80px 80px 60px",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = live ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = live ? "rgba(74,222,128,0.25)" : "rgba(184,156,74,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = live ? "rgba(74,222,128,0.03)" : "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = live ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)";
                }}
              >
                {/* Name + email */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {live && (
                      <span style={{
                        width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80",
                        boxShadow: "0 0 6px rgba(74,222,128,0.5)",
                        animation: "pulse 1.5s ease-in-out infinite", flexShrink: 0,
                      }} />
                    )}
                    <p style={{ fontFamily: FFD, fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.88)", margin: 0 }}>
                      {t.visitorName || "Anonymous"}
                    </p>
                  </div>
                  <p style={{ fontFamily: FF, fontSize: "12px", color: "rgba(184,156,74,0.70)", margin: "2px 0 0" }}>
                    {t.visitorEmail || "No email"}
                  </p>
                </div>

                {/* Last message preview */}
                <div>
                  <p style={{
                    fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.45)", margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {preview}
                  </p>
                  <div style={{ display: "flex", gap: "6px", marginTop: "2px", flexWrap: "wrap" }}>
                    {t.source === "web_widget" && (
                      <span style={{
                        fontFamily: FF, fontSize: "10px", fontWeight: 700,
                        color: "rgba(212,168,67,0.80)", background: "rgba(212,168,67,0.10)",
                        padding: "1px 6px", borderRadius: "3px", display: "inline-block",
                      }}>
                        Widget
                      </span>
                    )}
                    {t.source === "web_talk" && (
                      <span style={{
                        fontFamily: FF, fontSize: "10px", fontWeight: 700,
                        color: "rgba(100,180,255,0.80)", background: "rgba(100,180,255,0.10)",
                        padding: "1px 6px", borderRadius: "3px", display: "inline-block",
                      }}>
                        /talk
                      </span>
                    )}
                    {t.leadId && (
                      <span style={{
                        fontFamily: FF, fontSize: "10px", fontWeight: 700,
                        color: "rgba(80,220,150,0.80)", background: "rgba(80,220,150,0.10)",
                        padding: "1px 6px", borderRadius: "3px", display: "inline-block",
                      }}>
                        Lead #{t.leadId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message count */}
                <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.40)", textAlign: "center" }}>
                  {messages.length} msg{messages.length !== 1 ? "s" : ""}
                </span>

                {/* Duration */}
                <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.40)", textAlign: "center" }}>
                  {live ? (
                    <span style={{ color: "rgba(74,222,128,0.75)", fontWeight: 600 }}>Active</span>
                  ) : fmtDuration(t.durationSeconds)}
                </span>

                {/* Date */}
                <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.35)", textAlign: "right" }}>
                  {new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Full transcript slide-out panel */}
      {viewingTranscript && (
        <TranscriptPanel
          transcript={viewingTranscript}
          onClose={() => setViewingId(null)}
          searchQuery={search}
        />
      )}

      {/* Shared keyframe animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

// ─── VaaS Platform Tab ───────────────────────────────────────────────────────

function VaasPlatformTab() {
  const [subTab, setSubTab] = useState<"overview" | "agents" | "conversations" | "embed">("overview");
  const [expandedClient, setExpandedClient] = useState<number | null>(null);
  const [expandedConvo, setExpandedConvo] = useState<number | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const clientsQuery = trpc.leads.vaasClients.useQuery(undefined, { retry: false });
  const agentsQuery = trpc.leads.vaasAgents.useQuery(undefined, { retry: false });
  const conversationsQuery = trpc.leads.vaasConversations.useQuery(undefined, { retry: false });

  const toggleAgent = trpc.leads.vaasToggleAgent.useMutation({
    onSuccess: () => { agentsQuery.refetch(); toast.success("Agent status updated"); },
    onError: (e) => toast.error(e.message),
  });

  const clients = clientsQuery.data ?? [];
  const agents = agentsQuery.data ?? [];
  const conversations = conversationsQuery.data ?? [];

  const activeClients = clients.filter((c: any) => c.status === "active").length;
  const trialClients = clients.filter((c: any) => c.status === "trial").length;
  const mrr = clients
    .filter((c: any) => c.status === "active")
    .reduce((sum: number, c: any) => sum + (c.monthlyPriceCents ?? 0), 0) / 100;
  const activeAgents = agents.filter((a: any) => a.status === "active").length;

  const isLoading = clientsQuery.isLoading || agentsQuery.isLoading;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedToken(label);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedToken(null), 2000);
    });
  }

  function getEmbedSnippet(token: string) {
    return `<script src="https://aiiaco.com/agent/embed.js" data-token="${token}" async><\/script>`;
  }

  const agentStatusColor = (s: string) => s === "active" ? "rgba(80,220,150,1)" : s === "paused" ? "rgba(255,180,60,0.90)" : s === "draft" ? "rgba(200,215,230,0.40)" : "rgba(255,80,80,0.70)";
  const clientStatusColor = (s: string) => s === "active" ? "rgba(80,220,150,1)" : s === "trial" ? "rgba(184,156,74,0.90)" : "rgba(200,215,230,0.40)";

  // Sub-tab bar style
  const subTabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: FF, fontSize: "12px", fontWeight: 600,
    color: active ? "rgba(212,180,80,1)" : "rgba(200,215,230,0.40)",
    background: active ? "rgba(184,156,74,0.10)" : "transparent",
    border: active ? "1px solid rgba(184,156,74,0.25)" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: "6px", padding: "7px 16px", cursor: "pointer",
    letterSpacing: "0.04em",
  });

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total Clients", value: clients.length },
          { label: "Active", value: activeClients },
          { label: "Trial", value: trialClients },
          { label: "Active Agents", value: `${activeAgents}/${agents.length}` },
          { label: "Conversations", value: conversations.length },
          { label: "MRR", value: `$${mrr.toLocaleString()}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px 20px" }}>
            <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(184,156,74,0.55)", margin: "0 0 6px" }}>{label}</p>
            <p style={{ fontFamily: FFD, fontSize: "28px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: 0, lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Sub-tab bar */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {(["overview", "agents", "conversations", "embed"] as const).map((t) => (
          <button key={t} onClick={() => setSubTab(t)} style={subTabStyle(subTab === t)}>
            {t === "overview" ? "Clients" : t === "agents" ? "Agents" : t === "conversations" ? "Conversations" : "Embed Tokens"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.35)" }}>Loading platform data\u2026</p>
      ) : (
        <>
          {/* ═══ OVERVIEW / CLIENTS SUB-TAB ═══ */}
          {subTab === "overview" && (
            <div>
              {clients.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ fontFamily: FFD, fontSize: "18px", color: "rgba(255,255,255,0.30)", margin: "0 0 8px" }}>No clients yet</p>
                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.25)", margin: 0 }}>Clients will appear here when they sign up via /demo</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {clients.map((client: any) => {
                    const clientAgents = agents.filter((a: any) => a.clientId === client.id);
                    const clientConvos = conversations.filter((c: any) => c.clientId === client.id);
                    const isExpanded = expandedClient === client.id;
                    return (
                      <div key={client.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden" }}>
                        {/* Client row */}
                        <div
                          onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto auto auto", alignItems: "center", padding: "14px 20px", cursor: "pointer", gap: "12px" }}
                        >
                          <div>
                            <p style={{ fontFamily: FF, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{client.companyName || "\u2014"}</p>
                            <p style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.40)", margin: "2px 0 0" }}>{client.contactName}</p>
                          </div>
                          <p style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.50)", margin: 0 }}>{client.email}</p>
                          <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, color: clientStatusColor(client.status), textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            {client.status}
                          </span>
                          <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.55)" }}>{clientAgents.length} agent{clientAgents.length !== 1 ? "s" : ""}</span>
                          <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.55)" }}>{clientConvos.length} conv</span>
                          <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.55)" }}>${((client.monthlyPriceCents ?? 0) / 100).toLocaleString()}/mo</span>
                          <span style={{ fontFamily: FF, fontSize: "16px", color: "rgba(200,215,230,0.30)", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>\u25BC</span>
                        </div>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 20px", background: "rgba(255,255,255,0.01)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                              <div>
                                <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Phone</p>
                                <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(255,255,255,0.70)", margin: 0 }}>{client.phone || "\u2014"}</p>
                              </div>
                              <div>
                                <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Website</p>
                                <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(255,255,255,0.70)", margin: 0 }}>{client.websiteUrl || "\u2014"}</p>
                              </div>
                              <div>
                                <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Industry</p>
                                <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(255,255,255,0.70)", margin: 0 }}>{client.industry || "\u2014"}</p>
                              </div>
                              <div>
                                <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Trial Used</p>
                                <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(255,255,255,0.70)", margin: 0 }}>{Math.floor(client.trialSecondsUsed / 60)}m {client.trialSecondsUsed % 60}s / 15m</p>
                              </div>
                            </div>

                            {/* Client's agents */}
                            {clientAgents.length > 0 && (
                              <div>
                                <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(184,156,74,0.55)", margin: "0 0 10px" }}>Agents</p>
                                {clientAgents.map((agent: any) => (
                                  <div key={agent.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "6px" }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <p style={{ fontFamily: FF, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.80)", margin: 0 }}>{agent.agentName}</p>
                                      <p style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.35)", margin: "2px 0 0" }}>{agent.templateType} \u00B7 {agent.voiceTier} voice \u00B7 Token: {agent.embedToken.slice(0, 12)}\u2026</p>
                                    </div>
                                    <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, color: agentStatusColor(agent.status), textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                      {agent.status}
                                    </span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); copyToClipboard(getEmbedSnippet(agent.embedToken), agent.embedToken); }}
                                      style={{ ...btnGhost, fontSize: "11px", padding: "5px 10px" }}
                                    >
                                      {copiedToken === agent.embedToken ? "\u2713 Copied" : "Copy Embed"}
                                    </button>
                                    {agent.status === "active" ? (
                                      <button onClick={(e) => { e.stopPropagation(); toggleAgent.mutate({ agentId: agent.id, status: "paused" }); }} style={{ ...btnGhost, fontSize: "11px", padding: "5px 10px", color: "rgba(255,180,60,0.80)", borderColor: "rgba(255,180,60,0.20)" }}>Pause</button>
                                    ) : agent.status === "paused" ? (
                                      <button onClick={(e) => { e.stopPropagation(); toggleAgent.mutate({ agentId: agent.id, status: "active" }); }} style={{ ...btnGhost, fontSize: "11px", padding: "5px 10px", color: "rgba(80,220,150,0.80)", borderColor: "rgba(80,220,150,0.20)" }}>Resume</button>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Recent conversations for this client */}
                            {clientConvos.length > 0 && (
                              <div style={{ marginTop: "12px" }}>
                                <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(184,156,74,0.55)", margin: "0 0 10px" }}>Recent Conversations ({clientConvos.length})</p>
                                {clientConvos.slice(0, 5).map((convo: any) => (
                                  <div key={convo.id} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "6px", marginBottom: "4px", display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{ fontFamily: FF, fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.70)", minWidth: "100px" }}>{convo.callerName || "Unknown"}</span>
                                    <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.40)" }}>{convo.durationSeconds ? `${Math.floor(convo.durationSeconds / 60)}m ${convo.durationSeconds % 60}s` : "\u2014"}</span>
                                    {convo.leadScore && <span style={{ fontFamily: FF, fontSize: "10px", fontWeight: 700, color: convo.leadScore >= 7 ? "rgba(80,220,150,0.90)" : convo.leadScore >= 4 ? "rgba(184,156,74,0.80)" : "rgba(200,215,230,0.40)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: "4px" }}>Score: {convo.leadScore}/10</span>}
                                    <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.30)", marginLeft: "auto" }}>{new Date(convo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ AGENTS SUB-TAB ═══ */}
          {subTab === "agents" && (
            <div>
              {agents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ fontFamily: FFD, fontSize: "18px", color: "rgba(255,255,255,0.30)", margin: "0 0 8px" }}>No agents created yet</p>
                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.25)", margin: 0 }}>Agents appear when clients complete the /demo wizard</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Agent Name", "Client", "Template", "Voice", "Status", "EL Agent ID", "Actions"].map((h) => (
                          <th key={h} style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", padding: "12px 16px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((agent: any) => {
                        const client = clients.find((c: any) => c.id === agent.clientId);
                        const agentConvos = conversations.filter((c: any) => c.clientAgentId === agent.id);
                        return (
                          <tr key={agent.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <td style={{ fontFamily: FF, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.85)", padding: "14px 16px" }}>
                              {agent.agentName}
                              <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.30)", display: "block", marginTop: "2px" }}>{agentConvos.length} conversation{agentConvos.length !== 1 ? "s" : ""}</span>
                            </td>
                            <td style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.60)", padding: "14px 16px" }}>{client?.companyName || "\u2014"}</td>
                            <td style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.50)", padding: "14px 16px", textTransform: "capitalize" }}>{agent.templateType.replace("_", " ")}</td>
                            <td style={{ fontFamily: FF, fontSize: "11px", color: agent.voiceTier === "premium" ? "rgba(184,156,74,0.80)" : "rgba(200,215,230,0.45)", padding: "14px 16px", textTransform: "uppercase" }}>{agent.voiceTier}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, color: agentStatusColor(agent.status), textTransform: "uppercase", letterSpacing: "0.06em" }}>{agent.status}</span>
                            </td>
                            <td style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "11px", color: "rgba(200,215,230,0.35)", padding: "14px 16px" }}>
                              {agent.elevenlabsAgentId ? agent.elevenlabsAgentId.slice(0, 16) + "\u2026" : "Not set"}
                            </td>
                            <td style={{ padding: "14px 16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              <button onClick={() => copyToClipboard(getEmbedSnippet(agent.embedToken), `agent-${agent.id}`)} style={{ ...btnGhost, fontSize: "11px", padding: "5px 10px" }}>
                                {copiedToken === `agent-${agent.id}` ? "\u2713 Copied" : "Copy Embed"}
                              </button>
                              {agent.status === "active" && (
                                <button onClick={() => toggleAgent.mutate({ agentId: agent.id, status: "paused" })} style={{ ...btnGhost, fontSize: "11px", padding: "5px 10px", color: "rgba(255,180,60,0.80)", borderColor: "rgba(255,180,60,0.20)" }}>Pause</button>
                              )}
                              {agent.status === "paused" && (
                                <button onClick={() => toggleAgent.mutate({ agentId: agent.id, status: "active" })} style={{ ...btnGhost, fontSize: "11px", padding: "5px 10px", color: "rgba(80,220,150,0.80)", borderColor: "rgba(80,220,150,0.20)" }}>Resume</button>
                              )}
                              {(agent.status === "draft" || agent.status === "locked") && (
                                <button onClick={() => toggleAgent.mutate({ agentId: agent.id, status: "active" })} style={{ ...btnGhost, fontSize: "11px", padding: "5px 10px", color: "rgba(80,220,150,0.80)", borderColor: "rgba(80,220,150,0.20)" }}>Activate</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ═══ CONVERSATIONS SUB-TAB ═══ */}
          {subTab === "conversations" && (
            <div>
              {conversations.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ fontFamily: FFD, fontSize: "18px", color: "rgba(255,255,255,0.30)", margin: "0 0 8px" }}>No conversations yet</p>
                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.25)", margin: 0 }}>Conversations appear when visitors talk to embedded agents</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {conversations.map((convo: any) => {
                    const agent = agents.find((a: any) => a.id === convo.clientAgentId);
                    const client = clients.find((c: any) => c.id === convo.clientId);
                    const isExpanded = expandedConvo === convo.id;
                    let painPoints: string[] = [];
                    try { if (convo.painPoints) painPoints = JSON.parse(convo.painPoints); } catch { /* ignore */ }

                    return (
                      <div key={convo.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden" }}>
                        <div
                          onClick={() => setExpandedConvo(isExpanded ? null : convo.id)}
                          style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 20px", cursor: "pointer" }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontFamily: FF, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.80)", margin: 0 }}>
                              {convo.callerName || "Unknown Visitor"}
                              {convo.callerEmail && <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.40)", marginLeft: "8px" }}>{convo.callerEmail}</span>}
                            </p>
                            <p style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.35)", margin: "2px 0 0" }}>
                              {agent?.agentName || "Unknown Agent"} \u00B7 {client?.companyName || "Unknown Client"}
                            </p>
                          </div>
                          {convo.leadScore && (
                            <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, color: convo.leadScore >= 7 ? "rgba(80,220,150,0.90)" : convo.leadScore >= 4 ? "rgba(184,156,74,0.80)" : "rgba(200,215,230,0.40)", background: "rgba(255,255,255,0.04)", padding: "3px 10px", borderRadius: "4px" }}>
                              {convo.leadScore}/10
                            </span>
                          )}
                          <span style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.45)" }}>
                            {convo.durationSeconds ? `${Math.floor(convo.durationSeconds / 60)}m ${convo.durationSeconds % 60}s` : "\u2014"}
                          </span>
                          <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, color: convo.status === "new" ? "rgba(184,156,74,0.80)" : convo.status === "contacted" ? "rgba(80,220,150,0.80)" : "rgba(200,215,230,0.45)", textTransform: "uppercase" }}>
                            {convo.status}
                          </span>
                          <span style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.30)" }}>
                            {new Date(convo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span style={{ fontFamily: FF, fontSize: "16px", color: "rgba(200,215,230,0.30)", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>\u25BC</span>
                        </div>

                        {isExpanded && (
                          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 20px", background: "rgba(255,255,255,0.01)" }}>
                            {/* Contact info */}
                            <div style={{ display: "flex", gap: "24px", marginBottom: "16px", flexWrap: "wrap" }}>
                              {convo.callerPhone && (
                                <div>
                                  <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Phone</p>
                                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(255,255,255,0.70)", margin: 0 }}>{convo.callerPhone}</p>
                                </div>
                              )}
                              {convo.callerEmail && (
                                <div>
                                  <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>Email</p>
                                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(255,255,255,0.70)", margin: 0 }}>{convo.callerEmail}</p>
                                </div>
                              )}
                            </div>

                            {/* Pain points */}
                            {painPoints.length > 0 && (
                              <div style={{ marginBottom: "16px" }}>
                                <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(184,156,74,0.55)", margin: "0 0 8px" }}>Pain Points</p>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                  {painPoints.map((p: string, i: number) => (
                                    <span key={i} style={{ fontFamily: FF, fontSize: "11px", color: "rgba(255,255,255,0.65)", background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.15)", borderRadius: "4px", padding: "3px 10px" }}>{p}</span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Intelligence summary */}
                            {convo.intelligenceSummary && (
                              <div style={{ marginBottom: "16px" }}>
                                <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(184,156,74,0.55)", margin: "0 0 8px" }}>Intelligence Summary</p>
                                <p style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.60)", lineHeight: 1.6, margin: 0 }}>{convo.intelligenceSummary}</p>
                              </div>
                            )}

                            {/* Full transcript */}
                            {convo.transcript && (
                              <div>
                                <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(184,156,74,0.55)", margin: "0 0 8px" }}>Full Transcript</p>
                                <div style={{ background: "rgba(0,0,0,0.30)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "8px", padding: "16px", maxHeight: "400px", overflowY: "auto" }}>
                                  <pre style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.55)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{convo.transcript}</pre>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═══ EMBED TOKENS SUB-TAB ═══ */}
          {subTab === "embed" && (
            <div>
              {agents.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ fontFamily: FFD, fontSize: "18px", color: "rgba(255,255,255,0.30)", margin: "0 0 8px" }}>No embed tokens</p>
                  <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.25)", margin: 0 }}>Tokens are generated when agents are created</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        {["Agent", "Client", "Embed Token", "Status", "Actions"].map((h) => (
                          <th key={h} style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", padding: "12px 16px", textAlign: "left" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {agents.map((agent: any) => {
                        const client = clients.find((c: any) => c.id === agent.clientId);
                        return (
                          <tr key={agent.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <td style={{ fontFamily: FF, fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.80)", padding: "14px 16px" }}>{agent.agentName}</td>
                            <td style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.55)", padding: "14px 16px" }}>{client?.companyName || "\u2014"}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <code style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "11px", color: "rgba(200,215,230,0.55)", background: "rgba(255,255,255,0.04)", padding: "4px 8px", borderRadius: "4px" }}>{agent.embedToken}</code>
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ fontFamily: FF, fontSize: "11px", fontWeight: 700, color: agentStatusColor(agent.status), textTransform: "uppercase", letterSpacing: "0.06em" }}>{agent.status}</span>
                            </td>
                            <td style={{ padding: "14px 16px", display: "flex", gap: "6px" }}>
                              <button onClick={() => copyToClipboard(agent.embedToken, `token-${agent.id}`)} style={{ ...btnGhost, fontSize: "11px", padding: "5px 10px" }}>
                                {copiedToken === `token-${agent.id}` ? "\u2713" : "Copy Token"}
                              </button>
                              <button onClick={() => copyToClipboard(getEmbedSnippet(agent.embedToken), `snippet-${agent.id}`)} style={{ ...btnGhost, fontSize: "11px", padding: "5px 10px" }}>
                                {copiedToken === `snippet-${agent.id}` ? "\u2713" : "Copy Snippet"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Embed snippet preview */}
              {agents.length > 0 && (
                <div style={{ marginTop: "24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px" }}>
                  <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(184,156,74,0.55)", margin: "0 0 12px" }}>Embed Snippet Example</p>
                  <p style={{ fontFamily: FF, fontSize: "12px", color: "rgba(200,215,230,0.50)", margin: "0 0 12px", lineHeight: 1.5 }}>
                    Clients paste this single line into their website's HTML, just before the closing <code style={{ color: "rgba(184,156,74,0.70)" }}>&lt;/body&gt;</code> tag:
                  </p>
                  <div style={{ background: "rgba(0,0,0,0.40)", borderRadius: "8px", padding: "16px", position: "relative" }}>
                    <code style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "12px", color: "rgba(80,220,150,0.80)", lineHeight: 1.6 }}>
                      {`<script src="https://aiiaco.com/agent/embed.js" data-token="aia_..." async></script>`}
                    </code>
                  </div>
                  <p style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.30)", margin: "12px 0 0", lineHeight: 1.5 }}>
                    The widget loads asynchronously, fetches the agent config from our API, and renders a floating voice button. No build step, no dependencies, no React required.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Console ─────────────────────────────────────────────────────────────

function Console({ adminUser }: { adminUser: { id: number; username: string; displayName: string | null; role: string } }) {
  const [tab, setTab] = useState<"leads" | "transcripts" | "admins" | "platform">("leads");
  const [filter, setFilter] = useState<Lead["status"] | "all">("all");
  const [search, setSearch] = useState("");
  const utils = trpc.useUtils();

  const { data: leads, isLoading, refetch } = trpc.leads.list.useQuery();

  const updateStatus = trpc.leads.updateStatus.useMutation({
    onSuccess: () => { refetch(); toast.success("Status updated"); },
    onError: () => toast.error("Failed to update status"),
  });

  const logout = trpc.adminAuth.logout.useMutation({
    onSuccess: () => {
      clearAdminToken();
      utils.adminAuth.me.invalidate();
    },
  });

  const allLeads = leads ?? [];
  const byStatus = (s: Lead["status"]) => allLeads.filter((l) => l.status === s).length;

  const visible = allLeads
    .filter((l) => filter === "all" || l.status === filter)
    .filter((l) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company ?? "").toLowerCase().includes(q) ||
        (l.industry ?? "").toLowerCase().includes(q)
      );
    });

  return (
    <div style={{ background: "#03050A", minHeight: "100vh", color: "rgba(255,255,255,0.88)" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <img
              src="/images/logo-gold.webp"
              alt="AiiA logo"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
            />
            <div>
              <p style={{ fontFamily: FFD, fontSize: "16px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: 0 }}>AiiACo Operations Console</p>
              <p style={{ fontFamily: FF, fontSize: "11px", color: "rgba(200,215,230,0.35)", margin: 0, letterSpacing: "0.06em" }}>
                {adminUser.displayName || adminUser.username} · {adminUser.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout.mutate()}
            style={{ fontFamily: FF, fontSize: "13px", fontWeight: 600, color: "rgba(200,215,230,0.45)", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "7px 16px", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", gap: "0" }}>
          {(["leads", "transcripts", "platform", "admins"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: FF, fontSize: "13px", fontWeight: 600,
                color: tab === t ? "rgba(212,180,80,1)" : "rgba(200,215,230,0.40)",
                background: "transparent", border: "none",
                borderBottom: tab === t ? "2px solid rgba(184,156,74,0.80)" : "2px solid transparent",
                padding: "14px 20px", cursor: "pointer", textTransform: "capitalize", letterSpacing: "0.04em",
              }}
            >
              {t === "leads" ? `Leads (${allLeads.length})` : t === "transcripts" ? "Web Transcripts" : t === "platform" ? "Voice Platform" : "Admin Users"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px" }}>
        {tab === "leads" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))", gap: "12px", marginBottom: "28px" }}>
              {[
                { label: "Total", value: allLeads.length },
                { label: "New", value: byStatus("new") },
                { label: "Reviewed", value: byStatus("reviewed") },
                { label: "Contacted", value: byStatus("contacted") },
                { label: "Closed", value: byStatus("closed") },
                { label: "Full Intakes", value: allLeads.filter(l => l.type === "intake").length },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px 20px" }}>
                  <p style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(184,156,74,0.55)", margin: "0 0 6px" }}>{label}</p>
                  <p style={{ fontFamily: FFD, fontSize: "28px", fontWeight: 700, color: "rgba(255,255,255,0.90)", margin: 0, lineHeight: 1 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
              <input
                style={{ ...inputStyle, maxWidth: "260px" }}
                placeholder="Search name, email, company…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {(["all", "new", "reviewed", "contacted", "closed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    fontFamily: FF, fontSize: "12px", fontWeight: 600, padding: "8px 16px", borderRadius: "6px", cursor: "pointer",
                    background: filter === s ? "rgba(184,156,74,0.14)" : "transparent",
                    color: filter === s ? "rgba(212,180,80,1)" : "rgba(200,215,230,0.45)",
                    border: filter === s ? "1px solid rgba(184,156,74,0.30)" : "1px solid rgba(255,255,255,0.07)",
                    textTransform: "capitalize",
                  }}
                >
                  {s === "all" ? `All (${allLeads.length})` : `${STATUS_LABELS[s]} (${byStatus(s)})`}
                </button>
              ))}
            </div>

            {/* Table */}
            {isLoading ? (
              <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.35)" }}>Loading leads…</p>
            ) : visible.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <p style={{ fontFamily: FFD, fontSize: "18px", color: "rgba(255,255,255,0.30)", margin: "0 0 8px" }}>No leads yet</p>
                <p style={{ fontFamily: FF, fontSize: "13px", color: "rgba(200,215,230,0.25)", margin: 0 }}>Leads will appear here when contact forms are submitted.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["Contact", "Company", "Type", "Industry", "Status", "Date", ""].map((h) => (
                        <th key={h} style={{ fontFamily: FF, fontSize: "10px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", padding: "12px 16px", textAlign: "left" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((lead) => (
                      <LeadRow
                        key={lead.id}
                        lead={lead}
                        onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === "transcripts" && (
          <WebTranscriptsTab />
        )}

        {tab === "platform" && (
          <VaasPlatformTab />
        )}

        {tab === "admins" && (
          <AdminManagementTab currentUserId={adminUser.id} currentRole={adminUser.role} />
        )}
      </div>
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function AdminConsolePage() {
  const { data: adminUser, isLoading } = trpc.adminAuth.me.useQuery();
  const { data: hasAdminsData, isLoading: hasAdminsLoading } = trpc.adminAuth.hasAdmins.useQuery();
  const utils = trpc.useUtils();
  const [showSetup, setShowSetup] = useState(false);

  if (isLoading || hasAdminsLoading) {
    return (
      <div style={{ background: "#03050A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: FF, color: "rgba(200,215,230,0.35)", fontSize: "14px" }}>Loading…</div>
      </div>
    );
  }

  // If logged in, show the console
  if (adminUser) {
    return <Console adminUser={adminUser} />;
  }

  // No admins exist yet - force setup
  if (!hasAdminsData?.hasAdmins || showSetup) {
    return <SetupPage onDone={() => { setShowSetup(false); utils.adminAuth.me.invalidate(); utils.adminAuth.hasAdmins.invalidate(); }} />;
  }

  return <LoginPage onLogin={() => utils.adminAuth.me.invalidate()} />;
}
