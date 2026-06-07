export type ReferralParticipantPreview = {
  id: string | null;
  user_name: string;
  phone: string;
  referral_code: string | null;
};

export type ReferralModel = {
  id: string;
  channel_id: string;
  contest_id: string;

  referrer_participant_id: string;
  referee_participant_id: string | null;

  referrer: ReferralParticipantPreview;
  referee: ReferralParticipantPreview;

  created_at: string;
  referee_phone_number: string;
  referral_code_used: string;
  status: ReferralStatus;
  notes: string | null;
  first_seen_at: string;
  became_participant_at: string | null;
  updated_at: string;
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

export type ReferralGraphRange = '7days' | '30days' | 'allTime';

export type ReferralStatus =
  | 'valid'
  | 'became_participant'
  | 'flagged'
  | 'blocked';

export type ReferralGraphDataItem = {
  label: string;
  referrals: number;
};

export type JoinsPerDayGraphDataItem = {
  label: string;
  joins: number;
};

export type GetReferralGraphResponse = {
  range: ReferralGraphRange;
  graph_data: ReferralGraphDataItem[];
  joins_per_day: JoinsPerDayGraphDataItem[];
};
