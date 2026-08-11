"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { User, SupabaseClient } from "@supabase/supabase-js";
import { Loader2, LogOut, Plus, Trash2, ImageUp, Check } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { ARTWORKS_BUCKET } from "@/lib/supabase/config";
import { normalizeHandle, type ArtistProfile, type Artwork } from "@/lib/portal";
import { STYLES } from "@/lib/catalog";

type DB = SupabaseClient;

export function StudioClient() {
  const { dict } = useI18n();
  const p = dict.portal;
  const [supabase] = useState<DB>(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (!ready) {
    return (
      <div className="grid min-h-[50dvh] place-items-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return user ? (
    <Dashboard supabase={supabase} user={user} onSignOut={() => supabase.auth.signOut()} />
  ) : (
    <AuthForm supabase={supabase} p={p} />
  );
}

/* ------------------------------------------------------------------ Auth ---- */

function AuthForm({ supabase, p }: { supabase: DB; p: ReturnType<typeof useI18n>["dict"]["portal"] }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name } },
        });
        if (error) setError(error.message);
        else if (!data.session) setInfo(p.checkEmail);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl">{mode === "in" ? p.signInTitle : p.signUpTitle}</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "up" && (
          <TextField label={p.displayName} value={name} onChange={setName} autoComplete="name" required />
        )}
        <TextField label={p.email} value={email} onChange={setEmail} type="email" autoComplete="email" required />
        <TextField label={p.password} value={password} onChange={setPassword} type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} required minLength={6} />
        {error && <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        {info && <p className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">{info}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : null}
          {loading ? p.working : mode === "in" ? p.signIn : p.signUp}
        </Button>
      </form>
      <button
        onClick={() => { setMode((m) => (m === "in" ? "up" : "in")); setError(null); setInfo(null); }}
        className="mt-5 text-sm text-primary underline-offset-4 hover:underline cursor-pointer"
      >
        {mode === "in" ? p.toSignUp : p.toSignIn}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------- Dashboard ---- */

function Dashboard({ supabase, user, onSignOut }: { supabase: DB; user: User; onSignOut: () => void }) {
  const { dict } = useI18n();
  const p = dict.portal;
  const [tab, setTab] = useState<"profile" | "works">("profile");
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  const loadProfile = useCallback(async () => {
    const { data } = await supabase.from("artist_profiles").select("*").eq("id", user.id).maybeSingle();
    setProfile((data as ArtistProfile) ?? null);
    setLoaded(true);
  }, [supabase, user.id]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl">{p.dashboardTitle}</h1>
        <button onClick={onSignOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
          <LogOut size={16} /> {p.signOut}
        </button>
      </div>

      <div className="mt-6 flex gap-2 border-b border-border">
        {(["profile", "works"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium cursor-pointer ${
              tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "profile" ? p.profileTab : p.worksTab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {!loaded ? (
          <Loader2 className="animate-spin text-muted-foreground" />
        ) : tab === "profile" ? (
          <ProfileForm supabase={supabase} user={user} profile={profile} onSaved={loadProfile} />
        ) : profile ? (
          <ArtworksManager supabase={supabase} user={user} />
        ) : (
          <p className="text-muted-foreground">{p.profileFirst}</p>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Profile ---- */

function ProfileForm({ supabase, user, profile, onSaved }: { supabase: DB; user: User; profile: ArtistProfile | null; onSaved: () => void }) {
  const { dict } = useI18n();
  const p = dict.portal;
  const [form, setForm] = useState<ArtistProfile>(
    profile ?? {
      id: user.id,
      handle: "",
      display_name: (user.user_metadata?.display_name as string) ?? "",
      bio_en: "",
      bio_fa: "",
      city: "",
      instagram: "",
      website: "",
      price_min_toman: null,
      price_min_usd: null,
      avatar_url: null,
      published: false,
    }
  );
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof ArtistProfile>(k: K, v: ArtistProfile[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setDone(false);
    const payload = { ...form, id: user.id, handle: normalizeHandle(form.handle || form.display_name) };
    const { error } = await supabase.from("artist_profiles").upsert(payload);
    if (error) setError(error.message);
    else {
      setDone(true);
      onSaved();
      setTimeout(() => setDone(false), 2000);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={p.displayName} value={form.display_name} onChange={(v) => set("display_name", v)} required />
        <TextField label={p.handle} value={form.handle} onChange={(v) => set("handle", v)} hint={p.handleHint} required />
      </div>
      <TextArea label={p.bioEn} value={form.bio_en} onChange={(v) => set("bio_en", v)} hint={p.bioHint} dir="ltr" />
      <TextArea label={p.bioFa} value={form.bio_fa} onChange={(v) => set("bio_fa", v)} dir="rtl" />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label={p.city} value={form.city} onChange={(v) => set("city", v)} />
        <TextField label={p.instagram} value={form.instagram} onChange={(v) => set("instagram", v)} />
        <TextField label={p.website} value={form.website} onChange={(v) => set("website", v)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label={p.priceMinToman} value={form.price_min_toman} onChange={(v) => set("price_min_toman", v)} hint={p.priceHint} />
        <NumberField label={p.priceMinUsd} value={form.price_min_usd} onChange={(v) => set("price_min_usd", v)} />
      </div>
      <Toggle label={p.publishProfile} checked={form.published} onChange={(v) => set("published", v)} />
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 size={16} className="animate-spin" /> : done ? <Check size={16} /> : null}
        {saving ? p.saving : done ? p.saved : p.save}
      </Button>
    </form>
  );
}

/* -------------------------------------------------------------- Artworks ---- */

function ArtworksManager({ supabase, user }: { supabase: DB; user: User }) {
  const { dict } = useI18n();
  const p = dict.portal;
  const [works, setWorks] = useState<Artwork[]>([]);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("artworks").select("*").eq("artist_id", user.id).order("created_at", { ascending: false });
    setWorks((data as Artwork[]) ?? []);
  }, [supabase, user.id]);

  useEffect(() => { load(); }, [load]);

  async function remove(id: string) {
    await supabase.from("artworks").delete().eq("id", id);
    load();
  }
  async function togglePublish(w: Artwork) {
    await supabase.from("artworks").update({ published: !w.published }).eq("id", w.id);
    load();
  }

  return (
    <div>
      {!adding && (
        <Button onClick={() => setAdding(true)}>
          <Plus size={16} /> {p.addWork}
        </Button>
      )}
      {adding && (
        <ArtworkForm supabase={supabase} user={user} onDone={() => { setAdding(false); load(); }} onCancel={() => setAdding(false)} />
      )}

      {works.length === 0 && !adding ? (
        <p className="mt-6 text-muted-foreground">{p.worksEmpty}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w) => (
            <div key={w.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.image_url} alt={w.title_en} className="aspect-[4/3] w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-sm font-medium">{w.title_en || w.title_fa}</p>
                <p className="truncate text-xs text-muted-foreground">{w.style} · {w.medium}</p>
                <div className="mt-3 flex items-center justify-between">
                  <button onClick={() => togglePublish(w)} className={`rounded-full px-3 py-1 text-xs cursor-pointer ${w.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {w.published ? "●" : "○"} {p.publishWork}
                  </button>
                  <button onClick={() => remove(w.id)} aria-label={p.deleteWork} className="text-muted-foreground hover:text-destructive cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArtworkForm({ supabase, user, onDone, onCancel }: { supabase: DB; user: User; onDone: () => void; onCancel: () => void }) {
  const { dict } = useI18n();
  const p = dict.portal;
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState({
    title_en: "", title_fa: "", style: "", medium: "", dimensions: "",
    year: "" as string, description_en: "", description_fa: "",
    price_toman: "" as string, price_usd: "" as string, for_sale: true, published: true,
  });
  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }));

  function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError(p.workImage); return; }
    setBusy(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const up = await supabase.storage.from(ARTWORKS_BUCKET).upload(path, file, { upsert: false });
      if (up.error) throw up.error;
      const { data: pub } = supabase.storage.from(ARTWORKS_BUCKET).getPublicUrl(path);
      const { error } = await supabase.from("artworks").insert({
        artist_id: user.id,
        title_en: f.title_en,
        title_fa: f.title_fa,
        style: f.style,
        medium: f.medium,
        dimensions: f.dimensions,
        year: f.year ? parseInt(f.year, 10) : null,
        description_en: f.description_en,
        description_fa: f.description_fa,
        price_toman: f.price_toman ? parseInt(f.price_toman, 10) : null,
        price_usd: f.price_usd ? parseInt(f.price_usd, 10) : null,
        for_sale: f.for_sale,
        published: f.published,
        image_url: pub.publicUrl,
      });
      if (error) throw error;
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : p.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 max-w-2xl space-y-5 rounded-2xl border border-border bg-surface p-5">
      {/* Image */}
      <div>
        <label className="text-sm font-medium">{p.workImage}</label>
        <div className="mt-2 flex items-center gap-4">
          <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-background">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageUp className="text-muted-foreground" />
            )}
          </div>
          <button type="button" onClick={() => fileRef.current?.click()} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted cursor-pointer">
            {p.uploadImage}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label={p.workTitleEn} value={f.title_en} onChange={(v) => set("title_en", v)} dir="ltr" required />
        <TextField label={p.workTitleFa} value={f.title_fa} onChange={(v) => set("title_fa", v)} dir="rtl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField label={p.workStyle} value={f.style} onChange={(v) => set("style", v)} options={STYLES} />
        <TextField label={p.workMedium} value={f.medium} onChange={(v) => set("medium", v)} hint={p.workMediumHint} />
        <TextField label={p.workDimensions} value={f.dimensions} onChange={(v) => set("dimensions", v)} />
      </div>
      <TextArea label={p.workDescEn} value={f.description_en} onChange={(v) => set("description_en", v)} dir="ltr" />
      <TextArea label={p.workDescFa} value={f.description_fa} onChange={(v) => set("description_fa", v)} dir="rtl" />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label={p.workYear} value={f.year} onChange={(v) => set("year", v)} />
        <TextField label={p.workPriceToman} value={f.price_toman} onChange={(v) => set("price_toman", v)} />
        <TextField label={p.workPriceUsd} value={f.price_usd} onChange={(v) => set("price_usd", v)} />
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <Toggle label={p.forSale} checked={f.for_sale} onChange={(v) => set("for_sale", v)} />
        <Toggle label={p.publishWork} checked={f.published} onChange={(v) => set("published", v)} />
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : null}
          {busy ? p.uploading : p.save}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>{dict.order.cancel}</Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ Fields -- */

function TextField({ label, value, onChange, hint, type = "text", dir, ...rest }: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; type?: string; dir?: "ltr" | "rtl";
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        {...rest}
      />
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function NumberField({ label, value, onChange, hint }: { label: string; value: number | null; onChange: (v: number | null) => void; hint?: string }) {
  return (
    <TextField
      label={label}
      hint={hint}
      value={value == null ? "" : String(value)}
      onChange={(v) => onChange(v.trim() ? parseInt(v.replace(/[^\d]/g, ""), 10) || null : null)}
    />
  );
}

function TextArea({ label, value, onChange, hint, dir }: { label: string; value: string; onChange: (v: string) => void; hint?: string; dir?: "ltr" | "rtl" }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <textarea
        dir={dir}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o}>{o.replace(/-/g, " ")}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-primary" />
      {label}
    </label>
  );
}
