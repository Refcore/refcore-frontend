export const queryKeys = {
  auth: {
    currentUser: ['auth', 'current_user'] as const,
  },
  channels: {
    myChannel: (user_id?: string) => ['channels', 'my_channel', user_id] as const,
  },
};