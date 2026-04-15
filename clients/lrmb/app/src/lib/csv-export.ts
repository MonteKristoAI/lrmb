export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          if (val === null || val === undefined) return "";
          const str = String(val).replace(/"/g, '""');
          return str.includes(",") || str.includes('"') || str.includes("\n")
            ? `"${str}"`
            : str;
        })
        .join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function tasksToCSV(
  tasks: Array<{
    title: string;
    status: string;
    priority: string;
    task_category: string;
    task_type?: string | null;
    created_at: string;
    due_at?: string | null;
    completed_at?: string | null;
    properties?: { name: string } | null;
    units?: { short_name?: string | null; unit_code: string } | null;
    assigned_vendor_name?: string | null;
    guest_name?: string | null;
  }>
) {
  return tasks.map((t) => ({
    Title: t.title,
    Status: t.status,
    Priority: t.priority,
    Category: t.task_category,
    Type: t.task_type || "",
    Building: t.properties?.name || "",
    Residence: t.units?.short_name || t.units?.unit_code || "",
    Vendor: t.assigned_vendor_name || "",
    Guest: t.guest_name || "",
    Created: t.created_at,
    Due: t.due_at || "",
    Completed: t.completed_at || "",
  }));
}
