'use client';

import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Link2,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react';
import StatsCard from '../StatsCard';


type AnalyticsStatsProps = {
  totalParticipants: number;
  totalReferrals: number;
  validReferrals: number;
  averageReferralsPerParticipant: number;
  conversionRate: number;
  suspiciousReferrals: number;
  isContestActive?: boolean;
};

const AnalyticsStats = ({
  totalParticipants,
  totalReferrals,
  validReferrals,
  averageReferralsPerParticipant,
  conversionRate,
  suspiciousReferrals,
  isContestActive = true,
}: AnalyticsStatsProps) => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatsCard
        title="Total Participants"
        description="People who joined this contest"
        value={totalParticipants.toLocaleString()}
        info="Current contest"
        icon={Users}
        color="#00ff9d"
        locked={!isContestActive}
        lockedText="No active contest"
      />

      <StatsCard
        title="Total Referrals"
        description="All recorded referrals for this contest"
        value={totalReferrals.toLocaleString()}
        info="Live count"
        icon={Link2}
        color="#00d0ff"
        locked={!isContestActive}
        lockedText="No active contest"
      />

      <StatsCard
        title="Valid Referrals"
        description="Referrals that passed validation"
        value={validReferrals.toLocaleString()}
        info={
          totalReferrals > 0
            ? `${Math.round((validReferrals / totalReferrals) * 100)}% valid`
            : '0% valid'
        }
        icon={CheckCircle2}
        color="#22c55e"
        locked={!isContestActive}
        lockedText="No active contest"
      />

      <StatsCard
        title="Avg. Referrals Per Participant"
        description="Average referral output per participant"
        value={averageReferralsPerParticipant.toFixed(1)}
        info="Contest average"
        icon={BarChart3}
        color="#b700ff"
        locked={!isContestActive}
        lockedText="No active contest"
      />

      <StatsCard
        title="Conversion Rate"
        description="Share of joins turning into referrals"
        value={`${conversionRate.toFixed(1)}%`}
        info="Performance"
        icon={TrendingUp}
        color="#f59e0b"
        locked={!isContestActive}
        lockedText="No active contest"
      />

      <StatsCard
        title="Suspicious Referrals"
        description="Flagged attempts needing review"
        value={suspiciousReferrals.toLocaleString()}
        info={suspiciousReferrals > 0 ? 'Needs attention' : 'All clear'}
        icon={ShieldAlert}
        color="#ef4444"
        locked={!isContestActive}
        lockedText="No active contest"
      />
    </section>
  );
};

export default AnalyticsStats;