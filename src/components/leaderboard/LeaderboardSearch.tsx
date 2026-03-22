'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Hash, MessageSquareText, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PUBLIC_ROUTES } from '@/routes';

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
  const [error, setError] = React.useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const clean = value.trim();

    if (!clean) {
      setError('Please enter a WhatsApp TV name or code.');
      return;
    }

    setError('');
    router.push(`${PUBLIC_ROUTES.LEADERBOARD}/${encodeURIComponent(clean)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-2 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/45" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              aria-label="Search leaderboard by WhatsApp TV name or code"
              className="h-14 rounded-2xl border-0 bg-transparent pl-12 pr-4 text-base text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-[#8b5cf6]/70 focus-visible:ring-offset-0"
            />
          </div>

          <Button
            type="submit"
            className="h-14 rounded-2xl px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(91,62,244,0.35)] bg-[linear-gradient(90deg,#7c3aed_0%,#2563eb_50%,#0b9eca_100%)] hover:opacity-95"
          >
            Search
            <ArrowRight className="size-4" />
          </Button>
        </div>
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
