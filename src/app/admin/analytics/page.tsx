'use client';

import AnalyticsCharts from '@/components/admin/analytics/AnalyticsCharts';
import AnalyticsStats from '@/components/admin/analytics/AnalyticsStats';
import ReferralHealth from '@/components/admin/analytics/ReferralHealth';
import TopContributors from '@/components/admin/analytics/TopContributors';
import IconLoader from '@/components/shared/IconLoader';
import PageHeader from '@/components/shared/PageHeader';
import { useAnalyticsLoading } from '@/hooks/admin/useAnalyticsLoading';
import { ChartColumnBig } from 'lucide-react';
import React from 'react';

const AnalyticsPage = () => {
  const { data, is_contest_active, isLoading } = useAnalyticsLoading();

  const valid = data?.valid_referrals + data.became_participant_referrals;

  return (
    <div className="relative m-3 mb-10 space-y-6 lg:m-6">
      <PageHeader
        title="Analytics"
        description="Overview of how your contest is performing"
      />

      {isLoading ? (
        <IconLoader>
          <ChartColumnBig />
        </IconLoader>
      ) : (
        <AnalyticsStats
          totalParticipants={data.total_participants}
          totalReferrals={data.total_referrals}
          validReferrals={valid}
          averageReferralsPerParticipant={
            data.average_referrals_per_participant
          }
          conversionRate={data.conversion_rate}
          suspiciousReferrals={data.flagged_referrals}
          isContestActive={is_contest_active}
        />
      )}

      <AnalyticsCharts />
      <ReferralHealth isContestActive={is_contest_active} />
      <TopContributors isContestActive={is_contest_active} />
    </div>
  );
};

export default AnalyticsPage;
