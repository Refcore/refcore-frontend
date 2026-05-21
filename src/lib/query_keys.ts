export const queryKeys = {
  auth: {
    currentUser: ['auth', 'current_user'] as const,
  },

  channels: {
    all: ['channels'] as const,
    myChannel: (user_id?: string) =>
      ['channels', 'my_channel', user_id] as const,
  },

  contests: {
    all: ['contests'] as const,
    byChannel: (channel_id?: string) =>
      ['contests', 'by_channel', channel_id] as const,
  },

  participants: {
    all: ['participants'] as const,
    byChannel: (channel_id?: string) =>
      [...queryKeys.participants.all, 'channel', channel_id] as const,
  },

  referrals: {
    all: ['referrals'] as const,
    byChannel: (channel_id?: string) =>
      [...queryKeys.referrals.all, 'channel', channel_id] as const,
  },

  leaderboard: {
    allTime: (channel_id?: string | null) => [
      'leaderboard',
      'allTime',
      channel_id,
    ],

    currentContest: (
      channel_id?: string | null,
      contest_id?: string | null,
    ) => ['leaderboard', 'currentContest', channel_id, contest_id],
  },
};
