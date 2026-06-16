export type PublicChannel = {
  id: string;
  tv_name: string;
  slug: string;
  whatsapp_number: string | null;
  whatsapp_verified: boolean;
  channel_banner: string | null;
  status: string;
  created_at: string;
};

export type PublicChannelsMatchType = 'slug' | 'name' | null;

export type SearchPublicChannelsResponse = {
  channels: PublicChannel[];
  match_type: PublicChannelsMatchType;
};

export type PublicActiveContest = {
  id: string;
  channel_id: string;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  visibility: string;
  start_date: string | null;
  end_date: string | null;
  reward_type: string | null;
  reward_value: string | null;
  reward_description: string | null;
  winner_selection: string | null;
  max_winners: number | null;
  participants_count: number;
  referrals_count: number;
  views_count: number;
  top_performer_name: string | null;
  top_performer_phone: string | null;
  top_performer_referrals: number;
  created_at: string;
  updated_at: string;
};

export type PublicChannelBySlugResponse = {
  channel: PublicChannel;
  active_contest: PublicActiveContest;
};