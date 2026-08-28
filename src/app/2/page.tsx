"use client";

import { MessageCircle, Search, Share2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Comments from "@/components/Comments";
import SearchModal from "@/components/SearchModal";
import { useWallet } from "@/components/WalletProvider";
import { shortAddr } from "@/lib/ansem";

export default function BlogPage() {
  const { address, connecting, connect, disconnect } = useWallet();
  const [shared, setShared] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const onSignIn = () => {
    if (connecting) return;
    address ? disconnect() : connect();
  };
  const scrollToId = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    } catch {}
  };
  return (
    <div className="min-h-screen bg-[#141111] text-white selection:bg-[#6cef4b]/30 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-transparent z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="relative hidden md:flex items-center gap-2 h-10 px-4 cursor-pointer text-sm group w-[240px]"
            style={{
              borderRadius: "calc(0.5rem + 8px)",
              color: "hsl(0 0% 80%)",
            }}
            aria-label="Search posts"
          >
            {/* Liquid Glass Visual Layers */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                borderRadius: "inherit",
                boxShadow:
                  "0 2px 4px rgba(0, 0, 0, 0.08), 0 0 8px rgba(0, 0, 0, 0.04)",
                transformOrigin: "50% 50%",
                transform: "scaleX(1.00003) scaleY(1.00019)",
              }}
            >
              {/* Glass Effect Layer with Backdrop Filter */}
              <div
                className="absolute inset-0"
                style={{
                  zIndex: 0,
                  backdropFilter: "blur(1px) saturate(120%)",
                  WebkitBackdropFilter: "blur(1px) saturate(120%)",
                  isolation: "isolate",
                  borderRadius: "inherit",
                }}
              />
              {/* Tint Layer */}
              <div
                className="absolute inset-0"
                style={{
                  zIndex: 1,
                  background: "#1c1817",
                  borderRadius: "inherit",
                }}
              />
              {/* Shine Layer */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  zIndex: 2,
                  boxShadow:
                    "inset 0 0 0 1px hsl(30 8% 18% / 0.4), inset 1px 1px 0 0 rgba(255, 255, 255, 0.1)",
                  borderRadius: "inherit",
                }}
              />
            </div>

            {/* Content Layer */}
            <div
              className="relative flex items-center w-full h-full"
              style={{ zIndex: 3 }}
            >
              <Search className="h-4 w-4 shrink-0 mr-2" aria-hidden="true" />
              <span className="flex-1 text-left">Search...</span>
            </div>
          </button>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 opacity-70">
          <button
            type="button"
            className="relative flex items-center gap-2 px-4 py-2 cursor-pointer hover:text-white transition-colors"
            style={{
              borderRadius: "9999px",
              color: "hsl(0 0% 80%)",
            }}
          >
            {/* Liquid Glass Visual Layers */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                borderRadius: "inherit",
                boxShadow:
                  "0 2px 4px rgba(0, 0, 0, 0.08), 0 0 8px rgba(0, 0, 0, 0.04)",
                transformOrigin: "50% 50%",
                transform: "scaleX(1.00003) scaleY(1.00019)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  zIndex: 0,
                  backdropFilter: "blur(1px) saturate(120%)",
                  WebkitBackdropFilter: "blur(1px) saturate(120%)",
                  isolation: "isolate",
                  borderRadius: "inherit",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  zIndex: 1,
                  background: "#1c1817",
                  borderRadius: "inherit",
                }}
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  zIndex: 2,
                  boxShadow:
                    "inset 0 0 0 1px hsl(30 8% 18% / 0.4), inset 1px 1px 0 0 rgba(255, 255, 255, 0.1)",
                  borderRadius: "inherit",
                }}
              />
            </div>

            {/* Content Layer */}
            <div className="relative" style={{ zIndex: 3 }}>
              <span className="text-sm font-semibold tracking-tight text-white">
                ansemchain
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Sign In Button */}
          <button
            type="button"
            onClick={onSignIn}
            className="text-[var(--accent-contrast)] text-sm font-medium px-5 py-2 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-lg hover:opacity-90"
            style={{
              backgroundColor: "var(--accent-solid)",
              boxShadow: "0 10px 15px -3px rgba(108, 239, 75, 0.2)",
            }}
          >
            {connecting ? "Connecting…" : address ? shortAddr(address) : "Sign in"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-4 w-full max-w-[1000px] mx-auto px-4 sm:px-8 md:px-12">
        {/* Hero Image */}
        <div className="w-full aspect-[2/1] bg-[#0a0a0a] rounded-2xl mb-12 relative overflow-hidden shadow-2xl shadow-black/40 group">
          <Image
            src="/blog-hero.png"
            alt="ansemchain"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Title Block */}
        <div className="mb-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-3xl font-bold tracking-tight leading-[1.1] sm:whitespace-normal">
              Horns and a feed that is actually yours
            </h1>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => scrollToId("comments")}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors border border-zinc-800 text-white bg-[#1c1817] hover:bg-zinc-800 hover:text-white h-10 w-10"
                aria-label="Jump to comments"
              >
                <div className="relative">
                  <MessageCircle className="h-4 w-4" />
                </div>
              </button>
              <button
                type="button"
                onClick={onShare}
                className="flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors border border-zinc-800 text-white bg-[#1c1817] hover:bg-zinc-800 hover:text-white h-10 px-4 py-2 gap-2 w-fit"
                aria-label="Share this post"
              >
                <Share2 className="h-4 w-4" />
                <span>{shared ? "Copied" : "Share"}</span>
              </button>
            </div>
          </div>

          <p className="text-xl text-zinc-400 font-light">
            Rewards that come from real trading, and a social feed the community
            owns instead of rents.
          </p>
        </div>

        {/* Article Body */}
        <article className="prose prose-invert prose-lg max-w-3xl mx-auto text-zinc-300 leading-relaxed">
          <p className="mb-6">
            The last post laid out the base rules. Fair launches, a fixed
            supply, fees that stay in the ecosystem, and a treasury the
            community directs. That is the floor everything else is built on.
            This one is about what we built on top of it: Horns, which route a
            slice of real trading back to the people who stake, and a social
            layer where the record of who said what is yours, not a company&apos;s.
          </p>

          <p className="mb-12">
            Both come from the same idea. The people who show up and stay should
            be the ones who benefit and the ones who steer. Not a team, not a
            platform, not whoever moved fastest on launch day.
          </p>

          <hr className="my-8 border-white/[0.08]" />

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            Horns: rewards from real trading
          </h2>

          <p className="mb-6">
            Post one established that fees stay in the ecosystem instead of being
            skimmed by a team. Horns are the next step. They take a slice of that
            trading and route it back to the holders who stake.
          </p>

          <p className="mb-6">
            A Horn is a v4-style hook on the graduation AMM. When a coin
            graduates from its bonding curve to the automated market, its creator
            can bolt on a Horn. The most direct one skims a slice of every swap
            fee into the Horn Vault, where ANSEM and CHANSE stakers earn it. It
            accrues every block, pro-rata to your stake. Real trading becomes real
            yield for the people who hold and stake, not for a team.
          </p>

          <blockquote className="border-l-2 border-[var(--accent)] pl-6 my-8 italic text-zinc-400">
            By default the skim is a fraction of each swap&apos;s fee, 20% of it,
            split evenly between the ANSEM and CHANSE staker sinks. The trading
            was already happening. Now a piece of it lands on the people who stay.
          </blockquote>

          <p className="mb-6">
            A Horn does not have to reward. It can reshape the pool instead, or
            alongside. Fee Decay starts a graduated pool at a high fee that decays
            down to the base rate, so the snipers who rush the first blocks pay the
            most and everyone who arrives after pays normal. Dynamic Fee reacts to
            conditions rather than sitting at a flat rate.
          </p>

          <p className="mb-6">
            There is a wider catalog a creator can attach: an oracle-arb Horn, a
            StableSwap curve, an am-AMM fee auction, an anti-sandwich same-block
            surcharge, and more. The point is that the pool&apos;s behavior is a
            choice made once, out in the open, not a lever someone reaches for
            later.
          </p>

          <blockquote className="border-l-2 border-[var(--accent)] pl-6 my-8 italic text-zinc-400">
            A pool&apos;s Horn is set at graduation and is immutable after.
            Nobody can bolt a malicious hook onto a live pool later. What you see
            at graduation is what the pool is, for good.
          </blockquote>

          <p className="mb-12">
            To be straight about scope: this applies to coins that graduate from
            here on. Live on ansemchain today are the Horn Vault, the fee-share
            routing into it, and the Fee Decay and Dynamic Fee horns. The rest of
            the catalog is where this goes next.
          </p>

          <hr className="my-8 border-white/[0.08]" />

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            SocialFi: a feed that is actually yours
          </h2>

          <p className="mb-6">
            ansemchain has a social layer. A timeline where you post, like,
            repost, quote, follow people, keep a profile, and comment on tokens. A
            real feed for the whole chain, not a comment box bolted onto a chart.
            A memecoin community needs a town square, and this one is built in.
          </p>

          <p className="mb-6">
            Every action is signed by your wallet. Authorship is cryptographic,
            your signature, not a platform account that can be handed to someone
            else or taken from you. Your posts are provably yours, and a username
            is bound to your address rather than rented from a company.
          </p>

          <blockquote className="border-l-2 border-[var(--accent)] pl-6 my-8 italic text-zinc-400">
            Posting is free. Gas is sponsored, so you are not paying a fee to
            speak. The signature is what binds the content to you, not the payment.
          </blockquote>

          <p className="mb-6">
            Because it is signature-authenticated, the feed can live on-chain and
            be read straight out of the explorer. Authorship comes from the signer,
            not from whoever submitted the transaction. That is the line between a
            social app and SocialFi. The record is yours and verifiable, not a
            company&apos;s to sell, throttle, or delete.
          </p>

          <p className="mb-6">
            Honest about where this stands: the signed feed, post, like, repost,
            follow, and profile, is live in the app today. Anchoring it fully
            on-chain through the social contract is how it becomes SocialFi in the
            strong sense. We are not going to claim more than that.
          </p>

          <p className="mb-12">
            But the direction is the same one that runs through everything here. A
            community needs a place to talk that it owns, on the record, where the
            people who show up are the ones who shape it. Not a feed that belongs
            to whoever hosts it.
          </p>

          <hr className="my-8 border-white/[0.08]" />

          <h2 className="text-2xl font-bold text-white mt-12 mb-4">
            What is live
          </h2>

          <p className="mb-6">
            Live now: the Horn Vault, the fee-share routing that feeds it, and the
            Fee Decay and Dynamic Fee horns on graduated pools. The signed social
            feed is live in the app too, with posts, likes, reposts, follows, and
            profiles all bound to your wallet. The docs at{" "}
            <Link
              href="https://docs.ansemchain.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--accent)" }}
            >
              docs.ansemchain.fun
            </Link>{" "}
            cover the details.
          </p>

          <p className="mb-12">
            The direction from here is the rest of the Horn catalog and the feed
            anchored fully on-chain through the social contract. Same rule as
            always: the people who stay get the rewards, and the community steers,
            on the record.
          </p>

          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full mb-8 mt-12">
            {/* Comments Card */}
            <Comments />
          </div>
        </article>

        {/* Footer */}
        <footer className="mt-8 w-80 mx-auto flex flex-col justify-center pb-4">
          <nav
            aria-label="Discover ansemchain content"
            className="text-xs text-center text-[#cccccc] my-4 flex flex-row flex-nowrap gap-4 justify-center"
          >
            <Link
              href="https://ansemchain.fun/"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="https://docs.ansemchain.fun/"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Link
              href="https://x.com/ansemchainfun/"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 hover:text-white transition-colors"
            >
              Twitter
            </Link>
          </nav>
        </footer>
      </main>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
