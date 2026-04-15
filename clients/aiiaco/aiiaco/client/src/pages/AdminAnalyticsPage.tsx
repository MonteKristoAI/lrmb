import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";

// ── Design tokens (matching AdminLeadsPage) ──────────────────────────────────
const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FONT_DISPLAY = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
const GOLD = "rgba(184,156,74,0.90)";
const GOLD_DIM = "rgba(184,156,74,0.35)";
const TEXT_PRIMARY = "rgba(255,255,255,0.92)";
const TEXT_SECONDARY = "rgba(200,215,230,0.60)";
const BG_CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.06)";

// Track colors for pie chart
const TRACK_COLORS: Record<string, string> = {
  operator: "#4A90D9",
  agent: "#50C878",
  corporate: "#B89C4A",
  unknown: "#6B7280",
  untracked: "#4B5563",
};

// Status colors
const STATUS_COLORS: Record<string, string> = {
  new: "#60A5FA",
  diagnostic_ready: "#FBBF24",
  reviewed: "#A78BFA",
  contacted: "#34D399",
  closed: "#6B7280",
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function timeAgo(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={{
      flex: "1 1 200px",
      minWidth: "180px",
      background: BG_CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: "12px",
      padding: "20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    }}>
      <span style={{ fontFamily: FONT, fontSize: "11px", fontWeight: 600, color: TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: "32px", fontWeight: 700, color: accent ?? GOLD, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontFamily: FONT, fontSize: "12px", color: TEXT_SECONDARY, marginTop: "2px" }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// ── Custom Tooltip for charts ────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,12,20,0.95)",
      border: `1px solid ${GOLD_DIM}`,
      borderRadius: "8px",
      padding: "10px 14px",
      fontFamily: FONT,
      fontSize: "12px",
    }}>
      <div style={{ color: TEXT_PRIMARY, fontWeight: 600, marginBottom: "4px" }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color ?? GOLD, display: "flex", gap: "8px", justifyContent: "space-between" }}>
          <span>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const [dayRange, setDayRange] = useState(30);

  const { data: overview, isLoading: loadingOverview } = trpc.analytics.overview.useQuery();
  const { data: dailyVolume, isLoading: loadingDaily } = trpc.analytics.dailyVolume.useQuery({ days: dayRange });
  const { data: recentCalls, isLoading: loadingRecent } = trpc.analytics.recentCalls.useQuery({ limit: 10 });
  const { data: emailEngagement, isLoading: loadingEmail } = trpc.analytics.emailEngagement.useQuery();
  const { data: recentEmailEvents, isLoading: loadingEmailEvents } = trpc.analytics.recentEmailEvents.useQuery({ limit: 15 });

  const isLoading = loadingOverview || loadingDaily || loadingRecent;

  // Prepare track distribution data for pie chart
  const trackData = overview
    ? Object.entries(overview.byTrack)
        .filter(([, count]) => count > 0)
        .map(([track, count]) => ({ name: track.charAt(0).toUpperCase() + track.slice(1), value: count, fill: TRACK_COLORS[track] ?? "#6B7280" }))
    : [];

  // Prepare status distribution data
  const statusData = overview
    ? Object.entries(overview.byStatus)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({ name: status.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()), value: count, fill: STATUS_COLORS[status] ?? "#6B7280" }))
    : [];

  // Prepare daily volume chart data
  const volumeChartData = (dailyVolume ?? []).map(d => ({
    date: formatDate(d.date),
    calls: d.count,
    avgDuration: d.avgDuration,
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#03050A" }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${BORDER}`,
        background: "rgba(3,5,10,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/leads" style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 700, color: GOLD, textDecoration: "none", letterSpacing: "0.04em" }}>
              AiiA OPS
            </a>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 600, color: TEXT_PRIMARY }}>
              📊 Analytics
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/leads" style={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600, color: TEXT_SECONDARY, textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
              📋 Leads
            </a>
            <a href="/admin/knowledge" style={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600, color: TEXT_SECONDARY, textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
              📚 Knowledge
            </a>
            <a href="/admin/agent" style={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600, color: TEXT_SECONDARY, textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
              🤖 Agent Config
            </a>
            <a href="/" style={{ fontFamily: FONT, fontSize: "12px", color: "rgba(184,156,74,0.70)", textDecoration: "none" }}>
              ← Site
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Title */}
        <h1 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700,
          color: TEXT_PRIMARY,
          letterSpacing: "-0.02em",
          marginBottom: "8px",
        }}>
          Call Analytics
        </h1>
        <p style={{ fontFamily: FONT, fontSize: "14px", color: TEXT_SECONDARY, marginBottom: "32px" }}>
          Voice call performance, lead pipeline health, and conversion metrics.
        </p>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: TEXT_SECONDARY, fontFamily: FONT }}>
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>⏳</div>
            Loading analytics...
          </div>
        ) : (
          <>
            {/* KPI Cards Row */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "32px" }}>
              <KpiCard
                label="Total Leads"
                value={overview?.totalLeads ?? 0}
                sub={`${overview?.byType?.intake ?? 0} intake · ${overview?.byType?.call ?? 0} call`}
                accent={TEXT_PRIMARY}
              />
              <KpiCard
                label="Voice Calls"
                value={overview?.totalVoiceCalls ?? 0}
                sub={`${overview?.callsToday ?? 0} today · ${overview?.callsThisWeek ?? 0} this week`}
              />
              <KpiCard
                label="Avg Duration"
                value={formatDuration(overview?.avgCallDurationSeconds ?? 0)}
                sub="Per voice call"
              />
              <KpiCard
                label="Conversion Rate"
                value={`${overview?.conversionRate ?? 0}%`}
                sub="Leads → Contacted/Closed"
                accent="#34D399"
              />
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
              {/* Call Volume Chart */}
              <div style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "12px",
                padding: "24px",
                gridColumn: volumeChartData.length > 0 ? "1 / -1" : undefined,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: 700, color: TEXT_PRIMARY, margin: 0 }}>
                    Call Volume
                  </h2>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[7, 14, 30, 60].map(d => (
                      <button
                        key={d}
                        onClick={() => setDayRange(d)}
                        style={{
                          fontFamily: FONT,
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: `1px solid ${dayRange === d ? GOLD_DIM : BORDER}`,
                          background: dayRange === d ? "rgba(184,156,74,0.12)" : "transparent",
                          color: dayRange === d ? GOLD : TEXT_SECONDARY,
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                </div>
                {volumeChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={volumeChartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                      <XAxis
                        dataKey="date"
                        tick={{ fill: TEXT_SECONDARY, fontSize: 10, fontFamily: FONT }}
                        axisLine={{ stroke: BORDER }}
                        tickLine={false}
                        interval={Math.max(0, Math.floor(volumeChartData.length / 10))}
                      />
                      <YAxis
                        tick={{ fill: TEXT_SECONDARY, fontSize: 10, fontFamily: FONT }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="calls" name="Calls" fill="rgba(184,156,74,0.70)" radius={[4, 4, 0, 0]} maxBarSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 0", color: TEXT_SECONDARY, fontFamily: FONT, fontSize: "13px" }}>
                    No call data yet. Calls will appear here as they come in.
                  </div>
                )}
              </div>
            </div>

            {/* Distribution Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
              {/* Track Distribution */}
              <div style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "12px",
                padding: "24px",
              }}>
                <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: 700, color: TEXT_PRIMARY, margin: "0 0 20px 0" }}>
                  Track Distribution
                </h2>
                {trackData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={trackData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {trackData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                      <Legend
                        wrapperStyle={{ fontFamily: FONT, fontSize: "11px", color: TEXT_SECONDARY }}
                        iconType="circle"
                        iconSize={8}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 0", color: TEXT_SECONDARY, fontFamily: FONT, fontSize: "13px" }}>
                    No track data yet.
                  </div>
                )}
              </div>

              {/* Status Distribution */}
              <div style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "12px",
                padding: "24px",
              }}>
                <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: 700, color: TEXT_PRIMARY, margin: "0 0 20px 0" }}>
                  Pipeline Status
                </h2>
                {statusData.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {statusData.map((s) => {
                      const total = overview?.totalLeads ?? 1;
                      const pct = Math.round((s.value / total) * 100);
                      return (
                        <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontFamily: FONT, fontSize: "12px", color: TEXT_SECONDARY, width: "120px", textAlign: "right" }}>
                            {s.name}
                          </span>
                          <div style={{ flex: 1, height: "20px", background: "rgba(255,255,255,0.04)", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: `${Math.max(pct, 2)}%`,
                              background: s.fill,
                              borderRadius: "4px",
                              transition: "width 0.5s ease",
                              display: "flex",
                              alignItems: "center",
                              paddingLeft: "8px",
                            }}>
                              {pct >= 10 && (
                                <span style={{ fontFamily: FONT, fontSize: "10px", fontWeight: 700, color: "#fff" }}>
                                  {s.value}
                                </span>
                              )}
                            </div>
                          </div>
                          <span style={{ fontFamily: FONT, fontSize: "12px", fontWeight: 600, color: TEXT_PRIMARY, width: "40px" }}>
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "60px 0", color: TEXT_SECONDARY, fontFamily: FONT, fontSize: "13px" }}>
                    No status data yet.
                  </div>
                )}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "32px",
            }}>
              <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: 700, color: TEXT_PRIMARY, margin: "0 0 20px 0" }}>
                Conversion Funnel
              </h2>
              {overview && overview.totalLeads > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                  {[
                    { label: "New Leads", count: overview.byStatus.new ?? 0, color: "#60A5FA" },
                    { label: "Diagnostic Ready", count: overview.byStatus.diagnostic_ready ?? 0, color: "#FBBF24" },
                    { label: "Reviewed", count: overview.byStatus.reviewed ?? 0, color: "#A78BFA" },
                    { label: "Contacted", count: overview.byStatus.contacted ?? 0, color: "#34D399" },
                    { label: "Closed", count: overview.byStatus.closed ?? 0, color: "#6B7280" },
                  ].map((stage, i, arr) => (
                    <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{
                        background: `${stage.color}15`,
                        border: `1px solid ${stage.color}40`,
                        borderRadius: "10px",
                        padding: "16px 24px",
                        textAlign: "center",
                        minWidth: "120px",
                      }}>
                        <div style={{ fontFamily: FONT_DISPLAY, fontSize: "28px", fontWeight: 700, color: stage.color, lineHeight: 1.1 }}>
                          {stage.count}
                        </div>
                        <div style={{ fontFamily: FONT, fontSize: "11px", color: TEXT_SECONDARY, marginTop: "4px" }}>
                          {stage.label}
                        </div>
                      </div>
                      {i < arr.length - 1 && (
                        <span style={{ fontFamily: FONT, fontSize: "18px", color: "rgba(255,255,255,0.15)", padding: "0 4px" }}>→</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0", color: TEXT_SECONDARY, fontFamily: FONT, fontSize: "13px" }}>
                  No funnel data yet.
                </div>
              )}
            </div>

            {/* Email Engagement Section */}
            <div style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "32px",
            }}>
              <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: 700, color: TEXT_PRIMARY, margin: "0 0 20px 0" }}>
                Email Engagement
              </h2>
              {loadingEmail ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: TEXT_SECONDARY, fontFamily: FONT, fontSize: "13px" }}>
                  Loading email metrics...
                </div>
              ) : emailEngagement && emailEngagement.totalSent > 0 ? (
                <>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
                    <KpiCard label="Emails Sent" value={emailEngagement.totalSent} sub={`${emailEngagement.totalDelivered} delivered`} accent={TEXT_PRIMARY} />
                    <KpiCard label="Open Rate" value={`${emailEngagement.openRate}%`} sub={`${emailEngagement.totalOpened} opened`} accent="#34D399" />
                    <KpiCard label="Click Rate" value={`${emailEngagement.clickRate}%`} sub={`${emailEngagement.totalClicked} clicked`} accent={GOLD} />
                    <KpiCard label="Bounce Rate" value={`${emailEngagement.bounceRate}%`} sub={`${emailEngagement.totalBounced} bounced`} accent={emailEngagement.bounceRate > 5 ? "#EF4444" : TEXT_SECONDARY} />
                  </div>

                  {/* Email funnel visualization */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "center" }}>
                    {[
                      { label: "Sent", count: emailEngagement.totalSent, color: "#60A5FA" },
                      { label: "Delivered", count: emailEngagement.totalDelivered, color: "#818CF8" },
                      { label: "Opened", count: emailEngagement.totalOpened, color: "#34D399" },
                      { label: "Clicked", count: emailEngagement.totalClicked, color: GOLD },
                    ].map((stage, i, arr) => (
                      <div key={stage.label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <div style={{
                          background: `${stage.color}15`,
                          border: `1px solid ${stage.color}40`,
                          borderRadius: "10px",
                          padding: "14px 20px",
                          textAlign: "center",
                          minWidth: "100px",
                        }}>
                          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "24px", fontWeight: 700, color: stage.color, lineHeight: 1.1 }}>
                            {stage.count}
                          </div>
                          <div style={{ fontFamily: FONT, fontSize: "11px", color: TEXT_SECONDARY, marginTop: "4px" }}>
                            {stage.label}
                          </div>
                        </div>
                        {i < arr.length - 1 && (
                          <span style={{ fontFamily: FONT, fontSize: "18px", color: "rgba(255,255,255,0.15)", padding: "0 4px" }}>→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0", color: TEXT_SECONDARY, fontFamily: FONT, fontSize: "13px" }}>
                  No email tracking data yet. Events will appear here once Resend webhooks are configured.
                </div>
              )}
            </div>

            {/* Recent Email Events + Recent Calls side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
              {/* Recent Email Events */}
              <div style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "12px",
                padding: "24px",
              }}>
                <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: 700, color: TEXT_PRIMARY, margin: "0 0 20px 0" }}>
                  Recent Email Activity
                </h2>
                {loadingEmailEvents ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: TEXT_SECONDARY, fontFamily: FONT, fontSize: "13px" }}>
                    Loading...
                  </div>
                ) : recentEmailEvents && recentEmailEvents.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                    {recentEmailEvents.map((ev: any) => {
                      const eventLabels: Record<string, { icon: string; label: string; color: string }> = {
                        "email.sent": { icon: "✉️", label: "Sent", color: "#60A5FA" },
                        "email.delivered": { icon: "✅", label: "Delivered", color: "#818CF8" },
                        "email.opened": { icon: "👁️", label: "Opened", color: "#34D399" },
                        "email.clicked": { icon: "🔗", label: "Clicked", color: GOLD },
                        "email.bounced": { icon: "⚠️", label: "Bounced", color: "#EF4444" },
                        "email.complained": { icon: "🚩", label: "Complained", color: "#EF4444" },
                        "email.delivery_delayed": { icon: "⏳", label: "Delayed", color: "#FBBF24" },
                      };
                      const info = eventLabels[ev.eventType] ?? { icon: "•", label: ev.eventType, color: TEXT_SECONDARY };
                      return (
                        <div
                          key={ev.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 0",
                            borderBottom: `1px solid ${BORDER}`,
                          }}
                        >
                          <span style={{ fontSize: "14px", width: "22px", textAlign: "center" }}>{info.icon}</span>
                          <span style={{
                            fontFamily: FONT,
                            fontSize: "11px",
                            fontWeight: 600,
                            color: info.color,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: `${info.color}15`,
                            border: `1px solid ${info.color}30`,
                            minWidth: "70px",
                            textAlign: "center",
                          }}>
                            {info.label}
                          </span>
                          <span style={{ fontFamily: FONT, fontSize: "12px", color: TEXT_PRIMARY, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {ev.recipientEmail}
                          </span>
                          {ev.clickedLink && (
                            <span style={{ fontFamily: FONT, fontSize: "10px", color: GOLD_DIM, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={ev.clickedLink}>
                              {ev.clickedLink.replace(/^https?:\/\//, "").split("/").pop() || "link"}
                            </span>
                          )}
                          <span style={{ fontFamily: FONT, fontSize: "10px", color: TEXT_SECONDARY, whiteSpace: "nowrap" }}>
                            {ev.createdAt ? timeAgo(ev.createdAt) : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0", color: TEXT_SECONDARY, fontFamily: FONT, fontSize: "13px" }}>
                    No email events yet.
                  </div>
                )}
              </div>

              {/* Recent Calls Table */}
              <div style={{
                background: BG_CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: "12px",
                padding: "24px",
              }}>
              <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: 700, color: TEXT_PRIMARY, margin: "0 0 20px 0" }}>
                Recent Voice Calls
              </h2>
              {recentCalls && recentCalls.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        {["Caller", "Company", "Track", "Duration", "Status", "When"].map(h => (
                          <th key={h} style={{
                            textAlign: "left",
                            padding: "8px 12px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: TEXT_SECONDARY,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentCalls.map((call) => (
                        <tr
                          key={call.id}
                          style={{ borderBottom: `1px solid ${BORDER}`, cursor: "pointer" }}
                          onClick={() => window.location.href = `/admin/leads`}
                        >
                          <td style={{ padding: "10px 12px", color: TEXT_PRIMARY, fontWeight: 500 }}>
                            {call.name || "Unknown"}
                          </td>
                          <td style={{ padding: "10px 12px", color: TEXT_SECONDARY }}>
                            {call.company || "-"}
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: 600,
                              background: `${TRACK_COLORS[call.callTrack ?? "unknown"] ?? "#6B7280"}20`,
                              color: TRACK_COLORS[call.callTrack ?? "unknown"] ?? "#6B7280",
                              border: `1px solid ${TRACK_COLORS[call.callTrack ?? "unknown"] ?? "#6B7280"}40`,
                            }}>
                              {(call.callTrack ?? "unknown").charAt(0).toUpperCase() + (call.callTrack ?? "unknown").slice(1)}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", color: GOLD, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                            {formatDuration(call.callDurationSeconds ?? 0)}
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: 600,
                              background: `${STATUS_COLORS[call.status] ?? "#6B7280"}20`,
                              color: STATUS_COLORS[call.status] ?? "#6B7280",
                            }}>
                              {call.status.replace("_", " ")}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", color: TEXT_SECONDARY, fontSize: "12px" }}>
                            {timeAgo(call.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0", color: TEXT_SECONDARY, fontFamily: FONT, fontSize: "13px" }}>
                  No voice calls recorded yet. Calls will appear here after AiiA conversations.
                </div>
              )}
            </div>
            </div>{/* close grid */}
          </>
        )}
      </div>
    </div>
  );
}
