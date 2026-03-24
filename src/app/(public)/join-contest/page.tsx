import Image from 'next/image';
import {
  Check,
  Crown,
  Info,
} from 'lucide-react';

const inviter = {
  name: 'Sarah_J',
  phone: '+234****1234',
  referrals: 1240,
  rank: 1,
  badge: 'Top Performer',
  avatar:
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
};

// const leaderboardPreview = [
//   {
//     rank: 1,
//     name: 'Sarah_J',
//     phone: '+234****1234',
//     referrals: 1240,
//     avatar:
//       'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
//     accent: 'text-yellow-400 border-yellow-400',
//     badgeBg: 'from-yellow-400 to-yellow-600',
//   },
//   {
//     rank: 2,
//     name: 'Mike_W',
//     phone: '+234****5678',
//     referrals: 985,
//     avatar:
//       'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
//     accent: 'text-zinc-300 border-zinc-300',
//     badgeBg: 'from-zinc-300 to-zinc-500',
//   },
//   {
//     rank: 3,
//     name: 'Elena_R',
//     phone: '+234****9012',
//     referrals: 842,
//     avatar:
//       'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg',
//     accent: 'text-orange-400 border-orange-400',
//     badgeBg: 'from-orange-400 to-orange-600',
//   },
// ];

// const rewards = [
//   {
//     place: '1st Place',
//     amount: '₦50,000',
//     emoji: '🥇',
//     color: 'text-yellow-400 border-yellow-400/20',
//   },
//   {
//     place: '2nd Place',
//     amount: '₦30,000',
//     emoji: '🥈',
//     color: 'text-zinc-300 border-zinc-300/20',
//   },
//   {
//     place: '3rd Place',
//     amount: '₦20,000',
//     emoji: '🥉',
//     color: 'text-orange-400 border-orange-400/20',
//   },
// ];

// const stats = [
//   {
//     label: 'Active Participants',
//     value: '2,847',
//     icon: Users,
//     iconColor: 'text-cyan-400',
//     bg: 'bg-cyan-400/10 border-cyan-400/20',
//   },
//   {
//     label: 'Total Referrals',
//     value: '12,405',
//     icon: Link2,
//     iconColor: 'text-[#00ff9d]',
//     bg: 'bg-[#00ff9d]/10 border-[#00ff9d]/20',
//   },
//   {
//     label: 'Prize Pool',
//     value: '₦100K',
//     icon: Trophy,
//     iconColor: 'text-[#b700ff]',
//     bg: 'bg-[#b700ff]/10 border-[#b700ff]/20',
//   },
// ];

// const steps = [
//   {
//     number: 1,
//     title: 'Join',
//     description:
//       'Tap the button and send the prefilled JOIN message on WhatsApp to enter under this referral.',
//     icon: Sparkles,
//     accent: 'text-[#00ff9d] border-[#00ff9d]/20 bg-[#00ff9d]/10',
//   },
//   {
//     number: 2,
//     title: 'Get Your Link',
//     description:
//       'Once you join, you get your own referral code and link so you can start inviting others too.',
//     icon: Link2,
//     accent: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/10',
//   },
//   {
//     number: 3,
//     title: 'Climb & Win',
//     description:
//       'Every valid person who joins through you helps you move up the leaderboard and compete for rewards.',
//     icon: Trophy,
//     accent: 'text-[#b700ff] border-[#b700ff]/20 bg-[#b700ff]/10',
//   },
// ];

export default function JoinContestPage() {
  const whatsappHref = 'https://wa.me/2348000000000?text=JOIN%20SARAHJ001';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative flex h-full items-center px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-1/4 h-140 w-140 -translate-x-1/2 rounded-full bg-[#00ff9d]/10 blur-[140px]" />
        <div className="absolute bottom-20 right-[10%] h-72 w-72 rounded-full bg-[#b700ff]/10 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background via-background/70 to-transparent" />

        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 text-center">
            <div className="mb-4 text-6xl sm:text-7xl">🎉</div>

            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              You&apos;ve Been{' '}
              <span className="text-gradient-success">Invited!</span>
            </h1>

            <p className="mb-2 text-xl text-zinc-300 sm:text-2xl">
              <span className="font-bold text-[#00ff9d]">{inviter.name}</span>{' '}
              invited you to join
            </p>

            <p className="text-base text-zinc-400 sm:text-lg">
              Lagos Gist TV Referral Contest
            </p>
          </div>

          <div className="glass neon-green relative mx-auto mb-8 max-w-3xl overflow-hidden rounded-3xl border border-[#00ff9d]/20 p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#00ff9d]/5 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative shrink-0">
                <Image
                  src={inviter.avatar}
                  alt={inviter.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full border-4 border-[#00ff9d] object-cover shadow-[0_0_30px_rgba(0,255,157,0.35)]"
                />
                <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-linear-to-br from-yellow-400 to-yellow-600 text-sm font-black text-black shadow-[0_0_15px_rgba(250,204,21,0.6)]">
                  1
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="mb-2 flex flex-col items-center gap-2 sm:flex-row sm:items-center">
                  <h2 className="text-2xl font-bold">{inviter.name}</h2>

                  <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-400">
                    <Crown className="h-3.5 w-3.5" />
                    {inviter.badge}
                  </span>
                </div>

                <p className="mb-4 text-sm text-zinc-400">{inviter.phone}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-background/50 p-4">
                    <div className="mb-1 md:text-2xl font-bold text-[#00ff9d]">
                      {inviter.referrals.toLocaleString()}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-zinc-400">
                      Referrals
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-background/50 p-4">
                    <div className="mb-1 md:text-2xl font-bold text-yellow-400">
                      #{inviter.rank}
                    </div>
                    <div className="text-xs uppercase tracking-wide text-zinc-400">
                      Rank
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 border-t border-white/10 pt-6">
              <p className="flex items-center justify-center gap-2 text-center text-sm text-zinc-300">
                <Info className="h-4 w-4 text-cyan-400" />
                You are joining under a{' '}
                <span className="font-bold text-[#00ff9d]">
                  top-performing participant
                </span>
              </p>
            </div>
          </div>

          <div className="mb-14 text-center">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-linear-to-r from-green-500 to-green-600 px-8 py-5 text-lg font-bold text-white shadow-[0_0_40px_rgba(34,197,94,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(34,197,94,0.5)]"
            >
              <span className="text-2xl">💬</span>
              Join Contest on WhatsApp
            </a>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#00ff9d]" />
                Takes 10 seconds
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#00ff9d]" />
                No signup required
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#00ff9d]" />
                No spam
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
