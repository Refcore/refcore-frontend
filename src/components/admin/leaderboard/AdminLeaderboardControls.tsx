import React from 'react';
import { Check, ChevronDown, Search, ArrowUpDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type {
  LeaderboardRange,
  LeaderboardSort,
} from '@/types/leaderboard.type';

type LeaderboardTab = 'currentContest' | 'allTime';

type LeaderboardControlsProps = {
  activeTab: LeaderboardTab;
  onTabChange: (value: LeaderboardTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
  range: LeaderboardRange;
  onRangeChange: (value: LeaderboardRange) => void;
  sort: LeaderboardSort;
  onSortChange: (value: LeaderboardSort) => void;
};

const rangeOptions: {
  label: string;
  value: LeaderboardRange;
}[] = [
  {
    label: 'Top 10',
    value: 'top10',
  },
  {
    label: 'Bottom 10',
    value: 'bottom10',
  },
  {
    label: 'Top 50',
    value: 'top50',
  },
  {
    label: 'All',
    value: 'all',
  },
];

const LeaderboardControls = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  range,
  onRangeChange,
  sort,
  onSortChange,
}: LeaderboardControlsProps) => {
  const handleSortToggle = () => {
    onSortChange(sort === 'referrals_desc' ? 'referrals_asc' : 'referrals_desc');
  };

  const selectedRange = rangeOptions.find((option) => option.value === range);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as LeaderboardTab)}
        className="w-full lg:w-auto"
      >
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-white/5 lg:w-auto">
          <TabsTrigger
            value="currentContest"
            className="rounded-lg px-4 text-sm"
          >
            Current Contest
          </TabsTrigger>

          <TabsTrigger value="allTime" className="rounded-lg px-4 text-sm">
            All Time
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
        <div className="relative w-full lg:w-70">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by username or phone"
            className="rounded-xl border-white/10 bg-background/40 pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between rounded-xl border-white/10 bg-background/40 font-normal hover:bg-white/5 lg:w-40"
            >
              <span>{selectedRange?.label ?? 'Filter range'}</span>
              <ChevronDown className="size-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) rounded-xl border-white/10 bg-[#13131a] text-white"
          >
            {rangeOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onRangeChange(option.value)}
                className="flex cursor-pointer items-center justify-between rounded-lg focus:bg-white/10 focus:text-white"
              >
                <span>{option.label}</span>

                {range === option.value ? (
                  <Check className="size-4 text-[#00d0ff]" />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="outline"
          onClick={handleSortToggle}
          className="rounded-xl border-white/10 bg-transparent"
        >
          <ArrowUpDown className="size-4" />
          {sort === 'referrals_desc' ? 'High to Low' : 'Low to High'}
        </Button>
      </div>
    </section>
  );
};

export default LeaderboardControls;