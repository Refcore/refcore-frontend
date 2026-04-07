import React from 'react';
import { Trophy, Users, BarChart3, Clock3, type LucideIcon } from 'lucide-react';

type SummaryItem = {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
};

const leaderboardSummary: SummaryItem[] = [
  {
    title: 'Current Leader',
    value: 'NomsoTV',
    subtext: '+128 referrals',
    icon: Trophy,
  },
  {
    title: 'Participants',
    value: '1,248',
    subtext: 'Active this contest',
    icon: Users,
  },
  {
    title: 'Total Referrals',
    value: '8,932',
    subtext: 'Across visible records',
    icon: BarChart3,
  },
  {
    title: 'Contest Status',
    value: 'Live',
    subtext: 'Ends in 5 days',
    icon: Clock3,
  },
];

const LeaderboardSummary = () => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {leaderboardSummary.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-xl border-2 border-white/10 bg-white/5 p-5 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <h3 className="text-2xl font-semibold text-white">{item.value}</h3>
                <p className="text-xs text-muted-foreground">{item.subtext}</p>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/8">
                <Icon className="size-5 text-[#6EE7B7]" />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default LeaderboardSummary;