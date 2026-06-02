'use client';

import Graph from '@/components/admin/dashboard/Graph';
import JoinsPerDayGraph from '@/components/admin/dashboard/JoinsPerDayGraph';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import TopPerformers from '@/components/admin/dashboard/TopPerformers';
import Stats from '@/components/admin/Stats';
import PageHeader from '@/components/shared/PageHeader';
import { useAdminLoading } from '@/hooks/admin/useAdminLoading';
import React from 'react';

const AdminDashboardPage = () => {
  const { data, active_contest, allTimeTopFive, notifications } =
    useAdminLoading();

  console.log('Active Contest:', active_contest);

  const activeContest = active_contest ?? null;

  const totalParticipants = data.total_participants;
  const totalReferrals = data.total_referrals;

  const topPerformers = allTimeTopFive.slice(0, 5);

  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of what youve been upto"
      />
      <Stats
        totalParticipants={totalParticipants}
        totalReferrals={totalReferrals}
        activeContest={activeContest}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Graph />
          <QuickActions activeContest={activeContest || null} />
          <JoinsPerDayGraph />
        </div>

        <div className="lg:w-80 space-y-6">
          <TopPerformers leaderboard={topPerformers} />
          <RecentActivity notifications={notifications} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
