'use client';

import React from 'react';
import {
  Bell,
  MessageCircleMore,
  Settings2,
  ShieldAlert,
  Trophy,
  UserPlus,
  Waves,
} from 'lucide-react';

import type { NotificationSettings } from '@/types/notificationsettings.type';
import {
  getInitialNotificationSettingsValues,
  notificationSettingsFieldMeta,
} from '@/schema/notificationSettings.schema';
import SoloToggle from '@/components/shared/SoloToggle';
import SoloDropDownInput from '@/components/shared/SoloDropDownInput';

type NotificationsSettingsSectionProps = {
  settings?: NotificationSettings | null;
};

type ChannelPreference = {
  in_app: boolean;
  whatsapp: boolean;
};

type NotificationGroupKey = keyof NotificationSettings;

type AdminFieldKey = keyof NotificationSettings['admin_notifications'];
type ParticipantFieldKey = keyof NotificationSettings['participant_notifications'];

const deliveryModeOptions = [
  { label: 'Disabled', value: 'disabled' },
  { label: 'In-App Only', value: 'in_app' },
  { label: 'WhatsApp Only', value: 'whatsapp' },
  { label: 'In-App + WhatsApp', value: 'both' },
] as const;

const getDeliveryModeValue = (value: ChannelPreference) => {
  if (value.in_app && value.whatsapp) return 'both';
  if (value.in_app) return 'in_app';
  if (value.whatsapp) return 'whatsapp';
  return 'disabled';
};

const getDeliveryModeChannels = (value: string): ChannelPreference => {
  switch (value) {
    case 'both':
      return { in_app: true, whatsapp: true };
    case 'in_app':
      return { in_app: true, whatsapp: false };
    case 'whatsapp':
      return { in_app: false, whatsapp: true };
    default:
      return { in_app: false, whatsapp: false };
  }
};

const getDeliveryModeLabel = (value: ChannelPreference) => {
  if (value.in_app && value.whatsapp) return 'In-App + WhatsApp';
  if (value.in_app) return 'In-App Only';
  if (value.whatsapp) return 'WhatsApp Only';
  return 'Disabled';
};

const sectionIcons: Record<NotificationGroupKey, React.ReactNode> = {
  admin_notifications: <Bell className="size-5 text-neon-green" />,
  participant_notifications: (
    <MessageCircleMore className="size-5 text-neon-green" />
  ),
};

const rowIcons: Record<string, React.ReactNode> = {
  new_participant_joined: <UserPlus className="size-4" />,
  referral_recorded: <Waves className="size-4" />,
  leaderboard_position_changed: <Trophy className="size-4" />,
  new_top_performer: <Trophy className="size-4" />,
  suspicious_referral_detected: <ShieldAlert className="size-4" />,
  contest_started: <Bell className="size-4" />,
  contest_ended: <Bell className="size-4" />,
  join_confirmed: <UserPlus className="size-4" />,
  referral_successful: <Waves className="size-4" />,
  became_top_performer: <Trophy className="size-4" />,
  reward_qualified: <Trophy className="size-4" />,
  contest_ending_soon: <Bell className="size-4" />,
};

const NotificationsSettingsSection = ({
  settings,
}: NotificationsSettingsSectionProps) => {
  const initialValues = React.useMemo(
    () => getInitialNotificationSettingsValues(settings),
    [settings],
  );

  const [notificationValues, setNotificationValues] = React.useState(initialValues);
  const [loadingKey, setLoadingKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    setNotificationValues(initialValues);
  }, [initialValues]);

  const handleInAppToggle = async (
    group: NotificationGroupKey,
    field: string,
    checked: boolean,
  ) => {
    setNotificationValues((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: {
          ...prev[group][field as keyof (typeof prev)[typeof group]],
          in_app: checked,
        },
      },
    }));

    const key = `${group}.${field}.in_app`;
    setLoadingKey(key);

    try {
      console.log({
        group,
        field,
        channel: 'in_app',
        value: checked,
      });
    } finally {
      setLoadingKey(null);
    }
  };

  const handleDeliveryModeChange = async (
    group: NotificationGroupKey,
    field: string,
    value: string,
  ) => {
    const nextChannels = getDeliveryModeChannels(value);

    setNotificationValues((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: nextChannels,
      },
    }));

    const key = `${group}.${field}.delivery_mode`;
    setLoadingKey(key);

    try {
      console.log({
        group,
        field,
        channels: nextChannels,
      });
    } finally {
      setLoadingKey(null);
    }
  };

  const renderNotificationRows = <
    TFieldKey extends AdminFieldKey | ParticipantFieldKey,
  >(
    groupKey: NotificationGroupKey,
    fields: Record<
      TFieldKey,
      {
        label: string;
        description: string;
        in_app: {
          onInfo: string;
          offInfo: string;
        };
        whatsapp: {
          onInfo: string;
          offInfo: string;
        };
      }
    >,
    values: Record<TFieldKey, ChannelPreference>,
  ) => {
    return (Object.keys(fields) as TFieldKey[]).map((fieldKey) => {
      const fieldMeta = fields[fieldKey];
      const fieldValue = values[fieldKey];

      return (
        <div
          key={`${groupKey}-${String(fieldKey)}`}
          className="rounded-xl md:border border-white/10 bg-overbg/85 p-2 md:p-4"
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="mt-0.5 shrink-0 rounded-lg border border-white/10 bg-black/20 p-2 text-white/70">
              {rowIcons[String(fieldKey)] ?? <Bell className="size-4" />}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white md:text-base">
                {fieldMeta.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/50 md:text-sm">
                {fieldMeta.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <SoloToggle
              label="In-App Notification"
              description="Choose whether this alert should appear inside the REFCORE dashboard."
              checked={fieldValue.in_app}
              loading={loadingKey === `${groupKey}.${String(fieldKey)}.in_app`}
              onInfo={fieldMeta.in_app.onInfo}
              offInfo={fieldMeta.in_app.offInfo}
              onCheckedChange={(checked) =>
                handleInAppToggle(groupKey, String(fieldKey), checked)
              }
            />

            <SoloDropDownInput
              label="Delivery Mode"
              description="Choose the channel combination for this notification event."
              value={getDeliveryModeValue(fieldValue)}
              options={deliveryModeOptions}
              loading={
                loadingKey === `${groupKey}.${String(fieldKey)}.delivery_mode`
              }
              leftAdornment={<MessageCircleMore className="size-4" />}
              onChange={(value) =>
                handleDeliveryModeChange(groupKey, String(fieldKey), value)
              }
            />
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/45">
            Current delivery: {getDeliveryModeLabel(fieldValue)}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 border-b pb-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/85 md:p-5">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Settings2 className="size-5 text-neon-green" />
            Notification Settings
          </h3>
          <p className="text-xs text-white/55 md:text-sm">
            Configure how admins and participants receive important contest,
            referral, and leaderboard updates.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Admin New Top Performer</p>
            <p className="mt-2 text-sm font-medium text-white">
              {getDeliveryModeLabel(
                notificationValues.admin_notifications.new_top_performer,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">
              Participant Referral Successful
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {getDeliveryModeLabel(
                notificationValues.participant_notifications.referral_successful,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">
              Admin Suspicious Referral Alerts
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {getDeliveryModeLabel(
                notificationValues.admin_notifications
                  .suspicious_referral_detected,
              )}
            </p>
          </div>
        </div>
      </div>

      {(Object.keys(notificationSettingsFieldMeta) as NotificationGroupKey[]).map(
        (groupKey) => {
          const groupMeta = notificationSettingsFieldMeta[groupKey];
          const groupValues = notificationValues[groupKey];

          return (
            <div
              key={groupKey}
              className="md:space-y-4 space-y-10 md:rounded-xl md:border md:border-white/10 md:bg-overbg/50 md:p-5"
            >
              <div className="space-y-1">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-white md:text-base">
                  {sectionIcons[groupKey]}
                  {groupMeta.title}
                </h4>
                <p className="text-xs text-white/55 md:text-sm">
                  {groupMeta.description}
                </p>
              </div>

              <div className="md:space-y-4 space-y-10">
                {renderNotificationRows(
                  groupKey,
                  groupMeta.fields as never,
                  groupValues as never,
                )}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
};

export default NotificationsSettingsSection;