import { NextResponse } from "next/server";
import { issueNonce } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Hand the client a one-time nonce to fold into the message it signs. */
export async function GET() {
  const nonce = await issueNonce();
  return NextResponse.json({ nonce });
}
