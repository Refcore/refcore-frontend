import 'server-only';
import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/prisma';

const DEBUG_METADATA =
  process.env.NODE_ENV !== 'production' ||
  process.env.DEBUG_METADATA === 'true';

const metadataLog = (message: string, data?: unknown) => {
  if (!DEBUG_METADATA) return;

  console.info(`[public-leaderboard-metadata] ${message}`, data ?? '');
};

const metadataError = (message: string, error?: unknown) => {
  console.error(`[public-leaderboard-metadata] ${message}`, error ?? '');
};

export const getPublicChannelBySlugForMetadata = async (slug: string) => {
  noStore();

  const started_at = Date.now();
  const clean_slug = decodeURIComponent(slug).trim();

  metadataLog('START fetch metadata data', {
    raw_slug: slug,
    clean_slug,
  });

  try {
    const channel = await prisma.channels.findUnique({
      where: {
        slug: clean_slug,
      },
      select: {
        id: true,
        tv_name: true,
        slug: true,
        channel_banner: true,
        live_contest: true,
        status: true,
      },
    });

    metadataLog('DB channel result', {
      found_channel: Boolean(channel),
      channel_id: channel?.id,
      channel_slug: channel?.slug,
      tv_name: channel?.tv_name,
      channel_status: channel?.status,
      live_contest: channel?.live_contest,
      has_banner: Boolean(channel?.channel_banner),
      duration_ms: Date.now() - started_at,
    });

    if (!channel) {
      metadataLog('RETURN null: no channel found for slug', {
        clean_slug,
      });

      return null;
    }

    const active_contest = await prisma.contests.findFirst({
      where: {
        channel_id: channel.id,
        status: 'active',
        visibility: 'public',
        is_published: true,
        is_archived: false,
      },
      orderBy: {
        start_date: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        status: true,
        visibility: true,
        is_published: true,
        is_archived: true,
        start_date: true,
        end_date: true,
        participants_count: true,
        referrals_count: true,
      },
    });

    metadataLog('Active contest query result', {
      found_active_contest: Boolean(active_contest),
      contest_id: active_contest?.id,
      contest_slug: active_contest?.slug,
      contest_title: active_contest?.title,
      contest_status: active_contest?.status,
      contest_visibility: active_contest?.visibility,
      is_published: active_contest?.is_published,
      is_archived: active_contest?.is_archived,
    });

    if (!active_contest) {
      const recent_contests = await prisma.contests.findMany({
        where: {
          channel_id: channel.id,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          visibility: true,
          is_published: true,
          is_archived: true,
          start_date: true,
          end_date: true,
        },
      });

      metadataLog('RETURN null: no active public published contest found', {
        channel_id: channel.id,
        channel_slug: channel.slug,
        live_contest: channel.live_contest,
        recent_contests,
      });

      return null;
    }

    metadataLog('SUCCESS metadata data ready', {
      channel_id: channel.id,
      channel_slug: channel.slug,
      contest_id: active_contest.id,
      contest_title: active_contest.title,
      duration_ms: Date.now() - started_at,
    });

    return {
      channel: {
        id: channel.id,
        tv_name: channel.tv_name,
        slug: channel.slug,
        channel_banner: channel.channel_banner,
      },
      active_contest,
    };
  } catch (error) {
    metadataError('FAILED fetch metadata data', {
      slug,
      clean_slug,
      error,
      duration_ms: Date.now() - started_at,
    });

    return null;
  }
};