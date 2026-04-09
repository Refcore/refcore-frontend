'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { contestTabs } from '@/components/admin/contest/contestTabs';
import { demoContests } from '@/demo/contestsData';
import ContestCard from '@/components/admin/contest/ContestCard';

const ContestPage = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue={contestTabs[0].value} className="w-full space-y-6">
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

        {contestTabs.map((tab) => {
          const filteredContests = demoContests.filter(
            (contest) => contest.status === tab.value,
          );

          return (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="grid grid-cols-1 gap-4 rounded-xl md:border border-white/10 md:bg-white/5 md:p-3 lg:grid-cols-2 xl:grid-cols-3">
                {filteredContests.length > 0 ? (
                  filteredContests.map((contest) => (
                    <ContestCard
                      key={contest.id}
                      contest={contest}
                      onView={(selectedContest) =>
                        console.log('view', selectedContest)
                      }
                      onEdit={(selectedContest) =>
                        console.log('edit', selectedContest)
                      }
                    />
                  ))
                ) : (
                  <div className="col-span-full rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-muted-foreground">
                    No {tab.label.toLowerCase()} contests yet.
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ContestPage;