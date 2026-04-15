import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  try {
    // 1. Create test users via auth
    const users = [
      { email: "admin@lrmb.test", password: "Test1234!", full_name: "Mike Admin", role: "admin" as const },
      { email: "supervisor@lrmb.test", password: "Test1234!", full_name: "Sarah Supervisor", role: "supervisor" as const },
      { email: "staff1@lrmb.test", password: "Test1234!", full_name: "Carlos Field", role: "field_staff" as const },
      { email: "staff2@lrmb.test", password: "Test1234!", full_name: "Diana Cleaner", role: "field_staff" as const },
      { email: "staff3@lrmb.test", password: "Test1234!", full_name: "Eddie Maintenance", role: "field_staff" as const },
      { email: "manager@lrmb.test", password: "Test1234!", full_name: "Frank Manager", role: "manager" as const },
    ];

    const userIds: Record<string, string> = {};

    for (const u of users) {
      // Check if user already exists
      const { data: existing } = await sb.auth.admin.listUsers();
      const found = existing?.users?.find((eu) => eu.email === u.email);
      if (found) {
        userIds[u.email] = found.id;
      } else {
        const { data, error } = await sb.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
          user_metadata: { full_name: u.full_name },
        });
        if (error) throw new Error(`User ${u.email}: ${error.message}`);
        userIds[u.email] = data.user.id;
      }
    }

    // 2. Assign roles (upsert-like)
    for (const u of users) {
      const uid = userIds[u.email];
      const { error } = await sb.from("user_roles").upsert({ user_id: uid, role: u.role }, { onConflict: "user_id,role" });
      if (error) console.error(`Role ${u.role} for ${u.email}:`, error.message);
    }

    // 3. Properties
    const propertyNames = [
      { name: "Oceanview Resort", address: "100 Beach Blvd, Malibu, CA", region: "West" },
      { name: "Mountain Lodge", address: "250 Alpine Rd, Aspen, CO", region: "Central" },
      { name: "Downtown Suites", address: "50 Main St, Austin, TX", region: "Central" },
      { name: "Lakeside Cabins", address: "12 Lake Dr, Lake Tahoe, CA", region: "West" },
      { name: "Urban Loft Hotel", address: "800 Broadway, NYC, NY", region: "East" },
      { name: "Garden Villas", address: "45 Vine Ln, Napa, CA", region: "West" },
      { name: "Harbor Inn", address: "33 Dock St, Portland, ME", region: "East" },
      { name: "Desert Oasis", address: "99 Cactus Way, Scottsdale, AZ", region: "West" },
      { name: "Riverside Retreat", address: "77 River Rd, Savannah, GA", region: "East" },
      { name: "Skyline Towers", address: "1200 High St, Chicago, IL", region: "Central" },
      { name: "Pine Forest Lodge", address: "5 Timber Trail, Park City, UT", region: "West" },
      { name: "Coral Bay Resort", address: "200 Coral Ln, Key West, FL", region: "East" },
      { name: "Valley View Inn", address: "88 Valley Blvd, Sedona, AZ", region: "West" },
      { name: "Summit Hotel", address: "1 Peak Ave, Denver, CO", region: "Central" },
      { name: "Seaside Cottages", address: "15 Shore Dr, Charleston, SC", region: "East" },
    ];

    // Check if properties already exist
    const { data: existingProps } = await sb.from("properties").select("id, name");
    const propMap: Record<string, string> = {};
    if (existingProps && existingProps.length > 0) {
      existingProps.forEach((p: any) => (propMap[p.name] = p.id));
    }
    const newProps = propertyNames.filter((p) => !propMap[p.name]);
    if (newProps.length > 0) {
      const { data: props, error: propErr } = await sb.from("properties").insert(newProps).select("id, name");
      if (propErr) throw new Error(`Properties: ${propErr.message}`);
      props!.forEach((p: any) => (propMap[p.name] = p.id));
    }

    // 4. Units (2-3 per property)
    const unitRows: { property_id: string; unit_code: string }[] = [];
    Object.entries(propMap).forEach(([name, pid]) => {
      unitRows.push({ property_id: pid, unit_code: "101" });
      unitRows.push({ property_id: pid, unit_code: "102" });
      if (name.includes("Resort") || name.includes("Lodge") || name.includes("Hotel")) {
        unitRows.push({ property_id: pid, unit_code: "201" });
      }
    });

    const { error: unitErr } = await sb.from("units").insert(unitRows);
    if (unitErr) console.error("Units:", unitErr.message);
    
    // Re-fetch units
    const { data: allUnits } = await sb.from("units").select("id, property_id, unit_code");
    const unitMap: Record<string, string[]> = {};
    allUnits?.forEach((u: any) => {
      if (!unitMap[u.property_id]) unitMap[u.property_id] = [];
      unitMap[u.property_id].push(u.id);
    });

    // 5. Staff assignments
    const staffIds = [userIds["staff1@lrmb.test"], userIds["staff2@lrmb.test"], userIds["staff3@lrmb.test"]];
    const propIds = Object.values(propMap);
    const assignments = staffIds.flatMap((sid, i) => {
      const assigned = propIds.slice(i * 5, (i + 1) * 5);
      return assigned.map((pid) => ({ profile_id: sid, property_id: pid, assignment_type: "general" }));
    });
    await sb.from("staff_assignments").insert(assignments);

    // 6. Tasks (~40)
    const now = new Date();
    const h = (hrs: number) => new Date(now.getTime() + hrs * 3600000).toISOString();
    const ago = (hrs: number) => new Date(now.getTime() - hrs * 3600000).toISOString();

    const taskData = [
      { title: "Fix leaky faucet in 101", property_id: propIds[0], unit_id: unitMap[propIds[0]]?.[0], task_category: "maintenance", priority: "high", status: "new", due_at: h(24), created_at: ago(4) },
      { title: "Replace AC filter", property_id: propIds[0], unit_id: unitMap[propIds[0]]?.[1], task_category: "maintenance", priority: "medium", status: "assigned", assigned_to: staffIds[0], due_at: h(48), created_at: ago(8) },
      { title: "Deep clean lobby", property_id: propIds[1], task_category: "housekeeping", priority: "medium", status: "in_progress", assigned_to: staffIds[0], started_at: ago(2), due_at: h(6), created_at: ago(24) },
      { title: "Repaint hallway wall", property_id: propIds[1], unit_id: unitMap[propIds[1]]?.[0], task_category: "maintenance", priority: "low", status: "waiting_parts", assigned_to: staffIds[0], due_at: h(72), created_at: ago(48) },
      { title: "Fix broken window latch", property_id: propIds[2], unit_id: unitMap[propIds[2]]?.[0], task_category: "maintenance", priority: "urgent", status: "blocked", assigned_to: staffIds[1], blocked_reason: "Waiting for vendor approval", due_at: ago(4), created_at: ago(72) },
      { title: "Clean pool area", property_id: propIds[3], task_category: "housekeeping", priority: "high", status: "in_progress", assigned_to: staffIds[1], started_at: ago(1), due_at: h(3), created_at: ago(12) },
      { title: "Replace smoke detector batteries", property_id: propIds[4], unit_id: unitMap[propIds[4]]?.[0], task_category: "maintenance", priority: "urgent", status: "new", due_at: h(4), created_at: ago(2) },
      { title: "Restock minibar", property_id: propIds[4], unit_id: unitMap[propIds[4]]?.[1], task_category: "housekeeping", priority: "low", status: "assigned", assigned_to: staffIds[2], due_at: h(12), created_at: ago(6) },
      { title: "Bathroom deep clean", property_id: propIds[5], unit_id: unitMap[propIds[5]]?.[0], task_category: "housekeeping", priority: "medium", status: "completed", assigned_to: staffIds[1], completed_at: ago(1), requires_photo: true, created_at: ago(26) },
      { title: "Fix elevator button", property_id: propIds[5], task_category: "maintenance", priority: "high", status: "completed", assigned_to: staffIds[2], completed_at: ago(3), started_at: ago(8), created_at: ago(30) },
      { title: "Check fire extinguishers", property_id: propIds[6], task_category: "inspection", priority: "medium", status: "verified", assigned_to: staffIds[0], completed_at: ago(24), verified_at: ago(12), created_at: ago(72) },
      { title: "Outdoor furniture repair", property_id: propIds[6], task_category: "maintenance", priority: "low", status: "new", due_at: h(96), created_at: ago(12) },
      { title: "Carpet shampooing", property_id: propIds[7], unit_id: unitMap[propIds[7]]?.[0], task_category: "housekeeping", priority: "medium", status: "assigned", assigned_to: staffIds[2], due_at: h(24), created_at: ago(10) },
      { title: "HVAC maintenance", property_id: propIds[7], task_category: "maintenance", priority: "high", status: "in_progress", assigned_to: staffIds[2], started_at: ago(4), due_at: h(8), created_at: ago(24) },
      { title: "Pest control treatment", property_id: propIds[8], task_category: "maintenance", priority: "urgent", status: "blocked", assigned_to: staffIds[0], blocked_reason: "Pest control company rescheduled", due_at: ago(12), created_at: ago(48) },
      { title: "Linen replacement", property_id: propIds[8], unit_id: unitMap[propIds[8]]?.[0], task_category: "housekeeping", priority: "medium", status: "completed", assigned_to: staffIds[1], completed_at: ago(6), created_at: ago(30) },
      { title: "Parking lot repaint lines", property_id: propIds[9], task_category: "general", priority: "low", status: "new", due_at: h(168), created_at: ago(24) },
      { title: "Update guest WiFi password", property_id: propIds[9], task_category: "general", priority: "medium", status: "verified", assigned_to: staffIds[2], completed_at: ago(48), verified_at: ago(24), created_at: ago(120) },
      { title: "Repair shower head", property_id: propIds[10], unit_id: unitMap[propIds[10]]?.[0], task_category: "maintenance", priority: "medium", status: "assigned", assigned_to: staffIds[0], due_at: h(36), created_at: ago(12) },
      { title: "Window washing exterior", property_id: propIds[10], task_category: "housekeeping", priority: "low", status: "new", due_at: h(120), created_at: ago(6) },
      { title: "Light fixture replacement", property_id: propIds[11], unit_id: unitMap[propIds[11]]?.[0], task_category: "maintenance", priority: "high", status: "in_progress", assigned_to: staffIds[1], started_at: ago(3), due_at: h(6), requires_photo: true, created_at: ago(24) },
      { title: "Turnover clean unit 102", property_id: propIds[11], unit_id: unitMap[propIds[11]]?.[1], task_category: "housekeeping", priority: "urgent", status: "assigned", assigned_to: staffIds[1], due_at: h(2), requires_photo: true, requires_note: true, created_at: ago(6) },
      { title: "Fix door lock", property_id: propIds[12], unit_id: unitMap[propIds[12]]?.[0], task_category: "maintenance", priority: "urgent", status: "new", due_at: h(6), created_at: ago(3) },
      { title: "Dryer vent cleaning", property_id: propIds[12], task_category: "maintenance", priority: "medium", status: "waiting_parts", assigned_to: staffIds[2], due_at: h(48), created_at: ago(36) },
      { title: "Roof inspection followup", property_id: propIds[13], task_category: "inspection", priority: "high", status: "assigned", assigned_to: staffIds[0], due_at: h(24), created_at: ago(48) },
      { title: "Landscaping trim", property_id: propIds[13], task_category: "general", priority: "low", status: "completed", assigned_to: staffIds[2], completed_at: ago(12), created_at: ago(72) },
      { title: "Plumbing emergency", property_id: propIds[14], unit_id: unitMap[propIds[14]]?.[0], task_category: "maintenance", priority: "urgent", status: "in_progress", assigned_to: staffIds[0], started_at: ago(1), due_at: h(2), created_at: ago(3) },
      { title: "Welcome basket prep", property_id: propIds[14], task_category: "housekeeping", priority: "medium", status: "assigned", assigned_to: staffIds[1], due_at: h(18), created_at: ago(12) },
      // Overdue tasks
      { title: "Fix garbage disposal", property_id: propIds[0], unit_id: unitMap[propIds[0]]?.[0], task_category: "maintenance", priority: "high", status: "assigned", assigned_to: staffIds[0], due_at: ago(24), created_at: ago(72) },
      { title: "Pressure wash deck", property_id: propIds[3], task_category: "maintenance", priority: "medium", status: "in_progress", assigned_to: staffIds[1], started_at: ago(48), due_at: ago(12), created_at: ago(96) },
      // More completed/verified
      { title: "Replace door hinges", property_id: propIds[2], unit_id: unitMap[propIds[2]]?.[0], task_category: "maintenance", priority: "low", status: "verified", assigned_to: staffIds[2], completed_at: ago(72), verified_at: ago(48), created_at: ago(168) },
      { title: "Laundry room reset", property_id: propIds[4], task_category: "housekeeping", priority: "medium", status: "completed", assigned_to: staffIds[0], completed_at: ago(5), started_at: ago(8), created_at: ago(30) },
      { title: "Emergency exit signs check", property_id: propIds[9], task_category: "inspection", priority: "high", status: "verified", assigned_to: staffIds[1], completed_at: ago(36), verified_at: ago(24), created_at: ago(96) },
      { title: "Tighten stair railing", property_id: propIds[6], task_category: "maintenance", priority: "medium", status: "completed", assigned_to: staffIds[2], completed_at: ago(10), created_at: ago(36) },
      // Reopened task
      { title: "Hot water heater repair", property_id: propIds[1], task_category: "maintenance", priority: "high", status: "in_progress", assigned_to: staffIds[0], started_at: ago(2), due_at: h(12), reopened_count: 1, created_at: ago(96) },
    ].map((t) => ({ requires_photo: false, requires_note: false, requires_timestamp: true, reopened_count: 0, ...t, created_by: userIds["admin@lrmb.test"], source_type: "manual" as const }));

    const { error: taskErr } = await sb.from("tasks").insert(taskData as any);
    if (taskErr) throw new Error(`Tasks: ${taskErr.message}`);

    // 7. Inspection templates
    const { data: templates } = await sb.from("inspection_templates").insert([
      { name: "Standard Unit Turnover", version: 1 },
      { name: "Monthly Safety Check", version: 1 },
    ]).select("id, name");

    const templateMap: Record<string, string> = {};
    if (templates) templates.forEach((t: any) => (templateMap[t.name] = t.id));

    // Re-fetch if upsert returned empty
    if (!templates?.length) {
      const { data: existing } = await sb.from("inspection_templates").select("id, name");
      existing?.forEach((t: any) => (templateMap[t.name] = t.id));
    }

    const turnoverItems = [
      { section_name: "Kitchen", label: "Counters clean and sanitized", required: true },
      { section_name: "Kitchen", label: "Appliances wiped and functional", required: true },
      { section_name: "Kitchen", label: "Dishwasher empty and clean", required: false },
      { section_name: "Kitchen", label: "Cabinets organized", required: false },
      { section_name: "Bathroom", label: "Toilet cleaned and sanitized", required: true },
      { section_name: "Bathroom", label: "Shower/tub clean no mold", required: true },
      { section_name: "Bathroom", label: "Fresh towels placed", required: true },
      { section_name: "Bathroom", label: "Mirror clean", required: false },
      { section_name: "Living Area", label: "Floors vacuumed/mopped", required: true },
      { section_name: "Living Area", label: "Furniture dusted", required: true },
      { section_name: "Living Area", label: "Windows clean", required: false },
      { section_name: "Bedroom", label: "Bed made with fresh linens", required: true },
      { section_name: "Bedroom", label: "Closet empty and clean", required: true },
      { section_name: "Bedroom", label: "Nightstand clean", required: false },
    ];

    const safetyItems = [
      { section_name: "Fire Safety", label: "Smoke detectors tested", required: true },
      { section_name: "Fire Safety", label: "Fire extinguisher present and charged", required: true },
      { section_name: "Fire Safety", label: "Exit signs illuminated", required: true },
      { section_name: "Fire Safety", label: "Sprinkler heads unobstructed", required: false },
      { section_name: "Electrical", label: "No exposed wiring", required: true },
      { section_name: "Electrical", label: "GFCI outlets functional", required: true },
      { section_name: "Electrical", label: "Light switches working", required: false },
      { section_name: "General Safety", label: "Handrails secure", required: true },
      { section_name: "General Safety", label: "Emergency info posted", required: true },
      { section_name: "General Safety", label: "First aid kit stocked", required: false },
      { section_name: "General Safety", label: "No trip hazards", required: true },
    ];

    if (templateMap["Standard Unit Turnover"]) {
      const items = turnoverItems.map((it, i) => ({ ...it, template_id: templateMap["Standard Unit Turnover"], sort_order: i }));
      await sb.from("inspection_template_items").insert(items as any);
    }
    if (templateMap["Monthly Safety Check"]) {
      const items = safetyItems.map((it, i) => ({ ...it, template_id: templateMap["Monthly Safety Check"], sort_order: i }));
      await sb.from("inspection_template_items").insert(items as any);
    }

    // 8. Sample inspections
    const inspData = [
      { property_id: propIds[0], unit_id: unitMap[propIds[0]]?.[0], inspector_id: staffIds[0], template_id: templateMap["Standard Unit Turnover"], status: "in_progress" },
      { property_id: propIds[1], inspector_id: staffIds[0], template_id: templateMap["Monthly Safety Check"], status: "scheduled" },
      { property_id: propIds[4], unit_id: unitMap[propIds[4]]?.[0], inspector_id: staffIds[1], template_id: templateMap["Standard Unit Turnover"], status: "completed", completed_at: ago(24) },
      { property_id: propIds[7], inspector_id: staffIds[2], template_id: templateMap["Monthly Safety Check"], status: "scheduled" },
    ].filter((i) => i.template_id); // only insert if template exists

    if (inspData.length) {
      await sb.from("inspections").insert(inspData as any);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        users: Object.keys(userIds).length, 
        properties: propIds.length, 
        message: "Seed data created. Login credentials: any @lrmb.test email with password Test1234!",
        logins: users.map(u => ({ email: u.email, password: u.password, role: u.role }))
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
