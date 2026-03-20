import React from 'react';
import { Medal, Bell, Gift } from 'lucide-react';
import CompeteRight from './CompeteRight';

const Compete = () => {
  return (
    <div className="relative overflow-hidden flex flex-col lg:flex-row items-end gap-10 mx-auto w-full max-w-(--breakpoint-2xl) py-20 md:py-24 px-6 md:px-12">
      <div className="flex-1 space-y-4">
        <h3 className="text-4xl md:text-6xl font-bold">
          Built to Make Users <br className="block md:hidden" />
          <span className="text-gradient-primary">Compete</span>
        </h3>
        <p className="text-muted-foreground text-sm">
          We applied game design psychology to referral marketing. When users
          see their rank, badges, and progress, they naturally want to refer
          more.
        </p>
        <ul className="space-y-3">
          <li className="flex gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 bg-white/5 shrink-0">
              <Medal className="w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Status Badges</p>
              <p className="text-muted-foreground text-sm max-w-md">
                Users earn visual badges as they hit referral milestones,
                increasing their social status on the board.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 bg-white/5 shrink-0">
              {' '}
              <Bell className="w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Live Notifications</p>
              <p className="text-muted-foreground text-sm max-w-md">
                WhatsApp alerts when someone passes them on the leaderboard,
                triggering immediate re-engagement.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 bg-white/5 shrink-0">
              {' '}
              <Gift className="w-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Tiered Rewards</p>
              <p className="text-muted-foreground text-sm max-w-md">
                Set up automatic reward unlocks at different referral tiers to
                keep momentum going.
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex-1 w-full relative">
        <CompeteRight />
         <div className="pointer-events-none blur-3xl scale-150 h-full w-full absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,purple_0%,transparent_18%,rgba(10,10,15,0.35)_42%,rgba(10,10,15,0.72)_68%,#0a0a0f_100%)]" />
      </div>
    </div>
  );
};

export default Compete;
