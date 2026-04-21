import { describe, expect, it } from "vitest";
import { tasksToCSV } from "@/lib/csv-export";

describe("tasksToCSV", () => {
  it("maps task rows to export-friendly columns", () => {
    const rows = tasksToCSV([
      {
        title: "Checkout clean - Unit 101",
        status: "assigned",
        priority: "high",
        task_category: "housekeeping",
        task_type: "checkout_turnover",
        created_at: "2026-04-21T10:00:00.000Z",
        due_at: "2026-04-21T14:00:00.000Z",
        completed_at: null,
        properties: { name: "Oceanview Resort" },
        units: { short_name: "Unit 101", unit_code: "101" },
        assigned_vendor_name: "Fast Clean Co",
        guest_name: "John Doe",
      },
    ]);

    expect(rows).toEqual([
      {
        Title: "Checkout clean - Unit 101",
        Status: "assigned",
        Priority: "high",
        Category: "housekeeping",
        Type: "checkout_turnover",
        Building: "Oceanview Resort",
        Residence: "Unit 101",
        Vendor: "Fast Clean Co",
        Guest: "John Doe",
        Created: "2026-04-21T10:00:00.000Z",
        Due: "2026-04-21T14:00:00.000Z",
        Completed: "",
      },
    ]);
  });

  it("falls back to safe defaults for optional fields", () => {
    const rows = tasksToCSV([
      {
        title: "Inspect unit",
        status: "new",
        priority: "medium",
        task_category: "inspection",
        created_at: "2026-04-21T12:00:00.000Z",
      },
    ]);

    expect(rows[0].Residence).toBe("");
    expect(rows[0].Vendor).toBe("");
    expect(rows[0].Guest).toBe("");
    expect(rows[0].Due).toBe("");
    expect(rows[0].Completed).toBe("");
  });
});
