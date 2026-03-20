import { stepsData } from '@/consts/steps';
import React from 'react';
import StepsCard from './StepsCard';

const Steps = () => {
  return (
    <div className="flex relative flex-col items-center gap-10 mx-auto w-full max-w-(--breakpoint-2xl) py-20 md:py-24 px-6 md:px-12">
      <h3 className="text-4xl md:text-6xl font-bold text-center">
        Three Steps to <br className="block md:hidden" />
        <span className="text-gradient-primary">Viral Growth</span>
      </h3>
      <p className='text-muted-foreground text-center text-sm'>
        Turn your audience into active promoters with a gamified experience
        they&apos;ll love.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {stepsData.map((step) => (
          <StepsCard key={step.stepNumber} {...step} />
        ))}
      </div>
    </div>
  );
};

export default Steps;
