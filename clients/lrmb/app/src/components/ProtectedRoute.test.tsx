import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type AuthMockState = {
  session: object | null;
  loading: boolean;
  hasRole: (role: "field_staff" | "admin" | "supervisor" | "manager") => boolean;
  hasAdminAccess: () => boolean;
};

const authState: AuthMockState = {
  session: null,
  loading: false,
  hasRole: () => false,
  hasAdminAccess: () => false,
};

vi.mock("@/lib/auth", () => ({
  useAuth: () => authState,
}));

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to login", () => {
    authState.session = null;
    authState.loading = false;

    render(
      <MemoryRouter initialEntries={["/admin"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdminAccess>
                <div>Admin content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("blocks staff users from admin route", () => {
    authState.session = { user: { id: "staff-id" } };
    authState.loading = false;
    authState.hasRole = (role) => role === "field_staff";
    authState.hasAdminAccess = () => false;

    render(
      <MemoryRouter initialEntries={["/admin"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdminAccess>
                <div>Admin content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/tasks" element={<div>Tasks page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Tasks page")).toBeInTheDocument();
  });
});
