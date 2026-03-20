import React from 'react';
import PriceCard from './PriceCard';
import { plans } from '@/consts/plans';

const Pricing = () => {
  return (
    <div className="flex flex-col items-center gap-10 mx-auto w-full max-w-(--breakpoint-2xl) py-20 md:py-24 px-6 md:px-12">
      <h3 className="text-4xl md:text-6xl font-bold text-center">
        Simple Pricing for Growing Channels
      </h3>
      <p className="text-muted-foreground text-center text-sm">
        Start small, scale infinitely. No hidden fees.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {plans.map((plan) => (
          <PriceCard key={plan.title} {...plan} />
        ))}
      </div>
    </div>
  );
};

export default Pricing;
