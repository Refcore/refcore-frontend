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