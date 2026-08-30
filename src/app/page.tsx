import Image from "next/image";
import Link from "next/link";
import { POSTS } from "@/lib/posts";

/**
 * The front page: the masthead and the posts, newest last the way a thread
 * reads. Server-rendered; the interactive chrome lives on the posts.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#141111] text-white selection:bg-[#6cef4b]/30 font-sans">
      <main className="mx-auto max-w-2xl px-5 pb-24 pt-16 sm:pt-24">
        <header className="mb-10">
          <div className="flex items-baseline gap-3">
            <h1 className="text-[1.6rem] font-bold tracking-tight">ansemchain</h1>
            <span className="font-mono text-sm text-[#6cef4b]">blog</span>
          </div>
          <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-white/60">
            Writing from ansemchain on fair launches, Horns, the bridge, and
            the culture we are building.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/blog-hero.png"
            alt=""
            width={1920}
            height={987}
            priority
            className="block h-auto w-full"
          />
        </div>

        <nav aria-label="Posts" className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {POSTS.map((p, i) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex items-baseline gap-5 py-6 outline-none focus-visible:ring-2 focus-visible:ring-[#6cef4b]/60"
            >
              <span className="font-mono text-sm tabular-nums text-[#6cef4b]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-bold leading-snug tracking-tight transition-colors group-hover:text-[#6cef4b]">
                  {p.title}
                </span>
                <span className="mt-1.5 block text-[0.9rem] leading-relaxed text-white/55">
                  {p.sub}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="self-center text-white/30 transition-all group-hover:translate-x-0.5 group-hover:text-[#6cef4b]"
              >
                →
              </span>
            </Link>
          ))}
        </nav>

        <footer className="mt-10 flex items-center justify-between text-[0.8rem] text-white/40">
          <span className="font-mono">CHANSE is gas. ANSEM rides the bridge.</span>
          <a
            href="https://x.com/ansemchainfun"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white/80"
          >
            @ansemchainfun
          </a>
        </footer>
      </main>
    </div>
  );
}
