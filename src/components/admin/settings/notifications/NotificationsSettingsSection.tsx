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
import { toast } from 'react-toastify';

import type { NotificationSettings } from '@/types/notificationsettings.type';
import {
  getInitialNotificationSettingsValues,
  notificationSettingsFieldMeta,
} from '@/schema/notificationSettings.schema';
import SoloToggle from '@/components/shared/SoloToggle';
import SoloDropDownInput from '@/components/shared/SoloDropDownInput';
import { useUpdateNotificationSettings } from '@/hooks/admin/channel/useUpdateNotificationSettings';

type NotificationsSettingsSectionProps = {
  settings?: NotificationSettings | null;
};

type ChannelPreference = {
  in_app: boolean;
  whatsapp: boolean;
};

type NotificationGroupKey = keyof NotificationSettings;

type AdminFieldKey = keyof NotificationSettings['admin_notifications'];
type ParticipantFieldKey =
  keyof NotificationSettings['participant_notifications'];

type NotificationFieldKey = AdminFieldKey | ParticipantFieldKey;

const deliveryModeOptions = [
  { label: 'Disabled', value: 'disabled' },
  { label: 'In-App Only', value: 'in_app' },
  { label: 'WhatsApp Only', value: 'whatsapp' },
  { label: 'In-App + WhatsApp', value: 'both' },
];

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

  const { updateNotificationSettings } = useUpdateNotificationSettings();

  const [notificationValues, setNotificationValues] =
    React.useState<NotificationSettings>(initialValues);

  const [loadingKeys, setLoadingKeys] = React.useState<Set<string>>(new Set());

  const setRowLoading = React.useCallback((key: string, loading: boolean) => {
    setLoadingKeys((prev) => {
      const next = new Set(prev);

      if (loading) {
        next.add(key);
      } else {
        next.delete(key);
      }

      return next;
    });
  }, []);

  const isLoadingKey = React.useCallback(
    (key: string) => loadingKeys.has(key),
    [loadingKeys],
  );

  React.useEffect(() => {
    setNotificationValues(initialValues);
  }, [initialValues]);

  const handleInAppToggle = async (
    group: NotificationGroupKey,
    field: NotificationFieldKey,
    checked: boolean,
  ) => {
    const fieldKey = String(field);
    const loadingKey = `${group}.${fieldKey}.in_app`;

    const previousChannel = (
      notificationValues[group] as Record<string, ChannelPreference>
    )[fieldKey];

    const nextChannel: ChannelPreference = checked
      ? {
          ...previousChannel,
          in_app: true,
        }
      : {
          in_app: false,
          whatsapp: false,
        };

    const nextValues = {
      ...notificationValues,
      [group]: {
        ...(notificationValues[group] as Record<string, ChannelPreference>),
        [fieldKey]: nextChannel,
      },
    } as NotificationSettings;

    setNotificationValues(nextValues);
    setRowLoading(loadingKey, true);

    try {
      const response = await updateNotificationSettings({
        notification_settings: nextValues,
      });

      if (!response.success) {
        toast.error(response.message);

        setNotificationValues(
          (current) =>
            ({
              ...current,
              [group]: {
                ...(current[group] as Record<string, ChannelPreference>),
                [fieldKey]: previousChannel,
              },
            }) as NotificationSettings,
        );
      }
    } finally {
      setRowLoading(loadingKey, false);
    }
  };

  const handleDeliveryModeChange = async (
    group: NotificationGroupKey,
    field: NotificationFieldKey,
    value: string,
  ) => {
    const fieldKey = String(field);
    const loadingKey = `${group}.${fieldKey}.delivery_mode`;

    const previousChannel = (
      notificationValues[group] as Record<string, ChannelPreference>
    )[fieldKey];

    const nextChannel: ChannelPreference = getDeliveryModeChannels(value);

    const nextValues = {
      ...notificationValues,
      [group]: {
        ...(notificationValues[group] as Record<string, ChannelPreference>),
        [fieldKey]: nextChannel,
      },
    } as NotificationSettings;

    setNotificationValues(nextValues);
    setRowLoading(loadingKey, true);

    try {
      const response = await updateNotificationSettings({
        notification_settings: nextValues,
      });

      if (!response.success) {
        toast.error(response.message);

        setNotificationValues(
          (current) =>
            ({
              ...current,
              [group]: {
                ...(current[group] as Record<string, ChannelPreference>),
                [fieldKey]: previousChannel,
              },
            }) as NotificationSettings,
        );
      }
    } finally {
      setRowLoading(loadingKey, false);
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
      const rowLoadingKey = `${groupKey}.${String(fieldKey)}`;
      const isRowLoading = Array.from(loadingKeys).some((key) =>
        key.startsWith(rowLoadingKey),
      );
      const deliveryMode = getDeliveryModeValue(fieldValue);
      const showInAppToggle = deliveryMode !== 'disabled';

      return (
        <div
          key={`${groupKey}-${String(fieldKey)}`}
          className="rounded-xl border-white/10 bg-overbg/85 p-2 md:border md:p-4"
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

          <div
            className={
              showInAppToggle
                ? 'grid grid-cols-1 gap-4 xl:grid-cols-2'
                : 'grid grid-cols-1 gap-4'
            }
          >
            {showInAppToggle ? (
              <SoloToggle
                label="In-App Notification"
                description="Choose whether this alert should appear inside the REFCORE dashboard."
                checked={fieldValue.in_app}
                disabled={isRowLoading}
                loading={isLoadingKey(`${groupKey}.${String(fieldKey)}.in_app`)}
                onInfo={fieldMeta.in_app.onInfo}
                offInfo={fieldMeta.in_app.offInfo}
                onCheckedChange={(checked) =>
                  handleInAppToggle(groupKey, fieldKey, checked)
                }
              />
            ) : null}

            <SoloDropDownInput
              label="Delivery Mode"
              description="Choose the channel combination for this notification event."
              value={deliveryMode}
              options={deliveryModeOptions}
              disabled={isRowLoading}
              visualState={deliveryMode}
              loading={isLoadingKey(`${groupKey}.${String(fieldKey)}.delivery_mode`)}
              leftAdornment={<MessageCircleMore className="size-4" />}
              onChange={(value) =>
                handleDeliveryModeChange(groupKey, fieldKey, value)
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
                notificationValues.participant_notifications
                  .referral_successful,
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

      {(
        Object.keys(notificationSettingsFieldMeta) as NotificationGroupKey[]
      ).map((groupKey) => {
        const groupMeta = notificationSettingsFieldMeta[groupKey];
        const groupValues = notificationValues[groupKey];

        return (
          <div
            key={groupKey}
            className="space-y-10 md:space-y-4 md:rounded-xl md:border md:border-white/10 md:bg-overbg/50 md:p-5"
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

            <div className="space-y-10 md:space-y-4">
              {renderNotificationRows(
                groupKey,
                groupMeta.fields as never,
                groupValues as never,
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationsSettingsSection;
