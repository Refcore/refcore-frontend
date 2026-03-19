import {
  Bot,
  Shield,
  Trophy,
  PieChart,
  WandSparkles,
  type LucideIcon,
  CheckCircle2,
} from 'lucide-react';

export type PerformanceCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  color?: string;
};

export const performanceData: PerformanceCardProps[] = [
  {
    icon: Bot,
    title: '100% Automated',
    description:
      'Bot handles joins, link generation, and point tracking automatically. Zero manual work required.',
    color: 'blue',
  },
  {
    icon: Shield,
    title: 'Anti-Cheat System',
    description:
      'Detects fake numbers, duplicate IPs, and bot accounts instantly to keep your contest fair.',
      color: 'orange',
  },
  {
    icon: Trophy,
    title: 'Real-time Leaderboard',
    description:
      'Beautiful, public web leaderboards that update instantly, driving competition among users.',
      color: 'purple',
  },
  {
    icon: CheckCircle2,
    title: 'Native WhatsApp',
    description:
      'Users never leave WhatsApp. The entire experience happens right where they are most active.',
      color: 'green',
  },
  {
    icon: PieChart,
    title: 'Deep Analytics',
    description:
      'Track conversion rates, top referrers, and overall campaign ROI from a sleek dashboard.',
      color: 'yellow',
  },
  {
    icon: WandSparkles,
    title: 'Easy Setup',
    description:
      'Connect your WhatsApp API, set your rules, and launch in under 5 minutes without coding.',
      color: 'pink',
  },
];
