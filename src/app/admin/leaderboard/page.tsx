import AdminLeaderboardTable from '@/components/admin/leaderboard/AdminLeaderboardTable';
import LeaderboardControls from '@/components/admin/leaderboard/AdminLeaderboardControls';
import LeaderboardSummary from '@/components/admin/leaderboard/LeaderboardSummary';
import PageHeader from '@/components/shared/PageHeader';
import { mockLeaderboards } from '@/demo/leaderboarddata';
import React from 'react';

const LeaderboardPage = () => {
  return (
    <div className="m-3 mb-10 lg:m-6 relative space-y-6">
      <PageHeader title="Leaderboard" description="Here is your Leaderboard" />
      <LeaderboardSummary />
      <LeaderboardControls />
      <AdminLeaderboardTable leaderboard={mockLeaderboards[0]} />
    </div>
  );
};

export default LeaderboardPage;
