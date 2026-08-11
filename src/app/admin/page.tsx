"use client";

import { useCallback, useEffect, useState } from "react";

// Owner-only escrow console. English by design — it's an operator tool. The token
// is held in localStorage and sent as a bearer; the server does the real check.

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
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async (t: string) => {
    setError(null);
    const res = await fetch("/api/admin/orders", { headers: { authorization: `Bearer ${t}` } });
    if (res.status === 401) {
      setError("Wrong token.");
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      setError(d?.error ?? "Failed to load.");
      return;
    }
    const data = await res.json();
    setOrders(data.orders ?? []);
    setAuthed(true);
    localStorage.setItem("niloosa_admin", t);
  }, []);

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
        const d = await res.json().catch(() => null);
        setError(d?.error ?? "Transition failed.");
      } else {
        await load(token);
      }
    } finally {
      setBusy(null);
    }
  }

  if (!authed) {
    return (
      <main className="grid min-h-dvh place-items-center bg-neutral-50 p-6 text-neutral-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(token);
          }}
          className="w-full max-w-sm space-y-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <h1 className="text-xl font-semibold">Niloosa · Escrow console</h1>
          <p className="text-sm text-neutral-500">Enter the admin token.</p>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ADMIN_TOKEN"
            className="h-11 w-full rounded-lg border border-neutral-300 px-3 outline-none focus:border-neutral-900"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="h-11 w-full rounded-lg bg-neutral-900 font-medium text-white hover:bg-neutral-800">
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-neutral-50 p-4 text-neutral-900 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Escrow console</h1>
          <button
            onClick={() => load(token)}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-100"
          >
            Refresh
          </button>
        </div>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {orders.length === 0 && <p className="text-neutral-500">No commissions yet.</p>}

        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.ref} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.imageUrl} alt="" className="h-16 w-14 rounded object-cover" />
                  <div>
                    <p className="font-medium">{o.paintingTitle}</p>
                    <p className="text-sm text-neutral-500">after {o.artist}</p>
                    <p className="mt-1 font-mono text-xs text-neutral-500">
                      {o.ref} · {o.sizeId} · {o.frameId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                    {o.status}
                  </span>
                  <p className="mt-2 text-sm">
                    Offer: <b>${money(o.offeredUsd)}</b> · {money(o.offeredToman)} T
                  </p>
                  <p className="text-xs text-neutral-500">
                    Deposit: ${money(o.depositUsd)} · {money(o.depositToman)} T
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-1 rounded-lg bg-neutral-50 p-3 text-sm md:grid-cols-2">
                <p><span className="text-neutral-500">Customer:</span> {o.customerName}</p>
                <p><span className="text-neutral-500">Contact:</span> {o.contact}</p>
                <p className="md:col-span-2"><span className="text-neutral-500">Deliver to:</span> {o.address}</p>
                {o.note && <p className="md:col-span-2"><span className="text-neutral-500">Note:</span> {o.note}</p>}
                {o.depositTrackingCode && (
                  <p className="md:col-span-2">
                    <span className="text-neutral-500">Deposit code:</span>{" "}
                    <span className="font-mono">{o.depositTrackingCode}</span>
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
                    → {to.replace(/_/g, " ")}
                  </button>
                ))}
                {(NEXT[o.status] ?? []).length === 0 && (
                  <span className="text-sm text-neutral-400">No further actions.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
