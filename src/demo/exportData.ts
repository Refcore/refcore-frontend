import type { ExportCardItem, RecentExportItem } from '@/types/export.type';

export const exportCardData: ExportCardItem[] = [
  {
    id: 'winners_export',
    title: 'Winners Export',
    description:
      'Download ranked winners with referral totals and payout-ready contest results.',
    icon_name: 'trophy',
    export_type: 'winners',
    available_formats: ['csv', 'xlsx'],
    quick_actions: [
      { label: 'Top 10', value: 'top_10' },
      { label: 'Include rank', value: 'include_rank' },
      { label: 'Include reward', value: 'include_reward' },
    ],
    button_label: 'Export Winners',
  },
  {
    id: 'participants_export',
    title: 'Participants Export',
    description:
      'Download participant records, join history, and referral identity details.',
    icon_name: 'users',
    export_type: 'participants',
    available_formats: ['csv', 'xlsx'],
    quick_actions: [
      { label: 'All participants', value: 'all_participants' },
      { label: 'Verified only', value: 'verified_only' },
      { label: 'Joined today', value: 'joined_today' },
    ],
    button_label: 'Export Participants',
  },
  {
    id: 'referrals_export',
    title: 'Referrals Export',
    description:
      'Download validated referral logs for contest auditing and performance checks.',
    icon_name: 'link',
    export_type: 'referrals',
    available_formats: ['csv', 'xlsx'],
    quick_actions: [
      { label: 'Successful only', value: 'successful_only' },
      { label: 'This contest', value: 'this_contest' },
      { label: 'Include timestamps', value: 'include_timestamps' },
    ],
    button_label: 'Export Referrals',
  },
  {
    id: 'activity_logs_export',
    title: 'Activity Logs Export',
    description:
      'Download messaging and activity logs for support, abuse review, and traceability.',
    icon_name: 'activity',
    export_type: 'activity_logs',
    available_formats: ['csv'],
    quick_actions: [
      { label: 'Inbound only', value: 'inbound_only' },
      { label: 'Outbound only', value: 'outbound_only' },
      { label: 'Last 7 days', value: 'last_7_days' },
    ],
    button_label: 'Export Activity Logs',
  },
];

export const recentExportsData: RecentExportItem[] = [
  {
    id: 'export_1',
    file_name: 'lagos_gist_tv_winners_march.csv',
    export_type: 'winners',
    contest_name: 'Lagos Gist TV March Contest',
    created_at: '2026-04-16T08:15:00Z',
    exported_by: 'Admin User',
    status: 'ready',
    format: 'csv',
  },
  {
    id: 'export_2',
    file_name: 'lagos_gist_tv_participants_april.xlsx',
    export_type: 'participants',
    contest_name: 'Lagos Gist TV April Contest',
    created_at: '2026-04-15T16:42:00Z',
    exported_by: 'Admin User',
    status: 'ready',
    format: 'xlsx',
  },
  {
    id: 'export_3',
    file_name: 'lagos_gist_tv_referrals_week_2.csv',
    export_type: 'referrals',
    contest_name: 'Lagos Gist TV April Contest',
    created_at: '2026-04-15T12:05:00Z',
    exported_by: 'Admin User',
    status: 'processing',
    format: 'csv',
  },
  {
    id: 'export_4',
    file_name: 'lagos_gist_tv_activity_logs.csv',
    export_type: 'activity_logs',
    contest_name: 'Lagos Gist TV April Contest',
    created_at: '2026-04-14T10:20:00Z',
    exported_by: 'Admin User',
    status: 'failed',
    format: 'csv',
  },
];