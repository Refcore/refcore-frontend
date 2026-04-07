'use client'

import React from 'react';
import StatsCard from './StatsCard';
import { ArrowUp, Users, Link2, Trophy } from 'lucide-react';

const Stats = () => {
  return (
    <div className='grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-4'>
      <StatsCard
        title="Participants"
        description="Total Participants"
        value="2,847"
        color="#00ff9d"
        icon={Users}
        info={
          <span className="inline-flex items-center gap-1">
            <ArrowUp className="size-3.5" />
            +12%
          </span>
        }
      />

      <StatsCard
        title="Referrals"
        description="Total Referrals"
        value="12,405"
        color="#00d0ff"
        icon={Link2}
        info={
          <span className="inline-flex items-center gap-1">
            <ArrowUp className="size-3.5" />
            +24%
          </span>
        }
      />

      <StatsCard
        title="Contest Status"
        description="Time Remaining"
        value="4d 18h"
        color="#facc15"
        icon={Trophy}
        info="Active"
      />

      <StatsCard
        title="Advanced Analytics"
        description="Viral Coefficient"
        value="--"
        color="#b700ff"
        icon={Trophy}
        locked
        lockedText="Available on Growth plan"
      />
    </div>
  );
};

export default Stats;
