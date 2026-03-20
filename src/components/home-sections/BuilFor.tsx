'use client';

import { performanceData } from '@/consts/performance';
import React from 'react';
import PerformanceCard from './PerformanceCard';

const BuilFor = () => {
  return (
    <div className="relative overflow-hidden flex flex-col items-center gap-10 mx-auto w-full max-w-(--breakpoint-2xl) py-20 md:py-24 px-6 md:px-12">
      <h3 className="text-4xl md:text-6xl font-bold text-center">
        Built for <br className="block md:hidden" />
        <span className="text-gradient-success">Performance</span>
      </h3>
      <p className="text-muted-foreground text-center text-sm">
        Everything you need to run massive, cheat-free WhatsApp campaigns.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {performanceData.map((p) => (
          <PerformanceCard key={p.title} {...p} />
        ))}
      </div>

      <div className="pointer-events-none blur-3xl scale-300 opacity-20 h-full w-full absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,green_0%,transparent_18%,rgba(10,10,15,0.35)_42%,rgba(10,10,15,0.72)_68%,#0a0a0f_100%)]" />
    </div>
  );
};

export default BuilFor;
