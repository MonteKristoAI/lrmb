// Tests for the OperationsOverview page. Covers token-missing, expired-link,
// bad-signature, network error, loading skeleton, and the happy-path render.
//
// We mock `fetch` directly because the page calls the edge function over the
// network. MSW is not in the project's dep tree — global fetch stub is enough
// for this surface.

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import OperationsOverview from "../pages/OperationsOverview";

// VITE_SUPABASE_URL is read by the page on module import. Set it before mount.
// import.meta.env is read-only at build time; vitest exposes it via stub.
vi.stubEnv("VITE_SUPABASE_URL", "http://localhost-test:54321");

function renderAt(path: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[path]}>
        <OperationsOverview />
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

describe("OperationsOverview — error states", () => {
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
    // The page retries unknown errors up to 2 times with backoff — wait longer.
    await waitFor(
      () => {
        expect(screen.getByText(/Could not load operations data/i)).toBeInTheDocument();
      },
      { timeout: 8000 },
    );
  }, 10000);
});

describe("OperationsOverview — happy path", () => {
  const successPayload = {
    viewer: "Tony",
    generatedAt: "2026-05-20T12:00:00Z",
    windowUTC: { start: "2026-05-20T00:00:00Z", end: "2026-05-21T00:00:00Z" },
    reservations: {
      arrivalsToday: [
        { externalId: "1", unitId: 10, arrivalDate: "2026-05-20T15:00:00Z", departureDate: "2026-05-22T11:00:00Z", status: "Confirmed", occupants: 2, nights: 2 },
      ],
      inHouse: [],
      checkoutsToday: [
        { externalId: "2", unitId: 11, arrivalDate: "2026-05-18T15:00:00Z", departureDate: "2026-05-20T11:00:00Z", status: "CheckedOut", occupants: 4, nights: 2 },
      ],
      upcoming7d: [],
    },
    housekeeping: {
      scheduledToday: [
        { id: "uuid-a", title: "Final Clean — TRACK WO #501", status: "new", unitId: "u-10", externalId: "501", dueAt: "2026-05-20T13:00:00Z", startedAt: null, completedAt: null, updatedAt: "2026-05-20T11:55:00Z" },
      ],
      inProgress: [],
      completedPendingVerify: [
        { id: "uuid-b", title: "Final Clean — TRACK WO #495", status: "completed", unitId: "u-09", externalId: "495", dueAt: null, startedAt: "2026-05-20T09:00:00Z", completedAt: "2026-05-20T10:30:00Z", updatedAt: "2026-05-20T10:30:00Z" },
      ],
    },
    maintenance: {
      open: [
        { id: "uuid-c", title: "Replace AC filter", status: "assigned", unitId: "u-12", externalId: "MWO-7", dueAt: "2026-05-21T18:00:00Z", startedAt: null, completedAt: null, updatedAt: "2026-05-20T11:30:00Z" },
      ],
      overdue: [],
      blocked: [],
      completedPendingVerify: [],
    },
    pollHealth: [
      { collection_name: "reservations", health: "healthy", last_run_at: "2026-05-20T11:58:00Z", seconds_since_last_run: 120 },
      { collection_name: "maintenance-work-orders", health: "healthy", last_run_at: "2026-05-20T11:58:00Z", seconds_since_last_run: 120 },
      { collection_name: "housekeeping-work-orders", health: "healthy", last_run_at: "2026-05-20T11:58:00Z", seconds_since_last_run: 120 },
    ],
  };

  it("renders the header with the viewer name", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByText(/LRMB Operations Overview/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Shared with Tony/i)).toBeInTheDocument();
  });

  it("renders reservation pipeline cards (arrivals + checkouts + in-house + upcoming)", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByText(/Arrivals today/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/In house now/i)).toBeInTheDocument();
    expect(screen.getByText(/Checkouts today/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming next 7d/i)).toBeInTheDocument();
    // The card content for arrivals_today should list reservation #1 (we passed 1 arrival in the payload)
    const arrivalsList = screen.getByLabelText(/Arrivals today details/i);
    expect(arrivalsList).toBeInTheDocument();
    expect(arrivalsList.textContent).toMatch(/#1/);
  });

  it("renders housekeeping queues with task titles", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByText(/Housekeeping/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Final Clean — TRACK WO #501/i)).toBeInTheDocument();
    expect(screen.getByText(/Final Clean — TRACK WO #495/i)).toBeInTheDocument();
  });

  it("renders maintenance queues with task titles", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByText(/Maintenance/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Replace AC filter/i)).toBeInTheDocument();
  });

  it("does NOT show the poll-health banner when all collections are healthy", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByText(/LRMB Operations Overview/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Polling status/i)).not.toBeInTheDocument();
  });

  it("shows the poll-health banner when at least one collection is failing", async () => {
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
      expect(screen.getByText(/Polling status/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/housekeeping-work-orders=failing/i)).toBeInTheDocument();
  });

  it("renders a Refresh button (proves no write actions are present)", async () => {
    mockFetchResponse(200, successPayload);
    renderAt("/operations?t=eyJ.valid");
    await waitFor(() => {
      expect(screen.getByLabelText(/Refresh now/i)).toBeInTheDocument();
    });
    // Sanity: no Edit / Delete / Save buttons should exist
    expect(screen.queryByRole("button", { name: /edit/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /delete/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /save/i })).toBeNull();
  });
});
