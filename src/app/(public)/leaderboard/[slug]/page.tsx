import SlugPageClient from '@/components/publicleaderboard/SlugPageClient';

type SlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const SlugPage = async ({ params }: SlugPageProps) => {
  const { slug } = await params;

  return <SlugPageClient slug={slug} />;
};

export default SlugPage;
