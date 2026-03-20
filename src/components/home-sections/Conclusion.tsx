import React from 'react';
import { Button } from '../ui/button';

const Conclusion = () => {
  return (
    <div className="py-20 md:py-24 px-6 md:px-12 relative">
      <div className="flex flex-col items-center gap-10 mx-auto w-full max-w-(--breakpoint-2xl)">
        <h3 className="text-4xl md:text-6xl font-bold text-center">
          Stop Counting Manually. <br className="block" />
          <span className="text-gradient-success">Start Growing Faster.</span>
        </h3>

        <p className="text-muted-foreground text-center text-sm">
          Join 500+ channels already using REFCORE to automate their growth.
        </p>

        <Button className="bg-foreground text-background px-8 py-6 rounded-full hover:-translate-y-1 hover:shadow-[0_0_90px_rgba(225,225,255,0.25)]">
          Launch Your First Contest Now
        </Button>
      </div>
     <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full opacity-40 bg-linear-to-t from-[#00f0c8]/18 via-[#00f0c8]/10 to-transparent" />
    </div>
  );
};

export default Conclusion;
