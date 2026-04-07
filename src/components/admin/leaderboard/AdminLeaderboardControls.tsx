import React from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const LeaderboardControls = () => {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between">
      <Tabs defaultValue="currentContest" className="w-full lg:w-auto">
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
            placeholder="Search by username or phone"
            className="rounded-xl border-white/10 bg-background/40 pl-9"
          />
        </div>

        <Select defaultValue="top10">
          <SelectTrigger className="w-full rounded-xl border-white/10 bg-background/40 lg:w-40">
            <SelectValue placeholder="Filter range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-white/10">
            <SelectItem value="top10">Top 10</SelectItem>
            <SelectItem value="bottom10">Bottom 10</SelectItem>
            <SelectItem value="top50">Top 50</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-white/10 bg-transparent"
        >
          <ArrowUpDown className="size-4" />
          Sort
        </Button>
      </div>
    </section>
  );
};

export default LeaderboardControls;