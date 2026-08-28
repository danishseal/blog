import { sha256 } from "@cosmjs/crypto";
import { toBase64, toUtf8 } from "@cosmjs/encoding";

/**
 * The exact string the wallet signs. Binding the server nonce keeps each
 * signature single-use; binding a hash of the text keeps the signature tied to
 * this specific comment. Client and server build it identically.
 */
export function challengeMessage(nonce: string, text: string): string {
  const digest = toBase64(sha256(toUtf8(text)));
  return [
    "ansemchain blog comment",
    `nonce: ${nonce}`,
    `text-sha256: ${digest}`,
  ].join("\n");
}
