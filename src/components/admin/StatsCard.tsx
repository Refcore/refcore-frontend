'use client';

import React, { type ReactNode } from 'react';
import { Lock, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatsCardProps = {
  title: string;
  description: string;
  value: ReactNode;
  info?: ReactNode;
  icon: LucideIcon;
  color: `#${string}`;
  locked?: boolean;
  lockedText?: string;
  className?: string;
};

const hexToRgba = (hex: string, alpha: number) => {
  const cleanHex = hex.replace('#', '');

  const normalizedHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex;

  const r = parseInt(normalizedHex.slice(0, 2), 16);
  const g = parseInt(normalizedHex.slice(2, 4), 16);
  const b = parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const StatsCard = ({
  title,
  description,
  value,
  info,
  icon: Icon,
  color,
  locked = false,
  lockedText = 'Locked',
  className,
}: StatsCardProps) => {
  const borderColor = hexToRgba(color, 0.2);
  const hoverBorderColor = hexToRgba(color, 0.4);
  const iconBg = hexToRgba(color, 0.14);
  const iconBorder = hexToRgba(color, 0.24);
  const glowColor = hexToRgba(color, 0.16);
  const glowHoverColor = hexToRgba(color, 0.26);
  const overlayBg = 'rgba(10, 10, 15, 0.72)';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 bg-[#1c1c26]/60 p-3 md:p-6 backdrop-blur-xl transition-all duration-300',
        'hover:-translate-y-1',
        className,
      )}
      style={{
        borderColor: locked ? borderColor : borderColor,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor = hoverBorderColor;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor = borderColor;
      }}
    >
      <div
        className="pointer-events-none absolute top-0 right-0 h-22 w-30 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundColor: glowColor,
        }}
      />

      <div
        className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-10"
        style={{
          backgroundColor: glowHoverColor,
        }}
      />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl border"
            style={{
              backgroundColor: iconBg,
              borderColor: iconBorder,
            }}
          >
            <Icon className="size-5" style={{ color }} />
          </div>

          {info ? (
            <div className="shrink-0 text-right text-xs font-bold" style={{ color }}>
              {info}
            </div>
          ) : null}
        </div>

        <div className="mb-1 text-3xl font-black text-white">{value}</div>
        <div className="text-sm text-muted-foreground">{description}</div>

        <p className="mt-2 text-xs font-medium" style={{ color }}>
          {title}
        </p>
      </div>

      {locked ? (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 px-4 text-center backdrop-blur-[2px]"
          style={{ backgroundColor: overlayBg }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full border"
            style={{
              backgroundColor: hexToRgba(color, 0.16),
              borderColor: hexToRgba(color, 0.28),
            }}
          >
            <Lock className="size-5 text-white" />
          </div>

          <p className="text-sm font-semibold text-white">{lockedText}</p>
          <p className="max-w-55 text-xs text-white/70">
            This metric is not available right now.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default StatsCard;