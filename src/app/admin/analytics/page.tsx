'use client';

import AnalyticsCharts from '@/components/admin/analytics/AnalyticsCharts';
import AnalyticsStats from '@/components/admin/analytics/AnalyticsStats';
import ReferralHealth from '@/components/admin/analytics/ReferralHealth';
import TopContributors from '@/components/admin/analytics/TopContributors';
import PageHeader from '@/components/shared/PageHeader';
import { useAnalyticsContest } from '@/hooks/admin/useAnalythicsContest';
import { useAnalyticsLoading } from '@/hooks/admin/useAnalyticsLoading';
import React from 'react';

const AnalyticsContent = ({ contest_id }: { contest_id: string }) => {
  const {
    data,
    isLoading,
    referrals,
    participants,
    top_contributors,
    leaderboard_summary,
  } = useAnalyticsLoading(contest_id);

  const valid = data.valid_referrals + data.became_participant_referrals;
  const totalParticipants = data.total_participants;
  const totalReferrals = data.total_referrals;
  const validReferrals = data.valid_referrals;
  const becameParticipantReferrals = data.became_participant_referrals;
  const flaggedReferrals = data.flagged_referrals;
  const blockedReferrals = data.blocked_referrals;
  const averageReferralsPerParticipant = data.average_referrals_per_participant;
  const conversionRate = data.conversion_rate;
  const suspiciousReferrals = data.suspicious_referrals;

  console.log(leaderboard_summary);

  return (
    <>
      <AnalyticsStats
        totalParticipants={totalParticipants}
        totalReferrals={totalReferrals}
        validReferrals={valid}
        averageReferralsPerParticipant={averageReferralsPerParticipant}
        conversionRate={conversionRate}
        suspiciousReferrals={suspiciousReferrals}
        isContestActive={true}
        isLoading={isLoading}
      />

      <AnalyticsCharts referrals={referrals} participants={participants} />
      <ReferralHealth
        isContestActive={true}
        isLoading={isLoading}
        validReferrals={validReferrals}
        becameParticipantReferrals={becameParticipantReferrals}
        flaggedReferrals={flaggedReferrals}
        blockedReferrals={blockedReferrals}
        totalReferrals={totalReferrals}
      />
      <TopContributors
        isContestActive={true}
        isLoading={isLoading}
        contributors={top_contributors}
        totalReferrals={leaderboard_summary?.total_referrals ?? 0}
      />
    </>
  );
};

const AnalyticsPage = () => {
  const { active_contest_id, isLoading, active_contest } =
    useAnalyticsContest();

  if (isLoading) {
    return (
      <div className="relative m-3 mb-10 space-y-6 lg:m-6">
        <PageHeader
          title="Analytics"
          description="loading your contest analytics..."
        />
      </div>
    );
  }

  if (!active_contest_id) {
    return (
      <div className="relative m-3 mb-10 space-y-6 lg:m-6">
        <PageHeader
          title="Analytics"
          description="Overview of how your contest is performing"
        />

        <AnalyticsStats
          totalParticipants={0}
          totalReferrals={0}
          validReferrals={0}
          averageReferralsPerParticipant={0}
          conversionRate={0}
          suspiciousReferrals={0}
          isContestActive={false}
        />

        <ReferralHealth isContestActive={false} />
        <TopContributors isContestActive={false} />
      </div>
    );
  }

  return (
    <div className="relative m-3 mb-10 space-y-6 lg:m-6">
      <PageHeader
        title="Analytics"
        description={`Overview of how your contest "${active_contest?.title}" is performing`}
      />

      <AnalyticsContent contest_id={active_contest_id} />
    </div>
  );
};

export default AnalyticsPage;
