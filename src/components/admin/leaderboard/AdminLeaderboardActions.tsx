'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Eye, Copy, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import DialogueTool from '@/components/shared/DialogueTool';
import ViewParticipantModal from '@/components/modals/ViewContestParticipantModal';
import ViewAlltimeParticipantModal from '@/components/modals/ViewAlltimeParticipantModal';
import ViewReferralsModal from '@/components/modals/ViewReferralsModal';
import { cn } from '@/lib/utils';

type LeaderboardActionsProps = {
  participantId: string;
  referralCode: string;
  phone: string | null;
  contestId: string | null;
  constestParticipantId?: string | null;
};

type CopiedTarget = 'referral_code' | 'phone' | null;

type ActiveModal = 'participant' | 'all_time_participant' | 'referrals' | null;

const LeaderboardActions = ({
  participantId,
  referralCode,
  phone,
  contestId,
  constestParticipantId,
}: LeaderboardActionsProps) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [copiedTarget, setCopiedTarget] = useState<CopiedTarget>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canViewParticipant = Boolean(contestId && participantId);
  const hasReferralCode = Boolean(referralCode?.trim());
  const hasPhone = Boolean(phone?.trim());

  const isModalOpen = activeModal !== null;

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
    if (!canViewParticipant) return;

    setActiveModal('participant');
  };

  const handleViewAllTimeParticipant = () => {
    if (canViewParticipant) return;

    setActiveModal('all_time_participant');
  };

  const handleViewReferrals = () => {
    setActiveModal('referrals');
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

    if (activeModal === 'all_time_participant') {
      return 'Participant details';
    }

    if (activeModal === 'referrals') {
      return 'Participant referrals';
    }

    return '';
  };

  const renderModalContent = () => {
    if (activeModal === 'participant' && canViewParticipant) {
      return (
        <ViewParticipantModal
          onClose={handleCloseModal}
          contestId={contestId}
          participantId={participantId}
        />
      );
    }

    if (activeModal === 'all_time_participant' && !canViewParticipant) {
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
          participantId={
            !canViewParticipant ? participantId : constestParticipantId
          }
          contestId={contestId}
          participantName=""
        />
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
          className="w-52 rounded-xl border-white/10 bg-[#13131a] p-2"
        >
          <div className="flex flex-col gap-1">
            {canViewParticipant ? (
              <Button
                type="button"
                variant="ghost"
                className="justify-start rounded-lg"
                onClick={handleViewParticipant}
                disabled={!canViewParticipant}
              >
                <Eye className="size-4" />
                View participant
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="justify-start rounded-lg"
                onClick={handleViewAllTimeParticipant}
              >
                <Eye className="size-4" />
                View
              </Button>
            )}

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
                <Copy className="size-4" />
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

export default LeaderboardActions;
