'use client';

import React from 'react';
import { MoreHorizontal, Eye, Copy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import DialogueTool from '@/components/shared/DialogueTool';

type LeaderboardActionsProps = {
  participantId: string;
  referralCode: string;
  phone: string | null;
};

const LeaderboardActions = ({
  participantId,
  referralCode,
  phone,
}: LeaderboardActionsProps) => {
  const handleCopyReferralCode = async () => {
    await navigator.clipboard.writeText(referralCode);
  };

  const handleCopyPhone = async () => {
    if (phone) {
      await navigator.clipboard.writeText(phone);
    }
  };

  const handleViewParticipant = () => {
    console.log('view participant', participantId, referralCode, phone);
  };

  const handleViewReferrals = () => {
    console.log('view referrals', participantId);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-52 rounded-xl border-white/10 bg-[#13131a] p-2"
      >
        <div className="flex flex-col gap-1">
          <DialogueTool
            content="Participant details would go here"
            title="Participant details"
            description="More participant details would go here"
          >
            <Button
              type="button"
              variant="ghost"
              className="justify-start rounded-lg"
              onClick={handleViewParticipant}
            >
              <Eye className="size-4" />
              View participant
            </Button>
          </DialogueTool>

          <Button
            type="button"
            variant="ghost"
            className="justify-start rounded-lg"
            onClick={handleViewReferrals}
          >
            <Users className="size-4" />
            View referrals
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="justify-start rounded-lg"
            onClick={handleCopyReferralCode}
          >
            <Copy className="size-4" />
            Copy referral code
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="justify-start rounded-lg"
            onClick={handleCopyPhone}
          >
            <Copy className="size-4" />
            Copy phone number
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LeaderboardActions;
