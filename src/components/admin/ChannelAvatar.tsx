'use client';

import React from 'react';
import Image from 'next/image';
import { useAuthContext } from '@/context/AuthContext';
import { getStorageFileUrl } from '@/utils/getStorageFileUrl';
import { cn } from '@/lib/utils';

const getChannelInitial = (tv_name?: string | null) => {
  if (!tv_name) return 'C';

  const trimmed_name = tv_name.trim();

  if (!trimmed_name) return 'C';

  return trimmed_name.charAt(0).toUpperCase();
};

const ChannelAvatar = () => {
  const { myChannel } = useAuthContext();

  const channel_banner_url = myChannel?.channel_banner
    ? getStorageFileUrl('channel_banners', myChannel.channel_banner)
    : null;

  const channel_initial = getChannelInitial(myChannel?.tv_name);

  return (
    <div className="hidden lg:flex  flex-col items-end">
      <div
        className={cn(
          'relative flex size-11 items-center justify-center overflow-hidden rounded-2xl',
          'border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(183,0,255,0.12)]',
          'transition-all duration-200',
          'hover:border-(--neon-purple)/40 hover:shadow-[0_0_24px_rgba(183,0,255,0.2)]',
        )}
      >
        {channel_banner_url ? (
          <>
            <Image
              src={channel_banner_url}
              alt={`${myChannel?.tv_name ?? 'Channel'} banner`}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-br from-(--neon-purple)/15 via-transparent to-(--neon-blue)/15" />
          </>
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center',
              'bg-linear-to-br from-(--neon-purple) via-[#8b2cff] to-(--neon-blue)',
              'text-sm font-black text-white',
            )}
          >
            {channel_initial}
          </div>
        )}
      </div>

      <p className='font-bold text-xl text-gradient-success'>{myChannel?.tv_name ?? 'Channel'}</p>
    </div>
  );
};

export default ChannelAvatar;