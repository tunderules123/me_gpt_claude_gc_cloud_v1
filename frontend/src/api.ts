import { HistoryResp, SendReq, SendResp } from "./types";

// Use environment variable for backend URL, fallback to proxy for development
const BASE = import.meta.env.VITE_BACKEND_URL || "";

export async function getHistory(): Promise<HistoryResp> {
  const r = await fetch(`${BASE}/history`, { 
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!r.ok) throw new Error(`GET /history failed: ${r.status}`);
  return r.json();
}

export async function sendMessage(body: SendReq, timeoutMs = 25000): Promise<SendResp> {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`${BASE}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      throw new Error(`POST /send failed: ${r.status} ${t}`);
    }
    return r.json();
  } finally {
    clearTimeout(to);
  }
}

export async function resetChat(): Promise<{ ok: boolean }> {
  const r = await fetch(`${BASE}/reset`, { 
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!r.ok) throw new Error(`POST /reset failed: ${r.status}`);
  return r.json();
}