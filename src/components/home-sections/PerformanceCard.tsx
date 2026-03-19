'use client';

import { PerformanceCardProps } from '@/consts/performance';
import { cn } from '@/lib/utils';
import React from 'react';

const colorVariants = {
  blue: {
    iconWrapper: 'bg-blue-400/10',
    icon: 'text-blue-400',
  },
  orange: {
    iconWrapper: 'bg-[#ff5a36]/10',
    icon: 'text-[#ff5a36]',
  },
  purple: {
    iconWrapper: 'bg-purple-400/10',
    icon: 'text-purple-400',
  },
  green: {
    iconWrapper: 'bg-green-400/10',
    icon: 'text-green-400',
  },
  yellow: {
    iconWrapper: 'bg-yellow-400/10',
    icon: 'text-yellow-400',
  },
  pink: {
    iconWrapper: 'bg-pink-400/10',
    icon: 'text-pink-400',
  },
} as const;

const PerformanceCard = ({
  icon,
  title,
  description,
  className,
  color,
}: PerformanceCardProps) => {
  const Icon = icon;

  const styles = color
    ? colorVariants[color as keyof typeof colorVariants]
    : colorVariants.blue;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border-2 border-white/5 bg-white/5 backdrop-blur-xl',
        'p-3 sm:p-4 lg:p-7',
        'shadow-[0_10px_30px_rgba(0,0,0,0.18)]',
        className,
      )}
    >
      <div className="relative z-10 flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 text-base font-semibold shadow-inner sm:h-14 sm:w-14 sm:text-lg',
              styles.iconWrapper,
            )}
          >
            <Icon className={cn('h-5 w-5', styles.icon)} />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="md:text-lg lg:text-xl font-semibold leading-tight text-white">
            {title}
          </h3>

          <p className="text-xs md:text-sm leading-6 text-white/65">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;
