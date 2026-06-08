'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  isLoading?: boolean;
};

const AnalyticsStats = ({
  totalParticipants,
  totalReferrals,
  validReferrals,
  averageReferralsPerParticipant,
  conversionRate,
  suspiciousReferrals,
  isContestActive = true,
  isLoading = false,
}: AnalyticsStatsProps) => {
  const initialValuesRef = useRef({
    totalParticipants,
    totalReferrals,
    validReferrals,
    averageReferralsPerParticipant,
    conversionRate,
    suspiciousReferrals,
  });

  const [loadedCards, setLoadedCards] = useState({
    totalParticipants: false,
    totalReferrals: false,
    validReferrals: false,
    averageReferralsPerParticipant: false,
    conversionRate: false,
    suspiciousReferrals: false,
  });

  useEffect(() => {
    const initialValues = initialValuesRef.current;

    setLoadedCards((previousState) => ({
      totalParticipants:
        previousState.totalParticipants ||
        !isLoading ||
        totalParticipants !== initialValues.totalParticipants,

      totalReferrals:
        previousState.totalReferrals ||
        !isLoading ||
        totalReferrals !== initialValues.totalReferrals,

      validReferrals:
        previousState.validReferrals ||
        !isLoading ||
        validReferrals !== initialValues.validReferrals,

      averageReferralsPerParticipant:
        previousState.averageReferralsPerParticipant ||
        !isLoading ||
        averageReferralsPerParticipant !==
          initialValues.averageReferralsPerParticipant,

      conversionRate:
        previousState.conversionRate ||
        !isLoading ||
        conversionRate !== initialValues.conversionRate,

      suspiciousReferrals:
        previousState.suspiciousReferrals ||
        !isLoading ||
        suspiciousReferrals !== initialValues.suspiciousReferrals,
    }));
  }, [
    totalParticipants,
    totalReferrals,
    validReferrals,
    averageReferralsPerParticipant,
    conversionRate,
    suspiciousReferrals,
    isLoading,
  ]);

  const cardLoadingState = useMemo(() => {
    return {
      totalParticipants: isLoading && !loadedCards.totalParticipants,
      totalReferrals: isLoading && !loadedCards.totalReferrals,
      validReferrals: isLoading && !loadedCards.validReferrals,
      averageReferralsPerParticipant:
        isLoading && !loadedCards.averageReferralsPerParticipant,
      conversionRate: isLoading && !loadedCards.conversionRate,
      suspiciousReferrals: isLoading && !loadedCards.suspiciousReferrals,
    };
  }, [isLoading, loadedCards]);

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
        isLoading={cardLoadingState.totalParticipants}
        loadingText="Loading participants"
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
        isLoading={cardLoadingState.totalReferrals}
        loadingText="Loading referrals"
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
        isLoading={cardLoadingState.validReferrals}
        loadingText="Loading valid referrals"
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
        isLoading={cardLoadingState.averageReferralsPerParticipant}
        loadingText="Loading average"
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
        isLoading={cardLoadingState.conversionRate}
        loadingText="Loading conversion"
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
        isLoading={cardLoadingState.suspiciousReferrals}
        loadingText="Loading suspicious referrals"
      />
    </section>
  );
};

export default AnalyticsStats;
