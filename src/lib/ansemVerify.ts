/**
 * Server-side proof that a comment really comes from the ansemchain account it
 * claims. The client signs a one-time, server-issued challenge with its wallet
 * (ADR-036 signArbitrary). Here we:
 *   1. re-derive the bech32 address from the submitted secp256k1 public key,
 *   2. rebuild the exact ADR-036 sign document and verify the signature,
 * so the address, the public key, and the signature are all bound together.
 * The nonce store (see store.ts) guarantees each signature is used once.
 */
import {
  serializeSignDoc,
  rawSecp256k1PubkeyToRawAddress,
  type StdSignDoc,
} from "@cosmjs/amino";
import { Secp256k1, Secp256k1Signature, sha256 } from "@cosmjs/crypto";
import { fromBase64, toBase64, toBech32, toUtf8 } from "@cosmjs/encoding";

const PREFIX = "ansem";

/** The canonical ADR-036 sign doc for an arbitrary string message. */
function adr36SignDoc(signer: string, message: string): StdSignDoc {
  return {
    chain_id: "",
    account_number: "0",
    sequence: "0",
    fee: { gas: "0", amount: [] },
    msgs: [
      {
        type: "sign/MsgSignData",
        value: { signer, data: toBase64(toUtf8(message)) },
      },
    ],
    memo: "",
  };
}

/** Bech32 ansem address derived from a base64 secp256k1 pubkey, or null. */
export function addressFromPubKey(pubKeyB64: string): string | null {
  try {
    const pubkey = fromBase64(pubKeyB64);
    if (pubkey.length !== 33) return null; // compressed secp256k1
    return toBech32(PREFIX, rawSecp256k1PubkeyToRawAddress(pubkey));
  } catch {
    return null;
  }
}

/**
 * Verify that `signature` is a valid ADR-036 signature of `message` by the
 * account `address`, using the provided public key. Returns true only when the
 * pubkey derives `address` and the signature checks out.
 */
export async function verifySignature(params: {
  address: string;
  pubKey: string;
  signature: string;
  message: string;
}): Promise<boolean> {
  const { address, pubKey, signature, message } = params;
  try {
    if (addressFromPubKey(pubKey) !== address) return false;
    const signBytes = sha256(serializeSignDoc(adr36SignDoc(address, message)));
    const sig = Secp256k1Signature.fromFixedLength(fromBase64(signature));
    return await Secp256k1.verifySignature(sig, signBytes, fromBase64(pubKey));
  } catch {
    return false;
  }
}
