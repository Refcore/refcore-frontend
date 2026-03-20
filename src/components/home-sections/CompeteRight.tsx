import { Star, Diamond, Crown } from 'lucide-react';
import React from 'react';
import { Progress } from '../ui/progress';
import Image from 'next/image';

const CompeteRight = () => {
  return (
    <div className="w-full glass rounded-lg flex flex-col items-center justify-between gap-3 p-3">
      <div className="border-3 border-black w-22 h-22 flex items-center rounded-full neon-purple relative overflow-hidden">
        <Image
          alt="user"
          sizes={'400'}
          height={200}
          width={200}
          src={'/images/usermale.webp'}
          className="h-auto w-auto"
        />
      </div>

      <div className="flex flex-col gap-3 items-center">
        <p className="font-semibold text-lg">Alex_V</p>
        <p className="text-primary">Diamond Tier</p>
      </div>

      <div className="w-full rounded-lg bg-black h-30 p-3 space-y-4">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Next Reward Unlock</p>
          <p className="text-foreground font-semibold">45/50 Refs</p>
        </div>
        <Progress className="bg-white/50 h-2" value={80} />
        <p className="text-sm text-muted-foreground text-center">
          Just 5 more refferals to unlock VIP Access
        </p>
      </div>

      <div className="w-full grid grid-cols-3 gap-2 text-muted-foreground">
        <div className="bg-background/10 h-15 rounded-md flex flex-col items-center justify-center">
          <Star className="w-4 md:w-fit" />
          <p className="text-sm md:text-base">Starter</p>
        </div>
        <div className="bg-background/50 h-15 rounded-md flex flex-col items-center justify-center neon-purple">
          {' '}
          <Diamond className="text-primary w-4 md:w-fit" />
          <p className="text-foreground text-sm md:text-base">Diamond</p>
        </div>
        <div className="bg-background/10 h-15 rounded-md flex flex-col items-center justify-center">
          {' '}
          <Crown className="w-4 md:w-fit" />
          <p className="text-sm md:text-base">Master</p>
        </div>
      </div>
    </div>
  );
};

export default CompeteRight;
