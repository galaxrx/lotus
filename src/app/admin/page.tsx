"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/i18n/provider";

// Owner-only escrow console. The token is held in localStorage and sent as a
// bearer; the server does the real check. Copy follows the site language.

const NEXT: Record<string, string[]> = {
  offer_pending: ["channel_posted", "cancelled"],
  channel_posted: ["artist_matched", "cancelled"],
  artist_matched: ["deposit_pending", "cancelled"],
  deposit_pending: ["deposit_confirmed", "artist_matched", "cancelled"],
  deposit_confirmed: ["in_progress", "cancelled"],
  in_progress: ["delivered", "cancelled"],
  delivered: ["completed"],
  completed: [],
  cancelled: [],
};

interface Order {
  ref: string;
  status: string;
  paintingTitle: string;
  artist: string;
  imageUrl: string;
  sizeId: string;
  frameId: string;
  offeredUsd: number;
  offeredToman: number;
  depositUsd: number;
  depositToman: number;
  offeredCurrency: string;
  customerName: string;
  contact: string;
  address: string;
  note: string | null;
  depositTrackingCode: string | null;
  createdAt: string;
}

const money = (n: number) => n.toLocaleString("en-US");

export default function AdminPage() {
  const { dict, locale } = useI18n();
  const a = dict.admin;
  const s = dict.status;
  const dir = locale === "fa" ? "rtl" : "ltr";

  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(
    async (t: string) => {
      setError(null);
      const res = await fetch("/api/admin/orders", { headers: { authorization: `Bearer ${t}` } });
      if (res.status === 401) {
        setError(a.wrongToken);
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        setError(a.loadFailed);
        return;
      }
      const data = await res.json();
      setOrders(data.orders ?? []);
      setAuthed(true);
      localStorage.setItem("niloosa_admin", t);
    },
    [a.wrongToken, a.loadFailed]
  );

  useEffect(() => {
    const saved = localStorage.getItem("niloosa_admin");
    if (saved) {
      setToken(saved);
      load(saved);
    }
  }, [load]);

  async function transition(ref: string, to: string) {
    setBusy(`${ref}:${to}`);
    try {
      const res = await fetch(`/api/admin/orders/${ref}`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ to }),
      });
      if (!res.ok) {
        setError(a.transitionFailed);
      } else {
        await load(token);
      }
    } finally {
      setBusy(null);
    }
  }

  if (!authed) {
    return (
      <main dir={dir} className="grid min-h-dvh place-items-center bg-neutral-50 p-6 text-neutral-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(token);
          }}
          className="w-full max-w-sm space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <h1 className="text-xl font-semibold">{a.tokenTitle}</h1>
          <p className="text-sm text-neutral-500">{a.tokenPrompt}</p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ADMIN_TOKEN"
            dir="ltr"
            className="h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none focus:border-neutral-900"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="h-11 w-full rounded-lg bg-neutral-900 font-medium text-white hover:bg-neutral-800">
            {a.signIn}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main dir={dir} className="min-h-dvh bg-neutral-50 p-4 text-neutral-900 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{a.title}</h1>
          <button
            onClick={() => load(token)}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-100"
          >
            {a.refresh}
          </button>
        </div>

        {/* Owner's guide */}
        <details open className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <summary className="cursor-pointer select-none text-sm font-semibold text-neutral-900">
            {a.guideTitle}
          </summary>
          <ol className="mt-3 space-y-2">
            {a.guideSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-neutral-600">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-neutral-900 text-[11px] font-medium text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </details>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {orders.length === 0 && <p className="text-neutral-500">{a.empty}</p>}

        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.ref} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.imageUrl} alt="" className="h-16 w-14 rounded object-cover" />
                  <div>
                    <p className="font-medium">{o.paintingTitle}</p>
                    <p className="text-sm text-neutral-500">{a.after} {o.artist}</p>
                    <p className="mt-1 font-mono text-xs text-neutral-500" dir="ltr">
                      {o.ref} · {o.sizeId} · {o.frameId}
                    </p>
                  </div>
                </div>
                <div className="text-end">
                  <span className="inline-block rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                    {s[o.status as keyof typeof s] ?? o.status}
                  </span>
                  <p className="mt-2 text-sm">
                    {a.offer}: <b>${money(o.offeredUsd)}</b> · {money(o.offeredToman)} T
                  </p>
                  <p className="text-xs text-neutral-500">
                    {a.deposit}: ${money(o.depositUsd)} · {money(o.depositToman)} T
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-1 rounded-lg bg-neutral-50 p-3 text-sm md:grid-cols-2">
                <p><span className="text-neutral-500">{a.customer}:</span> {o.customerName}</p>
                <p><span className="text-neutral-500">{a.contact}:</span> {o.contact}</p>
                <p className="md:col-span-2"><span className="text-neutral-500">{a.deliverTo}:</span> {o.address}</p>
                {o.note && <p className="md:col-span-2"><span className="text-neutral-500">{a.note}:</span> {o.note}</p>}
                {o.depositTrackingCode && (
                  <p className="md:col-span-2">
                    <span className="text-neutral-500">{a.depositCode}:</span>{" "}
                    <span className="font-mono" dir="ltr">{o.depositTrackingCode}</span>
                  </p>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(NEXT[o.status] ?? []).map((to) => (
                  <button
                    key={to}
                    disabled={busy === `${o.ref}:${to}`}
                    onClick={() => transition(o.ref, to)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${
                      to === "cancelled"
                        ? "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                        : "bg-neutral-900 text-white hover:bg-neutral-800"
                    }`}
                  >
                    {s[to as keyof typeof s] ?? to}
                  </button>
                ))}
                {(NEXT[o.status] ?? []).length === 0 && (
                  <span className="text-sm text-neutral-400">{a.noActions}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
