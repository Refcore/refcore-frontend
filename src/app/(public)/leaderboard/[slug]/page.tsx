import type { Metadata } from 'next';
import SlugPageClient from '@/components/publicleaderboard/SlugPageClient';
import { getPublicChannelBySlugForMetadata } from '@/lib/server/public-leaderboard';
import { getStorageFileUrl } from '@/utils/getStorageFileUrl';

type SlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  console.info('[slug-page-metadata] generateMetadata called', {
    slug,
  });

  const data = await getPublicChannelBySlugForMetadata(slug);

  console.info('[slug-page-metadata] metadata fetch completed', {
    slug,
    found_data: Boolean(data),
    channel_slug: data?.channel.slug,
    contest_id: data?.active_contest.id,
    contest_title: data?.active_contest.title,
  });

  if (!data) {
    console.warn('[slug-page-metadata] returning fallback metadata', {
      slug,
      reason: 'No metadata data returned from server helper',
    });

    return {
      title: 'Leaderboard not found | REFCORE',
      description: 'This public leaderboard is not available.',
    };
  }

  const { channel, active_contest } = data;

  const title = `${channel.tv_name} Leaderboard | ${active_contest.title}`;

  const description =
    active_contest.description ||
    `View the live referral leaderboard for ${channel.tv_name}.`;

  const bannerUrl = channel.channel_banner
    ? getStorageFileUrl('channel_banners', channel.channel_banner)
    : '/images/og-image.png';

  console.info('[slug-page-metadata] returning dynamic metadata', {
    title,
    description,
    bannerUrl,
    has_channel_banner: Boolean(channel.channel_banner),
  });

  return {
    title: {
      absolute: title,
    },
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: bannerUrl ?? '',
          width: 1200,
          height: 630,
          alt: `${channel.tv_name} contest banner`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bannerUrl ?? ''],
    },
  };
}

const SlugPage = async ({ params }: SlugPageProps) => {
  const { slug } = await params;

  return <SlugPageClient slug={slug} />;
};

export default SlugPage;
