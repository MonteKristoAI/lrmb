// Tests for the OperationsOverview page. Covers token-missing, expired-link,
// bad-signature, network error, loading skeleton, and the happy-path render.
//
// We mock `fetch` directly because the page calls the edge function over the
// network. MSW is not in the project's dep tree - global fetch stub is enough
// for this surface.

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import OperationsOverview from "../pages/OperationsOverview";
import { I18nProvider } from "../lib/i18n";

// VITE_SUPABASE_URL is read by the page on module import. Set it before mount.
vi.stubEnv("VITE_SUPABASE_URL", "http://localhost-test:54321");

function renderAt(path: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]}>
        <I18nProvider>
          <OperationsOverview />
        </I18nProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function mockFetchResponse(status: number, body: unknown) {
  const fetchMock = vi.fn(async () => {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.useRealTimers();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("OperationsOverview - loading state", () => {
  it("renders the structured skeleton while the fetch is pending", async () => {
    // Mock a fetch that never resolves so the loading state stays mounted
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    renderAt("/operations?t=eyJ.valid");
    // aria-live announcement for screen readers
    await waitFor(() => {
      expect(screen.getByText(/Loading operations data/i)).toBeInTheDocument();
    });
    // 4 KPI skeleton cards are mounted (one per metric tile)
    const skeletons = document.querySelectorAll('[data-slot="skeleton"], .animate-pulse');
    expect(skeletons.length).toBeGreaterThan(8);
  });
});

describe("OperationsOverview - error states", () => {
  it("renders the missing-token error when no ?t= is present", () => {
    renderAt("/operations");
    expect(screen.getByText(/Missing share link token/i)).toBeInTheDocument();
  });

  it("renders the expired-link error when the API returns code=expired", async () => {
    mockFetchResponse(401, { error: "expired", message: "Token expired" });
    renderAt("/operations?t=eyJ.fake");
    await waitFor(() => {
      expect(screen.getByText(/Share link has expired/i)).toBeInTheDocument();
    });
  });

  it("renders the invalid-link error when the API returns code=bad_signature", async () => {
    mockFetchResponse(401, { error: "bad_signature", message: "Signature mismatch" });
    renderAt("/operations?t=eyJ.tampered");
    await waitFor(() => {
      expect(screen.getByText(/Invalid share link/i)).toBeInTheDocument();
    });
  });

  it("renders the invalid-link error when the API returns code=bad_format", async () => {
    mockFetchResponse(401, { error: "bad_format", message: "Token must be <payload>.<sig>" });
    renderAt("/operations?t=notatoken");
    await waitFor(() => {
      expect(screen.getByText(/Invalid share link/i)).toBeInTheDocument();
    });
  });

  it("falls back to a generic error message on an unknown HTTP failure", async () => {
    mockFetchResponse(500, { error: "internal", message: "Boom" });
    renderAt("/operations?t=eyJ.fake");
    // The page retries unknown errors up to 2 times with backoff - wait longer.
    await waitFor(
      () => {
        expect(screen.getByText(/Could not load operations data/i)).toBeInTheDocument();
      },
      { timeout: 8000 },
    );
  }, 10000);
});

describe("OperationsOverview - happy path", () => {
  // Full payload matching the current track-overview-data edge function shape
  // (v15+ - includes totals, kpis, propertyList, recentPhotos, damageClaims,
  // and per-panel *Total counts).
  const successPayload = {
    viewer: "Tony",
    generatedAt: "2026-05-20T12:00:00Z",
    windowUTC: { start: "2026-05-20T00:00:00Z", end: "2026-05-21T00:00:00Z" },
    miamiToday: "2026-05-20",
    totals: {
      trackMirroredTasks: 30000,
      activeUnits: 103,
      activeProperties: 17,
    },
    kpis: {
      hkCompleted: { thisWeek: 122, lastWeek: 94 },
      maintCompleted: { thisWeek: 30, lastWeek: 11 },
      hkInProgress: 12,
      maintInProgress: 2,
      maintOverdue: 0,
      kpiRefreshedAt: "2026-05-20T11:59:00Z",
    },
    propertyList: ["1 Hotel & Homes", "Setai", "W South Beach"],
    reservations: {
      arrivalsToday: [
        { externalId: "1", unitId: 10, unitCode: "1HH 1544", propertyName: "1 Hotel & Homes", arrivalDate: "2026-05-20", departureDate: "2026-05-22", status: "Confirmed", occupants: 2, nights: 2 },
      ],
      arrivalsTodayTotal: 1,
      inHouse: [],
      inHouseTotal: 0,
      checkoutsToday: [
        { externalId: "2", unitId: 11, unitCode: "Setai 705", propertyName: "Setai", arrivalDate: "2026-05-18", departureDate: "2026-05-20", status: "CheckedOut", occupants: 4, nights: 2 },
      ],
      checkoutsTodayTotal: 1,
      upcoming7d: [],
      upcoming7dTotal: 0,
    },
    housekeeping: {
      scheduledToday: [
        { id: "uuid-a", title: "Final Clean - TRACK WO #501", status: "new", category: "housekeeping", priority: "medium", housekeepingType: "checkout_clean", unitId: "u-10", unitCode: "1HH 1544", propertyName: "1 Hotel & Homes", externalId: "501", reservationId: null, dueAt: "2026-05-20T13:00:00Z", startedAt: null, completedAt: null, scheduledFor: "2026-05-20T13:00:00Z", blockedReason: null, updatedAt: "2026-05-20T11:55:00Z" },
      ],
      scheduledTodayTotal: 1,
      inProgress: [],
      inProgressTotal: 0,
      completedPendingVerify: [
        { id: "uuid-b", title: "Final Clean - TRACK WO #495", status: "completed", category: "housekeeping", priority: "medium", housekeepingType: "checkout_clean", unitId: "u-09", unitCode: "Setai 705", propertyName: "Setai", externalId: "495", reservationId: null, dueAt: null, startedAt: "2026-05-20T09:00:00Z", completedAt: "2026-05-20T10:30:00Z", scheduledFor: null, blockedReason: null, updatedAt: "2026-05-20T10:30:00Z" },
      ],
      completedPendingVerifyTotal: 1,
    },
    maintenance: {
      open: [
        { id: "uuid-c", title: "Replace AC filter", status: "assigned", category: "maintenance", priority: "medium", housekeepingType: null, unitId: "u-12", unitCode: "W South Beach 3B1229", propertyName: "W South Beach", externalId: "MWO-7", reservationId: null, dueAt: "2026-05-21T18:00:00Z", startedAt: null, completedAt: null, scheduledFor: null, blockedReason: null, updatedAt: "2026-05-20T11:30:00Z" },
      ],
      openTotal: 1,
      overdue: [],
      overdueTotal: 0,
      blocked: [],
      blockedTotal: 0,
      completedPendingVerify: [],
      completedPendingVerifyTotal: 0,
    },
    pollHealth: [
      { collection_name: "reservations", health: "healthy", last_run_at: "2026-05-20T11:58:00Z", seconds_since_last_run: 120 },
      { collection_name: "maintenance-work-orders", health: "healthy", last_run_at: "2026-05-20T11:58:00Z", seconds_since_last_run: 120 },
      { collection_name: "housekeeping-work-orders", health: "healthy", last_run_at: "2026-05-20T11:58:00Z", seconds_since_last_run: 120 },
    ],
    recentActivity: [],
    recentPhotos: [],
    damageClaims: { total: 0, overdue: 0, urgent: 0, approaching: 0, items: [] },
  };

  it("renders the header with the viewer name", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByText(/LRMB Operations/i)).toBeInTheDocument();
    });
    // Viewer name appears in the subtitle: "Live view · Tony · 103 units …"
    expect(screen.getByText(/Tony/)).toBeInTheDocument();
  });

  it("renders reservation pipeline cards (arrivals + checkouts + in-house + upcoming)", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByText(/Arrivals today/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/In house now/i)).toBeInTheDocument();
    expect(screen.getByText(/Checkouts today/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming 7 days/i)).toBeInTheDocument();
    // The Arrivals today list should contain the mock unit code "1HH 1544"
    const arrivalsList = screen.getByLabelText(/^Arrivals today$/i);
    expect(arrivalsList).toBeInTheDocument();
    expect(arrivalsList.textContent).toMatch(/1HH 1544/);
  });

  it("renders housekeeping queue panels when the Housekeeping tab is selected", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid&tab=housekeeping");
    // displayTitle() rewrites raw TRACK titles to the type label ("Checkout clean").
    // We assert the panel headings + the mapped type label + the unit code instead.
    await waitFor(() => {
      // "Scheduled today" panel exists (matches the panel label, not the section heading)
      expect(screen.getByLabelText(/^Scheduled today$/i)).toBeInTheDocument();
    });
    // At least one task card renders the friendly type label
    const cards = screen.getAllByText(/Checkout clean/i);
    expect(cards.length).toBeGreaterThan(0);
    // Unit codes from the mock are rendered
    expect(screen.getByText(/1HH 1544/i)).toBeInTheDocument();
  });

  it("renders maintenance queue task titles when the Maintenance tab is selected", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid&tab=maintenance");
    // Maintenance titles >30 chars or without "TRACK" go through unchanged.
    await waitFor(() => {
      expect(screen.getByText(/Replace AC filter/i)).toBeInTheDocument();
    });
  });

  it("does NOT show the data-sync notice banner when all collections are healthy", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByText(/LRMB Operations/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Data sync notice/i)).not.toBeInTheDocument();
  });

  it("shows the data-sync notice banner when at least one collection is failing", async () => {
    const payload = {
      ...successPayload,
      pollHealth: [
        ...successPayload.pollHealth.slice(0, 2),
        { ...successPayload.pollHealth[2], health: "failing" },
      ],
    };
    mockFetchResponse(200, payload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByText(/Data sync notice/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/housekeeping-work-orders/i)).toBeInTheDocument();
  });

  it("renders a Refresh button (proves no write actions are present)", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByLabelText(/Refresh now/i)).toBeInTheDocument();
    });
    // Sanity: no Edit / Delete / Save buttons should exist
    expect(screen.queryByRole("button", { name: /^edit$/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /^delete$/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /^save$/i })).toBeNull();
  });
});
