import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useVendors, useCreateVendor, useUpdateVendor } from "@/hooks/useVendors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Phone, Mail, Wrench } from "lucide-react";
import type { Vendor } from "@/types/task";

const EMPTY_FORM = {
  name: "",
  contact_name: "",
  phone: "",
  email: "",
  specialty: "housekeeping",
  payment_method: "square",
  notes: "",
  active: true,
};

const VendorManagement = () => {
  const { toast } = useToast();
  const { t } = useI18n();
  const { data: vendors = [], isLoading } = useVendors();
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (key: string, value: unknown) => setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (vendor: Vendor) => {
    setEditingId(vendor.id);
    setForm({
      name: vendor.name,
      contact_name: vendor.contact_name || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      specialty: vendor.specialty || "housekeeping",
      payment_method: vendor.payment_method || "square",
      notes: vendor.notes || "",
      active: vendor.active ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: t("Name required"), variant: "destructive" });
      return;
    }
    const payload = {
      name: form.name.trim(),
      contact_name: form.contact_name || null,
      phone: form.phone || null,
      email: form.email || null,
      specialty: form.specialty || null,
      payment_method: form.payment_method || null,
      notes: form.notes || null,
      active: form.active,
    };

    try {
      if (editingId) {
        await updateVendor.mutateAsync({ id: editingId, ...payload });
        toast({ title: t("Vendor updated") });
      } else {
        await createVendor.mutateAsync(payload);
        toast({ title: t("Vendor created") });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: t("Failed to save vendor"), variant: "destructive" });
    }
  };

  const activeVendors = vendors.filter((v) => v.active !== false);
  const inactiveVendors = vendors.filter((v) => v.active === false);

  return (
    <AppShell title={t("Vendors")}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{t("Vendor Management")}</h2>
            <p className="text-sm text-muted-foreground">{vendors.length} {t("vendors")}</p>
          </div>
          <Button onClick={openCreate} className="tap-target gap-2">
            <Plus className="h-4 w-4" /> {t("Add Vendor")}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>
        ) : (
          <div className="space-y-3">
            {activeVendors.map((v) => (
              <div key={v.id} className="rounded-lg border border-border bg-card p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{v.name}</h3>
                    {v.contact_name && <p className="text-sm text-muted-foreground">{v.contact_name}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {v.specialty && (
                      <Badge variant="outline" className="text-xs">
                        <Wrench className="h-3 w-3 mr-1" />{v.specialty}
                      </Badge>
                    )}
                    {/* QA Agent A P2 (2026-05-29): bump tap target to >=44px */}
                    <Button variant="ghost" size="sm" onClick={() => openEdit(v)} className="min-h-11 min-w-11">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {v.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{v.phone}</span>}
                  {v.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{v.email}</span>}
                  {v.payment_method && <span>{t("Payment")}: {v.payment_method}</span>}
                </div>
                {v.notes && <p className="text-xs text-muted-foreground">{v.notes}</p>}
              </div>
            ))}

            {inactiveVendors.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-muted-foreground pt-4">{t("Inactive")} ({inactiveVendors.length})</h3>
                {inactiveVendors.map((v) => (
                  <div key={v.id} className="rounded-lg border border-border bg-card/50 p-4 opacity-60">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{v.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(v)} className="min-h-11 min-w-11">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit Vendor Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? t("Edit Vendor") : t("Add Vendor")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>{t("Company Name *")}</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t("Vendor name")} />
            </div>
            <div className="space-y-2">
              <Label>{t("Contact Person")}</Label>
              <Input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} placeholder={t("Primary contact")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t("Phone")}</Label>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t("Phone number")} type="tel" />
              </div>
              <div className="space-y-2">
                <Label>{t("Email")}</Label>
                <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t("Email")} type="email" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>{t("Specialty")}</Label>
                <Select value={form.specialty} onValueChange={(v) => set("specialty", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="housekeeping">{t("Housekeeping")}</SelectItem>
                    <SelectItem value="maintenance">{t("Maintenance")}</SelectItem>
                    <SelectItem value="plumbing">{t("Plumbing")}</SelectItem>
                    <SelectItem value="electrical">{t("Electrical")}</SelectItem>
                    <SelectItem value="ac_hvac">{t("AC / HVAC")}</SelectItem>
                    <SelectItem value="appliances">{t("Appliances")}</SelectItem>
                    <SelectItem value="furniture">{t("Furniture Restoration")}</SelectItem>
                    <SelectItem value="general">{t("General")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("Payment Method")}</Label>
                <Select value={form.payment_method} onValueChange={(v) => set("payment_method", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="invoice">{t("Invoice")}</SelectItem>
                    <SelectItem value="check">{t("Check")}</SelectItem>
                    <SelectItem value="ach">ACH</SelectItem>
                    <SelectItem value="other">{t("Other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("Notes")}</Label>
              <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t("Internal notes about this vendor...")} rows={2} />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label>{t("Active")}</Label>
              <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={createVendor.isPending || updateVendor.isPending} className="tap-target">
              {editingId ? t("Save Changes") : t("Add Vendor")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default VendorManagement;
