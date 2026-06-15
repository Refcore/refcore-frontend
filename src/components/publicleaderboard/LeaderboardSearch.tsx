'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Hash,
  MessageSquareText,
  ArrowRight,
  Loader2,
  Radio,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PUBLIC_ROUTES } from '@/routes';
import { useSearchPublicChannels } from '@/hooks/public/useSearchPublicChannels';
import { getStorageFileUrl } from '@/utils/getStorageFileUrl';

type LeaderboardSearchProps = {
  className?: string;
  placeholder?: string;
};

export default function LeaderboardSearch({
  className,
  placeholder = 'Enter WhatsApp TV name or paste channel code',
}: LeaderboardSearchProps) {
  const router = useRouter();

  const [value, setValue] = React.useState('');
  const [debouncedValue, setDebouncedValue] = React.useState('');
  const [error, setError] = React.useState('');

  const cleanValue = value.trim();
  const shouldShowResults = cleanValue.length > 0;

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(cleanValue);
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [cleanValue]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error: searchError,
  } = useSearchPublicChannels({
    search: debouncedValue,
    limit: 6,
  });

  const channels = data?.channels ?? [];
  const isSearching =
    shouldShowResults && debouncedValue && (isLoading || isFetching);

  const navigateToLeaderboard = (slug: string) => {
    const safeSlug = slug.trim();

    if (!safeSlug) return;

    setError('');
    router.push(`${PUBLIC_ROUTES.LEADERBOARD}/${encodeURIComponent(safeSlug)}`);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!cleanValue) {
      setError('Please enter a WhatsApp TV name or code.');
      return;
    }

    setError('');

    if (channels.length > 0) {
      navigateToLeaderboard(channels[0].slug);
      return;
    }

    router.push(
      `${PUBLIC_ROUTES.LEADERBOARD}/${encodeURIComponent(cleanValue)}`,
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    if (error) {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="relative">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/45" />

              <Input
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                aria-label="Search leaderboard by WhatsApp TV name or code"
                className="h-14 rounded-2xl border-0 bg-transparent pl-12 pr-4 text-base text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#8b5cf6]/70 focus-visible:ring-offset-0"
              />
            </div>

            <Button
              type="submit"
              className="h-14 rounded-2xl bg-[linear-gradient(#2563eb_50%,#0b9eca_100%)] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(91,62,244,0.35)] hover:opacity-95"
            >
              Search
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        {shouldShowResults ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-2xl border border-white/10 bg-[#101018]/95 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            {isSearching ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-white/65">
                <Loader2 className="size-4 animate-spin text-[#00d0ff]" />
                Searching channels...
              </div>
            ) : isError ? (
              <div className="px-4 py-3 text-sm text-red-400">
                {searchError instanceof Error
                  ? searchError.message
                  : 'Unable to search channels.'}
              </div>
            ) : channels.length > 0 ? (
              <div className="max-h-72 overflow-y-auto p-1.5 no-scrollbar">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => navigateToLeaderboard(channel.slug)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/5"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      {channel.channel_banner ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={
                            getStorageFileUrl(
                              'channel_banners',
                              channel.channel_banner,
                            ) ?? channel.channel_banner
                          }
                          alt={channel.tv_name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Radio className="size-4 text-[#00d0ff]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {channel.tv_name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-white/45">
                        /{channel.slug}
                      </p>
                    </div>

                    <ArrowRight className="size-4 shrink-0 text-white/35" />
                  </button>
                ))}
              </div>
            ) : debouncedValue ? (
              <div className="px-4 py-3 text-sm text-white/55">
                No channels found for “{debouncedValue}”.
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/55">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <MessageSquareText className="size-3.5" />
            Search by channel name
          </span>

          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <Hash className="size-3.5" />
            Or paste a code directly
          </span>
        </div>
      )}
    </form>
  );
}
