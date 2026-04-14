import AnalyticsCharts from '@/components/admin/analytics/AnalyticsCharts';
import AnalyticsStats from '@/components/admin/analytics/AnalyticsStats';
import ReferralHealth from '@/components/admin/analytics/ReferralHealth';
import TopContributors from '@/components/admin/analytics/TopContributors';
import PageHeader from '@/components/shared/PageHeader';
import React from 'react';

const AnalyticsPage = () => {
  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader
        title="Analytics"
        description="Overview of how your contest is performing"
      />{' '}
      <AnalyticsStats
        totalParticipants={2847}
        totalReferrals={12405}
        validReferrals={11892}
        averageReferralsPerParticipant={4.2}
        conversionRate={68.4}
        suspiciousReferrals={27}
        isContestActive={true}
      />
      <AnalyticsCharts />
      <ReferralHealth isContestActive={true} />
      <TopContributors isContestActive={true} />
    </div>
  );
};

export default AnalyticsPage;
