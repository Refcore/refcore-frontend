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

type LeaderboardContentProps = {
  queryParams: LeaderboardQueryParams;
  showPagination: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageChange: (page: number) => void;
};

const CurrentContestLeaderboardContent = ({
  queryParams,
  showPagination,
  onPreviousPage,
  onNextPage,
  onPageChange,
}: LeaderboardContentProps) => {
  const { data: contestsData } = useGetMyContests({ status: 'active' });

  const activeContestId = contestsData?.[0]?.id ?? null;

  const currentContestLeaderboard = useGetCurrentContestLeaderboard(
    activeContestId,
    queryParams,
  );

  const leaderboardData = currentContestLeaderboard.data;

  return (
    <>
      <LeaderboardSummary summary={leaderboardData?.summary} />

      <AdminLeaderboardTable
        currentPage={leaderboardData?.pagination.page ?? 1}
        totalPages={leaderboardData?.pagination.total_pages ?? 1}
        canPreviousPage={(leaderboardData?.pagination.page ?? 1) > 1}
        canNextPage={
          (leaderboardData?.pagination.page ?? 1) <
          (leaderboardData?.pagination.total_pages ?? 1)
        }
        leaderboard={leaderboardData?.leaderboard ?? []}
        isLoading={currentContestLeaderboard.isLoading}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onPageChange={onPageChange}
        showPagination={showPagination}
      />
    </>
  );
};

const AllTimeLeaderboardContent = ({
  queryParams,
  showPagination,
  onPreviousPage,
  onNextPage,
  onPageChange,
}: LeaderboardContentProps) => {
  const allTimeLeaderboard = useGetAllTimeLeaderboard(queryParams);

  const leaderboardData = allTimeLeaderboard.data;

  return (
    <>
      <LeaderboardSummary summary={leaderboardData?.summary} />

      <AdminLeaderboardTable
        currentPage={leaderboardData?.pagination.page ?? 1}
        totalPages={leaderboardData?.pagination.total_pages ?? 1}
        canPreviousPage={(leaderboardData?.pagination.page ?? 1) > 1}
        canNextPage={
          (leaderboardData?.pagination.page ?? 1) <
          (leaderboardData?.pagination.total_pages ?? 1)
        }
        leaderboard={leaderboardData?.leaderboard ?? []}
        isLoading={allTimeLeaderboard.isLoading}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onPageChange={onPageChange}
        showPagination={showPagination}
      />
    </>
  );
};

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('currentContest');

  const [search, setSearch] = useState('');
  const [range, setRange] = useState<LeaderboardRange>('top10');
  const [sort, setSort] = useState<LeaderboardSort>('referrals_desc');
  const [page, setPage] = useState(1);

  const queryParams: LeaderboardQueryParams = useMemo(() => {
    return {
      page,
      limit: 20,
      search,
      range,
      sort,
    };
  }, [page, search, range, sort]);

  const showPagination = range === 'all';

  return (
    <div className="relative m-3 mb-10 space-y-6 lg:m-6">
      <PageHeader title="Leaderboard" description="Here is your Leaderboard" />

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

      {activeTab === 'currentContest' ? (
        <CurrentContestLeaderboardContent
          queryParams={queryParams}
          showPagination={showPagination}
          onPreviousPage={() => {
            setPage((prev) => Math.max(prev - 1, 1));
          }}
          onNextPage={() => {
            setPage((prev) => prev + 1);
          }}
          onPageChange={(selectedPage) => {
            setPage(selectedPage);
          }}
        />
      ) : (
        <AllTimeLeaderboardContent
          queryParams={queryParams}
          showPagination={showPagination}
          onPreviousPage={() => {
            setPage((prev) => Math.max(prev - 1, 1));
          }}
          onNextPage={() => {
            setPage((prev) => prev + 1);
          }}
          onPageChange={(selectedPage) => {
            setPage(selectedPage);
          }}
        />
      )}
    </div>
  );
};

export default LeaderboardPage;
