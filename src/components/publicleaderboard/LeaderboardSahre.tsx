'use client';

import React from 'react';
import {
  Check,
  Copy,
  Share2,
  MessageCircle,
  Twitter,
  Link2,
} from 'lucide-react';

type LeaderboardSahreProps = {
  leaderboardName?: string;
  leaderboardCode?: string;
};

const LeaderboardSahre = ({
  leaderboardName = 'Lagos Gist TV',
  leaderboardCode = 'LGTV2026',
}: LeaderboardSahreProps) => {
  const [copied, setCopied] = React.useState(false);

  const leaderboardUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/leaderboard/${encodeURIComponent(
          leaderboardCode,
        )}`
      : `/leaderboard/${encodeURIComponent(leaderboardCode)}`;

  const shareText = `Check out the ${leaderboardName} leaderboard on REFCORE and see who is leading right now.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(leaderboardUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy leaderboard link:', error);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${leaderboardUrl}`,
    )}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(leaderboardUrl)}`;

    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="glass relative overflow-hidden rounded-[28px] border border-white/10 p-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] sm:p-8 lg:p-12">
          <div className="pointer-events-none absolute top-0 right-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl md:h-64 md:w-64 md:-mr-16 md:-mt-16" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl md:h-64 md:w-64 md:-ml-16 md:-mb-16" />

          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-(--neon-blue)/30 bg-(--neon-blue)/10">
              <Share2 className="size-7 text-(--neon-blue)" />
            </div>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Share This <span className="gradient-text">Leaderboard</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              Help your friends discover the contest and climb the ranks together.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 font-semibold text-white transition-all hover:bg-green-600 hover:shadow-[0_0_18px_rgba(34,197,94,0.35)]"
              >
                <MessageCircle className="size-5" />
                <span>Share on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleTwitterShare}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#1c1c26] px-6 py-3 font-semibold text-white transition-all hover:bg-[#232331]"
              >
                <Twitter className="size-5" />
                <span>Share on Twitter</span>
              </button>
            </div>

            <div className="mx-auto mt-6 max-w-xl">
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#13131a]/80 p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-transparent px-1 py-1">
                  <Link2 className="size-4 shrink-0 text-gray-500" />
                  <p className="truncate text-left text-sm text-gray-300">
                    {leaderboardUrl}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--neon-purple) px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-(--neon-purple)/80"
                >
                  {copied ? (
                    <>
                      <Check className="size-4" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSahre;