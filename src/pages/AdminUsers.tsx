import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

// Who can sign in, managed by an admin from inside the app. Until October 2026
// accounts were created only by the demo seed or by hand in the database, so an
// admin could not add a colleague. The work happens in the admin-users edge
// function, which checks the caller's admin role on the server.

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "supervisor", label: "Supervisor" },
  { value: "field_staff", label: "Field staff" },
] as const;

interface UserRow {
  id: string;
  email: string | null;
  full_name: string | null;
  roles: string[];
  active: boolean;
  last_sign_in_at: string | null;
  invited_at: string | null;
  is_test: boolean;
}

async function call<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  if (error) {
    // The function answers with { error, detail }; surface the detail.
    const ctx = (error as { context?: Response }).context;
    if (ctx) {
      try {
        const j = await ctx.json();
        throw new Error(j.detail ?? j.error ?? error.message);
      } catch (e) {
        if (e instanceof Error && e.message) throw e;
      }
    }
    throw error;
  }
  return data as T;
}

export default function AdminUsers() {
  const { t } = useI18n();
  const { toast } = useToast();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [roles, setRoles] = useState<string[]>(["field_staff"]);
  const [showTest, setShowTest] = useState(false);

  const list = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => call<{ users: UserRow[] }>({ action: "list" }).then((r) => r.users),
  });

  const invite = useMutation({
    mutationFn: () =>
      call<{ ok: true }>({ action: "invite", email, full_name: fullName, roles, redirect_to: `${window.location.origin}/` }),
    onSuccess: () => {
      toast({ title: t("Invitation sent"), description: email });
      setEmail("");
      setFullName("");
      setRoles(["field_staff"]);
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast({ title: t("Could not invite"), description: e.message, variant: "destructive" }),
  });

  const setActive = useMutation({
    mutationFn: (v: { user_id: string; active: boolean }) => call({ action: "set_active", ...v }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin-users"] }),
    onError: (e: Error) => toast({ title: t("Could not update"), description: e.message, variant: "destructive" }),
  });

  const rows = (list.data ?? []).filter((u) => showTest || !u.is_test);
  const toggleRole = (r: string) => setRoles((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));

  return (
    <AppShell title={t("Users")}>
      <div className="space-y-4">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <h2 className="text-base font-semibold">{t("Invite someone")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("They receive an email with a sign-in link and arrive with the roles you choose. Afterwards they sign in with Email me a sign-in link.")}
            </p>
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                invite.mutate();
              }}
            >
              <Input type="email" required placeholder={t("Email")} value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder={t("Full name")} value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <fieldset className="flex flex-wrap gap-4 sm:col-span-2">
                <legend className="sr-only">{t("Roles")}</legend>
                {ROLE_OPTIONS.map((r) => (
                  <label key={r.value} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={roles.includes(r.value)} onChange={() => toggleRole(r.value)} />
                    {t(r.label)}
                  </label>
                ))}
              </fieldset>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={invite.isPending || !email || roles.length === 0}>
                  {invite.isPending ? t("Sending…") : t("Send invitation")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">{t("People who can sign in")}</h2>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={showTest} onChange={(e) => setShowTest(e.target.checked)} />
                {t("Show test accounts")}
              </label>
            </div>
            {list.isLoading ? (
              <p className="text-sm text-muted-foreground">{t("Loading…")}</p>
            ) : list.isError ? (
              <p role="alert" className="text-sm text-destructive">{(list.error as Error).message}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-3">{t("Name")}</th>
                      <th className="py-2 pr-3">{t("Roles")}</th>
                      <th className="py-2 pr-3">{t("Last sign-in")}</th>
                      <th className="py-2 pr-3">{t("Status")}</th>
                      <th className="py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="py-2 pr-3">
                          <div className="font-medium">{u.full_name || u.email}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </td>
                        <td className="py-2 pr-3">{u.roles.join(", ") || "none"}</td>
                        <td className="py-2 pr-3">
                          {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : t("Never")}
                        </td>
                        <td className="py-2 pr-3">{u.active ? t("Active") : t("Deactivated")}</td>
                        <td className="py-2 text-right">
                          {u.id !== user?.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={setActive.isPending}
                              onClick={() => setActive.mutate({ user_id: u.id, active: !u.active })}
                            >
                              {u.active ? t("Deactivate") : t("Reactivate")}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
