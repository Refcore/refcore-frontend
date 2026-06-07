export type ContestParticipantModel = {
  id: string;
  channel_id: string;
  contest_id: string;
  participant_id: string;
  referral_count: number;
  rank_cache: number | null;
  joined_at: string;
  status: string;
  created_at: string;
  updated_at: string;
  participant: {
    id: string;
    channel_id: string;
    phone_number: string;
    display_name: string | null;
    referral_code: string;
    total_referrals: number;
    total_contests_joined: number;
    first_joined_at: string;
    last_joined_at: string | null;
    created_at: string;
    updated_at: string;
  };
};

export type GetContestParticipantsResponse = {
  participants: ContestParticipantModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};
