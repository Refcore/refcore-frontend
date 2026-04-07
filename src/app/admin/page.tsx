import Graph from '@/components/admin/dashboard/Graph';
import JoinsPerDayGraph from '@/components/admin/dashboard/JoinsPerDayGraph';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import TopPerformers from '@/components/admin/dashboard/TopPerformers';
import Stats from '@/components/admin/Stats';
import PageHeader from '@/components/shared/PageHeader';
import { mockLeaderboards } from '@/demo/leaderboarddata';
import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of what youve been upto"
      />
      <Stats />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Graph />
          <QuickActions />
          <JoinsPerDayGraph />
        </div>

        <div className="lg:w-80 space-y-6">
          <TopPerformers leaderboard={mockLeaderboards[0]} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
