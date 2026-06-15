'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  MoreHorizontal,
  Eye,
  Copy,
  Phone,
  Check,
  Users,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import DialogueTool from '@/components/shared/DialogueTool';
import ViewAlltimeParticipantModal from '@/components/modals/ViewAlltimeParticipantModal';
import ViewReferralsModal from '@/components/modals/ViewReferralsModal';
import { cn } from '@/lib/utils';

type ParticipantActionsProps = {
  participantId: string;
  userName: string;
  referralCode: string;
  phone: string;
};

type CopiedTarget = 'referral_code' | 'phone' | null;
type ActiveModal = 'participant' | 'referrals' | 'performance' | null;

const ParticipantActions = ({
  participantId,
  userName,
  referralCode,
  phone,
}: ParticipantActionsProps) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [copiedTarget, setCopiedTarget] = useState<CopiedTarget>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isModalOpen = activeModal !== null;
  const hasReferralCode = Boolean(referralCode?.trim());
  const hasPhone = Boolean(phone?.trim());

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (
    value: string | null | undefined,
    target: Exclude<CopiedTarget, null>,
  ) => {
    const safe_value = value?.trim();

    if (!safe_value) return;

    try {
      await navigator.clipboard.writeText(safe_value);

      setCopiedTarget(target);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopiedTarget(null);
      }, 1200);
    } catch (error) {
      console.error('COPY_TO_CLIPBOARD_ERROR', error);
    }
  };

  const handleCopyReferralCode = () => {
    handleCopy(referralCode, 'referral_code');
  };

  const handleCopyPhone = () => {
    handleCopy(phone, 'phone');
  };

  const handleViewParticipant = () => {
    setActiveModal('participant');
  };

  const handleViewReferrals = () => {
    setActiveModal('referrals');
  };

  const handleViewParticipantPerformance = () => {
    setActiveModal('performance');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleToggleModal = (nextOpen: boolean) => {
    if (!nextOpen) {
      handleCloseModal();
    }
  };

  const getModalTitle = () => {
    if (activeModal === 'participant') {
      return 'Participant details';
    }

    if (activeModal === 'referrals') {
      return 'Participant referrals';
    }

    if (activeModal === 'performance') {
      return 'Participant performance';
    }

    return '';
  };

  const renderModalContent = () => {
    if (activeModal === 'participant') {
      return (
        <ViewAlltimeParticipantModal
          onClose={handleCloseModal}
          participantId={participantId}
        />
      );
    }

    if (activeModal === 'referrals') {
      return (
        <ViewReferralsModal
          onClose={handleCloseModal}
          participantId={participantId}
          contestId={null}
          participantName={userName}
        />
      );
    }

    if (activeModal === 'performance') {
      return (
        <div className="rounded-xl border border-white/10 bg-[#0a0a0f]/40 p-4">
          <p className="text-sm font-semibold text-white">
            Performance modal coming soon.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Participant ID: {participantId}
          </p>
        </div>
      );
    }

    return null;
  };

  const isReferralCodeCopied = copiedTarget === 'referral_code';
  const isPhoneCopied = copiedTarget === 'phone';

  return (
    <>
      <DialogueTool
        open={isModalOpen}
        onOpenChange={handleToggleModal}
        content={renderModalContent()}
        title={getModalTitle()}
      >
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="hidden"
        />
      </DialogueTool>

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
          className="w-56 rounded-xl border-white/10 bg-[#13131a] p-2"
        >
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="ghost"
              className="justify-start rounded-lg"
              onClick={handleViewParticipant}
            >
              <Eye className="size-4" />
              View participant
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="justify-start rounded-lg"
              onClick={handleViewParticipantPerformance}
            >
              <Trophy className="size-4" />
              View performance
            </Button>

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
              className={cn(
                'justify-start rounded-lg transition-colors',
                isReferralCodeCopied && 'text-[#00ff9d] hover:text-[#00ff9d]',
              )}
              onClick={handleCopyReferralCode}
              disabled={!hasReferralCode}
            >
              {isReferralCodeCopied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {isReferralCodeCopied ? 'Copied' : 'Copy referral code'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className={cn(
                'justify-start rounded-lg transition-colors',
                isPhoneCopied && 'text-[#00ff9d] hover:text-[#00ff9d]',
              )}
              onClick={handleCopyPhone}
              disabled={!hasPhone}
            >
              {isPhoneCopied ? (
                <Check className="size-4" />
              ) : (
                <Phone className="size-4" />
              )}
              {hasPhone
                ? isPhoneCopied
                  ? 'Copied'
                  : 'Copy phone number'
                : 'No phone number'}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default ParticipantActions;
