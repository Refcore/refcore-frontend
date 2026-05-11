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
};
