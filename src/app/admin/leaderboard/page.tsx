'use client';

import AdminLeaderboardTable from '@/components/admin/leaderboard/AdminLeaderboardTable';
import LeaderboardControls from '@/components/admin/leaderboard/AdminLeaderboardControls';
import LeaderboardSummary from '@/components/admin/leaderboard/LeaderboardSummary';
import PageHeader from '@/components/shared/PageHeader';
import type {
  LeaderboardQueryParams,
  LeaderboardRange,
  LeaderboardSort,
} from '@/types/leaderboard.type';
import React, { useMemo, useState } from 'react';
import { useGetCurrentContestLeaderboard } from '@/hooks/admin/leaderboard/useGetCurrentContestLeaderboard';
import { useGetAllTimeLeaderboard } from '@/hooks/admin/leaderboard/useGetAllTimeLeaderboard';
import { useGetMyContests } from '@/hooks/admin/contests/useGetMyContests';

type LeaderboardTab = 'currentContest' | 'allTime';

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('currentContest');

  const { data: contestsData } = useGetMyContests({ status: 'active' });

  const [search, setSearch] = useState('');
  const [range, setRange] = useState<LeaderboardRange>('top10');
  const [sort, setSort] = useState<LeaderboardSort>('referrals_desc');
  const [page, setPage] = useState(1);

  const activeContestId = contestsData?.[0]?.id ?? null;

  const queryParams: LeaderboardQueryParams = useMemo(() => {
    return {
      page,
      limit: 20,
      search,
      range,
      sort,
    };
  }, [page, search, range, sort]);

  const currentContestLeaderboard = useGetCurrentContestLeaderboard(
    activeContestId,
    queryParams,
  );

  const allTimeLeaderboard = useGetAllTimeLeaderboard(queryParams);

  const selectedLeaderboard =
    activeTab === 'currentContest'
      ? currentContestLeaderboard
      : allTimeLeaderboard;

  const leaderboardData = selectedLeaderboard.data;

  const showPagination = range === 'all';

  return (
    <div className="relative m-3 mb-10 space-y-6 lg:m-6">
      <PageHeader title="Leaderboard" description="Here is your Leaderboard" />

      <LeaderboardSummary summary={leaderboardData?.summary} />

      <LeaderboardControls
        activeTab={activeTab}
        onTabChange={(value) => {
          setActiveTab(value);
          setPage(1);
        }}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        range={range}
        onRangeChange={(value) => {
          setRange(value);
          setPage(1);
        }}
        sort={sort}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
      />

      <AdminLeaderboardTable
        currentPage={leaderboardData?.pagination.page ?? 1}
        totalPages={leaderboardData?.pagination.total_pages ?? 1}
        canPreviousPage={(leaderboardData?.pagination.page ?? 1) > 1}
        canNextPage={
          (leaderboardData?.pagination.page ?? 1) <
          (leaderboardData?.pagination.total_pages ?? 1)
        }
        leaderboard={leaderboardData?.leaderboard ?? []}
        isLoading={selectedLeaderboard.isLoading}
        onPreviousPage={() => {
          setPage((prev) => Math.max(prev - 1, 1));
        }}
        onNextPage={() => {
          setPage((prev) => prev + 1);
        }}
        showPagination={showPagination}
      />
    </div>
  );
};

export default LeaderboardPage;
