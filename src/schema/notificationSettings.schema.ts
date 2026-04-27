import { z } from 'zod';
import { NotificationSettings } from '@/types/notificationsettings.type';

export const notificationChannelSchema = z.object({
  in_app: z.boolean(),
  whatsapp: z.boolean(),
});

export const notificationSettingsSchema = z.object({
  admin_notifications: z.object({
    new_participant_joined: notificationChannelSchema,
    referral_recorded: notificationChannelSchema,
    leaderboard_position_changed: notificationChannelSchema,
    new_top_performer: notificationChannelSchema,
    suspicious_referral_detected: notificationChannelSchema,
    contest_started: notificationChannelSchema,
    contest_ended: notificationChannelSchema,
  }),

  participant_notifications: z.object({
    join_confirmed: notificationChannelSchema,
    referral_successful: notificationChannelSchema,
    leaderboard_position_changed: notificationChannelSchema,
    became_top_performer: notificationChannelSchema,
    reward_qualified: notificationChannelSchema,
    contest_ending_soon: notificationChannelSchema,
    contest_ended: notificationChannelSchema,
  }),
});

export type NotificationSettingsValues = z.infer<
  typeof notificationSettingsSchema
>;

export const notificationSettingsFieldMeta = {
  admin_notifications: {
    title: 'Admin Notifications',
    description: 'Choose how admins should receive important contest updates.',
    fields: {
      new_participant_joined: {
        label: 'New Participant Joined',
        description: 'Notify admins when a new participant joins a contest.',
        in_app: {
          onInfo: 'Admins will get this in-app',
          offInfo: 'No in-app alert for admins',
        },
        whatsapp: {
          onInfo: 'Admins will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for admins',
        },
      },
      referral_recorded: {
        label: 'Referral Recorded',
        description: 'Notify admins when a valid referral is counted.',
        in_app: {
          onInfo: 'Admins will get this in-app',
          offInfo: 'No in-app alert for admins',
        },
        whatsapp: {
          onInfo: 'Admins will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for admins',
        },
      },
      leaderboard_position_changed: {
        label: 'Leaderboard Position Changed',
        description: 'Notify admins when leaderboard rankings change.',
        in_app: {
          onInfo: 'Admins will get this in-app',
          offInfo: 'No in-app alert for admins',
        },
        whatsapp: {
          onInfo: 'Admins will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for admins',
        },
      },
      new_top_performer: {
        label: 'New Top Performer',
        description: 'Notify admins when someone becomes number one.',
        in_app: {
          onInfo: 'Admins will get this in-app',
          offInfo: 'No in-app alert for admins',
        },
        whatsapp: {
          onInfo: 'Admins will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for admins',
        },
      },
      suspicious_referral_detected: {
        label: 'Suspicious Referral Detected',
        description:
          'Notify admins when suspicious referral activity is flagged.',
        in_app: {
          onInfo: 'Admins will get this in-app',
          offInfo: 'No in-app alert for admins',
        },
        whatsapp: {
          onInfo: 'Admins will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for admins',
        },
      },
      contest_started: {
        label: 'Contest Started',
        description: 'Notify admins when a contest becomes active.',
        in_app: {
          onInfo: 'Admins will get this in-app',
          offInfo: 'No in-app alert for admins',
        },
        whatsapp: {
          onInfo: 'Admins will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for admins',
        },
      },
      contest_ended: {
        label: 'Contest Ended',
        description: 'Notify admins when a contest ends.',
        in_app: {
          onInfo: 'Admins will get this in-app',
          offInfo: 'No in-app alert for admins',
        },
        whatsapp: {
          onInfo: 'Admins will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for admins',
        },
      },
    },
  },

  participant_notifications: {
    title: 'Participant Notifications',
    description:
      'Choose how participants should receive progress and contest updates.',
    fields: {
      join_confirmed: {
        label: 'Join Confirmed',
        description:
          'Notify participants when they successfully join a contest.',
        in_app: {
          onInfo: 'Participants will get this in-app',
          offInfo: 'No in-app alert for participants',
        },
        whatsapp: {
          onInfo: 'Participants will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for participants',
        },
      },
      referral_successful: {
        label: 'Referral Successful',
        description:
          'Notify participants when one of their referrals is counted.',
        in_app: {
          onInfo: 'Participants will get this in-app',
          offInfo: 'No in-app alert for participants',
        },
        whatsapp: {
          onInfo: 'Participants will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for participants',
        },
      },
      leaderboard_position_changed: {
        label: 'Leaderboard Position Changed',
        description: 'Notify participants when their rank changes.',
        in_app: {
          onInfo: 'Participants will get this in-app',
          offInfo: 'No in-app alert for participants',
        },
        whatsapp: {
          onInfo: 'Participants will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for participants',
        },
      },
      became_top_performer: {
        label: 'Became Top Performer',
        description: 'Notify participants when they reach the top spot.',
        in_app: {
          onInfo: 'Participants will get this in-app',
          offInfo: 'No in-app alert for participants',
        },
        whatsapp: {
          onInfo: 'Participants will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for participants',
        },
      },
      reward_qualified: {
        label: 'Reward Qualified',
        description: 'Notify participants when they qualify for a reward.',
        in_app: {
          onInfo: 'Participants will get this in-app',
          offInfo: 'No in-app alert for participants',
        },
        whatsapp: {
          onInfo: 'Participants will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for participants',
        },
      },
      contest_ending_soon: {
        label: 'Contest Ending Soon',
        description: 'Notify participants shortly before the contest ends.',
        in_app: {
          onInfo: 'Participants will get this in-app',
          offInfo: 'No in-app alert for participants',
        },
        whatsapp: {
          onInfo: 'Participants will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for participants',
        },
      },
      contest_ended: {
        label: 'Contest Ended',
        description: 'Notify participants when the contest ends.',
        in_app: {
          onInfo: 'Participants will get this in-app',
          offInfo: 'No in-app alert for participants',
        },
        whatsapp: {
          onInfo: 'Participants will get this on WhatsApp',
          offInfo: 'No WhatsApp alert for participants',
        },
      },
    },
  },
} as const;

export const initialNotificationSettingsValues: NotificationSettingsValues = {
  admin_notifications: {
    new_participant_joined: {
      in_app: true,
      whatsapp: false,
    },
    referral_recorded: {
      in_app: true,
      whatsapp: false,
    },
    leaderboard_position_changed: {
      in_app: true,
      whatsapp: false,
    },
    new_top_performer: {
      in_app: true,
      whatsapp: true,
    },
    suspicious_referral_detected: {
      in_app: true,
      whatsapp: true,
    },
    contest_started: {
      in_app: true,
      whatsapp: false,
    },
    contest_ended: {
      in_app: true,
      whatsapp: true,
    },
  },

  participant_notifications: {
    join_confirmed: {
      in_app: true,
      whatsapp: true,
    },
    referral_successful: {
      in_app: true,
      whatsapp: true,
    },
    leaderboard_position_changed: {
      in_app: true,
      whatsapp: false,
    },
    became_top_performer: {
      in_app: true,
      whatsapp: true,
    },
    reward_qualified: {
      in_app: true,
      whatsapp: true,
    },
    contest_ending_soon: {
      in_app: true,
      whatsapp: false,
    },
    contest_ended: {
      in_app: true,
      whatsapp: true,
    },
  },
};

export const getInitialNotificationSettingsValues = (
  settings?: NotificationSettings | null,
): NotificationSettingsValues => ({
  admin_notifications: {
    new_participant_joined:
      settings?.admin_notifications.new_participant_joined ??
      initialNotificationSettingsValues.admin_notifications
        .new_participant_joined,
    referral_recorded:
      settings?.admin_notifications.referral_recorded ??
      initialNotificationSettingsValues.admin_notifications.referral_recorded,
    leaderboard_position_changed:
      settings?.admin_notifications.leaderboard_position_changed ??
      initialNotificationSettingsValues.admin_notifications
        .leaderboard_position_changed,
    new_top_performer:
      settings?.admin_notifications.new_top_performer ??
      initialNotificationSettingsValues.admin_notifications.new_top_performer,
    suspicious_referral_detected:
      settings?.admin_notifications.suspicious_referral_detected ??
      initialNotificationSettingsValues.admin_notifications
        .suspicious_referral_detected,
    contest_started:
      settings?.admin_notifications.contest_started ??
      initialNotificationSettingsValues.admin_notifications.contest_started,
    contest_ended:
      settings?.admin_notifications.contest_ended ??
      initialNotificationSettingsValues.admin_notifications.contest_ended,
  },

  participant_notifications: {
    join_confirmed:
      settings?.participant_notifications.join_confirmed ??
      initialNotificationSettingsValues.participant_notifications
        .join_confirmed,
    referral_successful:
      settings?.participant_notifications.referral_successful ??
      initialNotificationSettingsValues.participant_notifications
        .referral_successful,
    leaderboard_position_changed:
      settings?.participant_notifications.leaderboard_position_changed ??
      initialNotificationSettingsValues.participant_notifications
        .leaderboard_position_changed,
    became_top_performer:
      settings?.participant_notifications.became_top_performer ??
      initialNotificationSettingsValues.participant_notifications
        .became_top_performer,
    reward_qualified:
      settings?.participant_notifications.reward_qualified ??
      initialNotificationSettingsValues.participant_notifications
        .reward_qualified,
    contest_ending_soon:
      settings?.participant_notifications.contest_ending_soon ??
      initialNotificationSettingsValues.participant_notifications
        .contest_ending_soon,
    contest_ended:
      settings?.participant_notifications.contest_ended ??
      initialNotificationSettingsValues.participant_notifications.contest_ended,
  },
});
