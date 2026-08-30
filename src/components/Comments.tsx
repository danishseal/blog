"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import { shortAddr, signMessage } from "@/lib/ansem";
import { challengeMessage } from "@/lib/challenge";

type Comment = { id: string; author: string; text: string; ts: number };

export default function Comments() {
  const { address, connecting, error: walletError, connect, disconnect } =
    useWallet();
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then((d) => Array.isArray(d.comments) && setComments(d.comments))
      .catch(() => {});
  }, []);

  const post = async () => {
    const text = draft.trim();
    if (!text || busy || !address) return;
    setBusy(true);
    setError(null);
    try {
      // 1. Get a one-time challenge from the server.
      const nonce: string = await fetch("/api/comments/challenge")
        .then((r) => r.json())
        .then((d) => d.nonce);
      // 2. Sign it (with the comment bound in) using the ansemchain wallet.
      const { signature, pubKey } = await signMessage(
        address,
        challengeMessage(nonce, text),
      );
      // 3. Post; the server re-derives the address and verifies the signature.
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, address, pubKey, signature, nonce }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "could not post");
        return;
      }
      setComments((prev) => [data.comment, ...prev]);
      setDraft("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "could not post");
    } finally {
      setBusy(false);
    }
  };

  const heading =
    comments.length === 0
      ? "No comments yet"
      : `${comments.length} comment${comments.length > 1 ? "s" : ""}`;

  return (
    <div
      id="comments"
      className="bg-[#1c1817] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{heading}</h2>
        {address && (
          <button
            type="button"
            onClick={disconnect}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
          >
            {shortAddr(address)} · disconnect
          </button>
        )}
      </div>

      {address ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a comment"
            rows={3}
            className="w-full bg-[#141111] border border-zinc-800 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-zinc-600"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="button"
            onClick={post}
            disabled={!draft.trim() || busy}
            className="self-end text-[var(--accent-contrast)] text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:hover:translate-y-0"
            style={{ backgroundColor: "var(--accent-solid)" }}
          >
            {busy ? "Signing…" : "Post"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 my-2">
          <button
            type="button"
            onClick={connect}
            disabled={connecting}
            className="bg-[var(--accent)] hover:bg-[var(--accent-solid-hover)] text-[var(--accent-contrast)] font-medium px-4 py-2 rounded-xl transition-colors w-full h-10 disabled:opacity-60"
          >
            {connecting ? "Connecting…" : "Connect ansemchain wallet to comment"}
          </button>
          {walletError && <p className="text-xs text-red-400">{walletError}</p>}
        </div>
      )}

      {comments.length > 0 && (
        <div className="flex flex-col gap-4 mt-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-1 border-t border-white/[0.06] pt-3"
            >
              <div className="text-xs text-zinc-500 font-mono">{c.author}</div>
              <div className="text-sm text-zinc-300 whitespace-pre-wrap">
                {c.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
