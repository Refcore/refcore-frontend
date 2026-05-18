export type ReferralParticipantPreview = {
  id: string;
  user_name: string;
  phone: string;
  referral_code: string;
};

export type ReferralModel = {
  id: string;
  channel_id: string;
  contest_id: string;
  referral_attempt_id: string | null;

  referrer_participant_id: string;
  referee_participant_id: string;

  referrer: ReferralParticipantPreview;
  referee: ReferralParticipantPreview;

  created_at: string;
};

export type ReferralsPagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type GetReferralsResponse = {
  referrals: ReferralModel[];
  pagination: ReferralsPagination;
};