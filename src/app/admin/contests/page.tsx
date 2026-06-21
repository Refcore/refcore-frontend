'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { contestTabs } from '@/components/admin/contest/contestTabs';
import ContestCard from '@/components/admin/contest/ContestCard';
import { useGetMyContests } from '@/hooks/admin/contests/useGetMyContests';
import { useRouter } from 'next/navigation';
import { ADMIN_ROUTES } from '@/routes';
import IconLoader from '@/components/shared/IconLoader';
import { LucideTrophy } from 'lucide-react';

const ContestPage = () => {
  const [activeTab, setActiveTab] = useState(contestTabs[0].value);

  const router = useRouter();

  const {
    data: contests = [],
    isLoading,
    isError,
    error,
  } = useGetMyContests({
    status: activeTab,
  });

  const activeTabLabel =
    contestTabs.find((tab) => tab.value === activeTab)?.label ?? 'contests';

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="h-auto w-full justify-start gap-2 rounded-xl bg-white/5 p-1">
          {contestTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-xl px-4 py-2"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {contestTabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <div className="grid grid-cols-1 gap-4 rounded-xl md:border border-white/10 md:bg-white/5 md:p-3 lg:grid-cols-2 xl:grid-cols-3">
              {isLoading ? (
                <div className="col-span-full rounded-xl border border-white/10 bg-white/5 p-8 text-center text-sm text-muted-foreground">
                  <IconLoader
                    loadingText={`Loading ${activeTabLabel.toLowerCase()} contests...`}
                  >
                    <LucideTrophy className="size-6 text-white/70" />
                  </IconLoader>{' '}
                </div>
              ) : isError ? (
                <div className="col-span-full rounded-xl border border-red-500/20 bg-red-500/10 p-8 text-center text-sm text-red-300">
                  {error instanceof Error
                    ? error.message
                    : 'Failed to load contests.'}
                </div>
              ) : contests.length > 0 ? (
                contests.map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    onEdit={(selectedContest) => {
                      router.push(
                        ADMIN_ROUTES.CONTESTS_EDIT(selectedContest.id),
                      );
                    }}
                    past={tab.value === 'past'}
                  />
                ))
              ) : (
                <div className="col-span-full rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-muted-foreground">
                  No {activeTabLabel.toLowerCase()} contests yet.
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContestPage;
