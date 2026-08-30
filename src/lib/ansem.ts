"use client";

/**
 * Client-side ansemchain wallet access. Talks to the ansemchain browser
 * extension (injected at window.bwickWallet.cosmos) and falls back to any
 * Keplr/Leap-compatible wallet. All wallet identity on the blog flows through
 * here so the header and the comments share one connection.
 */

export const CHAIN_ID = "ansem-1";

/** Passed to a Keplr/Leap-style wallet so it can add ansem-1 on the fly. */
export const CHAIN_SUGGEST = {
  chainId: CHAIN_ID,
  chainName: "ANSEM",
  rpc: "http://rpc.ansemchain.fun:26657",
  rest: "http://rest.ansemchain.fun:1317",
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: "ansem",
    bech32PrefixAccPub: "ansempub",
    bech32PrefixValAddr: "ansemvaloper",
    bech32PrefixValPub: "ansemvaloperpub",
    bech32PrefixConsAddr: "ansemvalcons",
    bech32PrefixConsPub: "ansemvalconspub",
  },
  currencies: [
    { coinDenom: "CHANSE", coinMinimalDenom: "uchanse", coinDecimals: 6 },
  ],
  feeCurrencies: [
    {
      coinDenom: "CHANSE",
      coinMinimalDenom: "uchanse",
      coinDecimals: 6,
      gasPriceStep: { low: 0.01, average: 0.025, high: 0.04 },
    },
  ],
  stakeCurrency: {
    coinDenom: "CHANSE",
    coinMinimalDenom: "uchanse",
    coinDecimals: 6,
  },
};

export type StdSignature = {
  pub_key: { type: string; value: string };
  signature: string;
};

export type CosmosProvider = {
  experimentalSuggestChain?: (info: unknown) => Promise<void>;
  enable: (chainId: string) => Promise<void>;
  getKey: (
    chainId: string,
  ) => Promise<{ bech32Address: string; name?: string }>;
  signArbitrary?: (
    chainId: string,
    signer: string,
    data: string | Uint8Array,
  ) => Promise<StdSignature>;
};

/** The ansemchain wallet first, then any Keplr-compatible fallback. */
export function getProvider(): CosmosProvider | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    bwickWallet?: { cosmos?: CosmosProvider };
    keplr?: CosmosProvider;
    leap?: CosmosProvider;
  };
  return w.bwickWallet?.cosmos ?? w.keplr ?? w.leap ?? null;
}

export const shortAddr = (addr: string) =>
  addr.length > 14 ? `${addr.slice(0, 8)}..${addr.slice(-4)}` : addr;

export type Connected = { address: string };

/** Suggest the chain (best-effort), request permission, read the address. */
export async function connectWallet(): Promise<Connected> {
  const provider = getProvider();
  if (!provider) {
    throw new Error(
      "No ansemchain wallet found. Install the ansemchain extension to continue.",
    );
  }
  if (provider.experimentalSuggestChain) {
    try {
      await provider.experimentalSuggestChain(CHAIN_SUGGEST);
    } catch {
      // The ansemchain extension already ships ansem-1 and may reject suggest.
    }
  }
  await provider.enable(CHAIN_ID);
  const key = await provider.getKey(CHAIN_ID);
  return { address: key.bech32Address };
}

/**
 * Sign an arbitrary message (ADR-036) with the connected account and return
 * the base64 signature plus the base64 secp256k1 public key. The server
 * re-derives the address from the public key and verifies the signature, so a
 * comment cannot be posted under an address the sender does not control.
 */
export async function signMessage(
  address: string,
  message: string,
): Promise<{ signature: string; pubKey: string }> {
  const provider = getProvider();
  if (!provider?.signArbitrary) {
    throw new Error(
      "This wallet cannot sign messages. Update the ansemchain extension (or use Keplr/Leap) to comment.",
    );
  }
  const res = await provider.signArbitrary(CHAIN_ID, address, message);
  return { signature: res.signature, pubKey: res.pub_key.value };
}
