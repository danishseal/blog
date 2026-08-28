import { NextRequest, NextResponse } from "next/server";
import { getComments, addComment, consumeNonce } from "@/lib/store";
import { verifySignature } from "@/lib/ansemVerify";
import { challengeMessage } from "@/lib/challenge";

export const dynamic = "force-dynamic";

/** A bech32 ansemchain account address, e.g. ansem1q...a. */
const ANSEM_ADDR = /^ansem1[02-9ac-hj-np-z]{38,}$/;

const short = (addr: string) => `${addr.slice(0, 8)}..${addr.slice(-4)}`;

export async function GET() {
  return NextResponse.json({ comments: await getComments() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const address = String(body.address ?? "").trim();
  const pubKey = String(body.pubKey ?? "");
  const signature = String(body.signature ?? "");
  const nonce = String(body.nonce ?? "");
  const text = String(body.text ?? "").trim();

  if (!ANSEM_ADDR.test(address)) {
    return NextResponse.json(
      { error: "connect an ansemchain wallet to comment" },
      { status: 401 },
    );
  }
  if (!text) return NextResponse.json({ error: "empty comment" }, { status: 400 });
  if (text.length > 2000) {
    return NextResponse.json({ error: "comment too long" }, { status: 400 });
  }

  // Spend the nonce first so a captured request cannot be replayed.
  if (!(await consumeNonce(nonce))) {
    return NextResponse.json(
      { error: "challenge expired, try again" },
      { status: 401 },
    );
  }

  const ok = await verifySignature({
    address,
    pubKey,
    signature,
    message: challengeMessage(nonce, text),
  });
  if (!ok) {
    return NextResponse.json(
      { error: "signature did not verify" },
      { status: 401 },
    );
  }

  const comment = await addComment({
    id: crypto.randomUUID(),
    author: short(address),
    text,
    ts: Date.now(),
  });
  return NextResponse.json({ comment });
}
