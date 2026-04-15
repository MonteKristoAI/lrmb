import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { PRODUCT_CATEGORIES } from "@/data/productCategories";

const EFFECT_OPTIONS = ["Unwind", "Social", "Sleep", "Relief", "Recovery", "Uplift", "Clarity", "Intimacy", "Performance"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface FormData {
  title: string;
  handle: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  compare_price: string;
  description: string;
  highlights: string;
  effects: string[];
  ingredients: string;
  weight: string;
  gram_amount: string;
  status: string;
  is_featured: boolean;
  subscription_eligible: boolean;
  image_url: string;
  product_image_url: string;
  gallery_images: string[];
}

const EMPTY_FORM: FormData = {
  title: "",
  handle: "",
  brand: "",
  category: "thc-edibles",
  subcategory: "",
  price: "",
  compare_price: "",
  description: "",
  highlights: "",
  effects: [],
  ingredients: "",
  weight: "",
  gram_amount: "",
  status: "active",
  is_featured: false,
  subscription_eligible: false,
  image_url: "",
  product_image_url: "",
  gallery_images: [],
};

export default function AdminProductForm() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const isEdit = !!handle;
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit && handle) {
      (supabase.from("custom_products" as any).select("*").eq("handle", handle).single() as any)
        .then(({ data, error }: any) => {
          if (error || !data) {
            toast.error("Product not found");
            navigate("/admin/products");
            return;
          }
          setForm({
            title: data.title || "",
            handle: data.handle || "",
            brand: data.brand || "",
            category: data.category || "thc-edibles",
            subcategory: data.subcategory || "",
            price: String(data.price || ""),
            compare_price: data.compare_price ? String(data.compare_price) : "",
            description: data.description || "",
            highlights: (data.highlights || []).join("\n"),
            effects: data.effects || [],
            ingredients: data.ingredients || "",
            weight: data.weight || "",
            gram_amount: data.gram_amount || "",
            status: data.status || "active",
            is_featured: data.is_featured || false,
            subscription_eligible: data.subscription_eligible || false,
            image_url: data.image_url || "",
            product_image_url: data.product_image_url || "",
            gallery_images: data.gallery_images || [],
          });
          setLoading(false);
        });
    }
  }, [handle, isEdit, navigate]);

  const set = (field: keyof FormData, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !isEdit) {
        updated.handle = slugify(value);
      }
      return updated;
    });
  };

  const toggleEffect = (eff: string) => {
    setForm((prev) => ({
      ...prev,
      effects: prev.effects.includes(eff) ? prev.effects.filter((e) => e !== eff) : [...prev.effects, eff],
    }));
  };

  const uploadImage = async (file: File, type: "main" | "product" | "gallery") => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${form.handle || "temp"}/${type}-${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(data.path);
    const url = urlData.publicUrl;

    if (type === "main") {
      set("image_url", url);
    } else if (type === "product") {
      set("product_image_url", url);
    } else {
      setForm((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, url] }));
    }
    setUploading(false);
    toast.success("Image uploaded");
  };

  const removeGalleryImage = (idx: number) => {
    setForm((prev) => ({ ...prev, gallery_images: prev.gallery_images.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.price || isNaN(Number(form.price))) { toast.error("Valid price is required"); return; }
    if (!form.handle.trim()) { toast.error("Handle is required"); return; }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      handle: form.handle.trim(),
      brand: form.brand.trim(),
      category: form.category,
      subcategory: form.subcategory || null,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      description: form.description.trim(),
      highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      effects: form.effects,
      ingredients: form.ingredients.trim(),
      weight: form.weight.trim(),
      gram_amount: form.gram_amount.trim(),
      status: form.status,
      is_featured: form.is_featured,
      subscription_eligible: form.subscription_eligible,
      image_url: form.image_url || null,
      product_image_url: form.product_image_url || null,
      gallery_images: form.gallery_images,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isEdit) {
      ({ error } = await (supabase.from("custom_products" as any).update(payload as any).eq("handle", handle) as any));
    } else {
      ({ error } = await (supabase.from("custom_products" as any).insert(payload as any) as any));
    }

    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success(isEdit ? "Product updated" : "Product created");
      navigate("/admin/products");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/admin/products")} className="mb-4 gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Button>

      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">
        {isEdit ? "Edit Product" : "Add New Product"}
      </h1>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Product Title *</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Delta-9 THC Gummies" />
            </div>
            <div>
              <Label>Handle / Slug *</Label>
              <Input value={form.handle} onChange={(e) => set("handle", e.target.value)} placeholder="auto-generated" disabled={isEdit} />
            </div>
            <div>
              <Label>Brand</Label>
              <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} placeholder="e.g. GummyGurl" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subcategory</Label>
              <Input value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} placeholder="e.g. gummies" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Price *</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="29.99" />
            </div>
            <div>
              <Label>Compare Price</Label>
              <Input type="number" step="0.01" value={form.compare_price} onChange={(e) => set("compare_price", e.target.value)} placeholder="39.99" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Description & Details</h2>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Product description..." />
          </div>
          <div>
            <Label>Highlights (one per line)</Label>
            <Textarea value={form.highlights} onChange={(e) => set("highlights", e.target.value)} rows={3} placeholder="Lab tested&#10;Farm bill compliant&#10;Made in USA" />
          </div>
          <div>
            <Label>Ingredients</Label>
            <Textarea value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} rows={2} placeholder="Ingredient list..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Weight</Label>
              <Input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 100g" />
            </div>
            <div>
              <Label>Gram Amount</Label>
              <Input value={form.gram_amount} onChange={(e) => set("gram_amount", e.target.value)} placeholder="e.g. 500mg" />
            </div>
          </div>
        </div>

        {/* Effects */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Effects</h2>
          <div className="flex flex-wrap gap-2">
            {EFFECT_OPTIONS.map((eff) => (
              <button
                key={eff}
                type="button"
                onClick={() => toggleEffect(eff)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  form.effects.includes(eff)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/30"
                }`}
              >
                {eff}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Images</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Main Image (Packaging)</Label>
              {form.image_url && (
                <img src={form.image_url} alt="Main" className="w-32 h-32 rounded-lg object-cover mt-2 mb-2 bg-muted" />
              )}
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "main")}
                />
                <Button type="button" variant="outline" size="sm" className="gap-1.5" disabled={uploading} asChild>
                  <span><Upload className="w-3.5 h-3.5" /> {uploading ? "Uploading..." : "Upload"}</span>
                </Button>
              </label>
            </div>
            <div>
              <Label>Product Image (Hover)</Label>
              {form.product_image_url && (
                <img src={form.product_image_url} alt="Product" className="w-32 h-32 rounded-lg object-cover mt-2 mb-2 bg-muted" />
              )}
              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "product")}
                />
                <Button type="button" variant="outline" size="sm" className="gap-1.5" disabled={uploading} asChild>
                  <span><Upload className="w-3.5 h-3.5" /> {uploading ? "Uploading..." : "Upload"}</span>
                </Button>
              </label>
            </div>
          </div>

          <div>
            <Label>Gallery Images</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.gallery_images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`Gallery ${i + 1}`} className="w-20 h-20 rounded-lg object-cover bg-muted" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], "gallery")}
                />
                <Plus className="w-5 h-5 text-muted-foreground" />
              </label>
            </div>
          </div>
        </div>

        {/* Status & Flags */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Status & Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="restock_coming_soon">Restock Coming Soon</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.is_featured} onCheckedChange={(v) => set("is_featured", v)} />
              <Label>Featured Product</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.subscription_eligible} onCheckedChange={(v) => set("subscription_eligible", v)} />
              <Label>Subscription Eligible</Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="gap-1.5">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/products")}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
