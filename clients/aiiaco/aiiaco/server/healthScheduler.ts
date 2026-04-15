/**
 * AiiA Health Check Scheduler
 *
 * Runs the full diagnostic chain health check every 5 minutes.
 * Alerts the owner proactively if any vital goes down.
 * Tracks consecutive failures to avoid alert fatigue.
 */

import { runHealthCheck, type HealthReport, type VitalStatus } from "./healthMonitor";

// ─── State ──────────────────────────────────────────────────────────────────

let intervalId: ReturnType<typeof setInterval> | null = null;
let lastReport: HealthReport | null = null;
let consecutiveDownCount = 0;
let isRunning = false;

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CONSECUTIVE_ALERTS = 3; // Only alert for first 3 consecutive failures, then throttle

// ─── Scheduler ──────────────────────────────────────────────────────────────

async function runScheduledCheck(): Promise<void> {
  if (isRunning) {
    console.log("[HealthScheduler] Previous check still running, skipping...");
    return;
  }

  isRunning = true;
  try {
    const report = await runHealthCheck();
    lastReport = report;

    const statusEmoji = report.overall === "healthy" ? "✅" : report.overall === "degraded" ? "⚠️" : "❌";
    console.log(
      `[HealthScheduler] ${statusEmoji} Score: ${report.score}/100 | ` +
      `${report.vitals.filter(v => v.status === "healthy").length}/7 healthy | ` +
      `Alerts sent: ${report.alertsSent}`
    );
    // Log non-healthy vitals for debugging
    for (const v of report.vitals) {
      if (v.status !== "healthy") {
        console.log(`[HealthScheduler]   ⚠ ${v.name}: ${v.status} — ${v.details}`);
      }
    }

    if (report.overall === "down") {
      consecutiveDownCount++;
      if (consecutiveDownCount > MAX_CONSECUTIVE_ALERTS) {
        console.log(
          `[HealthScheduler] Throttling alerts (${consecutiveDownCount} consecutive failures). ` +
          `Will resume alerting after recovery.`
        );
      }
    } else {
      if (consecutiveDownCount > MAX_CONSECUTIVE_ALERTS) {
        console.log(`[HealthScheduler] Recovered after ${consecutiveDownCount} consecutive failures.`);
      }
      consecutiveDownCount = 0;
    }
  } catch (err) {
    console.error("[HealthScheduler] Unexpected error during health check:", err);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the periodic health check scheduler.
 * Runs an initial check after a 30-second delay (to let the server fully boot),
 * then every 5 minutes thereafter.
 */
export function startHealthScheduler(): void {
  if (intervalId) {
    console.log("[HealthScheduler] Already running, skipping duplicate start.");
    return;
  }

  console.log("[HealthScheduler] Starting periodic health checks (every 5 min)...");

  // Initial check after 30s delay (let server boot)
  setTimeout(() => {
    runScheduledCheck();
  }, 30_000);

  // Then every 5 minutes
  intervalId = setInterval(runScheduledCheck, INTERVAL_MS);
}

/**
 * Stop the periodic health check scheduler.
 */
export function stopHealthScheduler(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("[HealthScheduler] Stopped.");
  }
}

/**
 * Get the last health report from the scheduler (if any).
 */
export function getLastScheduledReport(): HealthReport | null {
  return lastReport;
}

/**
 * Get scheduler status info.
 */
export function getSchedulerStatus(): {
  running: boolean;
  intervalMs: number;
  consecutiveDownCount: number;
  lastCheckAt: string | null;
  lastScore: number | null;
  lastOverall: VitalStatus | null;
} {
  return {
    running: !!intervalId,
    intervalMs: INTERVAL_MS,
    consecutiveDownCount,
    lastCheckAt: lastReport?.checkedAt ?? null,
    lastScore: lastReport?.score ?? null,
    lastOverall: lastReport?.overall ?? null,
  };
}
