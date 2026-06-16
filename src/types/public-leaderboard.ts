export type PublicContestLeaderboardContest = {
  id: string;
  channel_id: string;
  title: string;
  slug: string;
  status: string;
  visibility: string;
  participants_count: number;
  referrals_count: number;
  top_performer_name: string | null;
  top_performer_phone: string | null;
  top_performer_referrals: number;
  updated_at: string;
};

export type PublicContestLeaderboardParticipant = {
  id: string;
  display_name: string | null;
  masked_phone_number: string | null;
  referral_code: string;
  total_referrals: number;
  total_contests_joined: number;
  first_joined_at: string;
};

export type PublicContestLeaderboardRow = {
  id: string;
  channel_id: string;
  contest_id: string;
  participant_id: string;
  rank: number;
  referral_count: number;
  rank_cache: number | null;
  joined_at: string;
  status: string;
  participant: PublicContestLeaderboardParticipant;
};

export type PublicContestLeaderboardPagination = {
  limit: number;
  returned: number;
  has_more: boolean;
};

export type PublicContestLeaderboardResponse = {
  contest: PublicContestLeaderboardContest;
  leaderboard: PublicContestLeaderboardRow[];
  pagination: PublicContestLeaderboardPagination;
};

import { PublicChannelBySlugResponse } from './public-channel.type';

export type PublicChannelWithBannerUrl =
  PublicChannelBySlugResponse['channel'] & {
    channel_banner_url: string | null;
  };

export type PublicLeaderboardPayload = {
  channel: PublicChannelWithBannerUrl;
  active_contest: PublicChannelBySlugResponse['active_contest'];
  active_contest_id: string;
  contest_leaderboard: PublicContestLeaderboardResponse | null;
};