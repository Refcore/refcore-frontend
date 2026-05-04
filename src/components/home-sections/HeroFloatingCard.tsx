'use client';

import Image from 'next/image';

const users = [
  {
    name: 'Sarah_J',
    score: 1240,
    rank: 1,
    progress: 100,
    src: '/images/userfemale.webp',
    badge: 'Top Performer',
  },
  {
    name: 'Mike_W',
    score: 985,
    rank: 2,
    progress: 85,
    src: '/images/usermale.webp',
    badge: 'Fast Climber',
  },
  {
    name: 'Cindy_R',
    score: 842,
    rank: 3,
    progress: 70,
    src: '/images/userfemale2.webp',
    badge: 'Reward Ready',
  },
];

const miniStats = [
  {
    label: 'Participants',
    value: '2,847',
  },
  {
    label: 'Valid Refs',
    value: '12,405',
  },
  {
    label: 'Blocked',
    value: '38',
  },
];

export default function HeroFloatingCard() {
  return (
    <div className="relative w-full md:w-fit mb-5 md:mb-0 animate-float">
      <div className="relative w-full md:min-w-lg md:max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-secondary/35 p-5 md:p-6 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        {/* soft background accents */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#b700ff]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[#00d0ff]/10 blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#00ff9d]/20 bg-[#00ff9d]/10 px-3 py-1 text-[11px] font-semibold text-[#00ff9d]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
                LIVE CONTEST
              </div>

              <h3 className="text-lg font-bold leading-tight md:text-xl">
                Whatsapp TV
              </h3>
              <p className="text-xs text-muted-foreground">
                March Referral Contest
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-background/50 px-3 py-2 text-right">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Total Refs
              </div>
              <div className="text-lg font-black text-[#00d0ff]">12,405</div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-5 grid grid-cols-3 gap-2">
            {miniStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/3 p-3"
              >
                <div className="text-sm font-bold">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard list */}
          <div className="space-y-3">
            {users.map((user, index) => (
              <div
                key={user.name}
                className={`relative flex items-center gap-3 overflow-hidden rounded-xl border bg-secondary/45 p-3 ${
                  user.rank === 1
                    ? 'border-[#b700ff]/25'
                    : 'border-white/10'
                } ${index > 1 ? 'hidden md:flex' : 'flex'}`}
              >
                {user.rank === 1 && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#b700ff]" />
                )}

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-black ${
                    user.rank === 1
                      ? 'bg-linear-to-br from-yellow-300 to-yellow-600'
                      : user.rank === 2
                        ? 'bg-linear-to-br from-gray-200 to-gray-500'
                        : 'bg-linear-to-br from-orange-300 to-orange-600'
                  }`}
                >
                  {user.rank}
                </div>

                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-muted">
                  <Image
                    alt={user.name}
                    fill
                    src={user.src}
                    sizes="40px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold">
                      {user.name}
                    </h4>

                    {user.rank === 1 && (
                      <span className="hidden rounded-full bg-yellow-400/10 px-2 py-0.5 text-[9px] font-bold text-yellow-300 md:inline">
                        {user.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#b700ff] to-[#00d0ff]"
                      style={{ width: `${user.progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black md:text-lg">
                    {user.score}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Refs</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating card - notification */}
      <div className="absolute -top-5 right-3 rounded-xl border border-[#00ff9d]/25 bg-background/75 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl md:-right-8 md:-top-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00ff9d]/15 text-sm">
            🔔
          </div>

          <div>
            <div className="text-[10px] text-muted-foreground">
              WhatsApp Alert
            </div>
            <div className="text-xs font-bold md:text-sm">+1 new join</div>
          </div>
        </div>
      </div>

      {/* Floating card - anti cheat */}
      <div className="absolute -bottom-4 left-3 rounded-xl border border-[#00d0ff]/25 bg-background/75 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl md:-left-10 md:bottom-12">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00d0ff]/15 text-sm">
            🛡️
          </div>

          <div>
            <div className="text-[10px] text-muted-foreground">
              Anti-cheat
            </div>
            <div className="text-xs font-bold md:text-sm">38 blocked</div>
          </div>
        </div>
      </div>

      {/* Floating card - desktop only */}
      <div className="absolute -right-10 bottom-20 hidden rounded-xl border border-[#b700ff]/25 bg-background/75 p-3 shadow-[0_12px_35px_rgba(0,0,0,0.35)] backdrop-blur-xl md:block">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#b700ff]/15 text-sm">
            📈
          </div>

          <div>
            <div className="text-[10px] text-muted-foreground">
              Growth boost
            </div>
            <div className="text-sm font-bold text-[#00ff9d]">+24%</div>
          </div>
        </div>
      </div>
    </div>
  );
}