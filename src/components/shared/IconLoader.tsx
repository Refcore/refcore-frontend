import React from 'react';
import { cn } from '@/lib/utils';

type IconLoaderProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  className?: string;
};

const IconLoader = ({
  children,
  isLoading = true,
  loadingText = 'Loading',
  className,
}: IconLoaderProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        {isLoading && (
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-r-[#00ff9d] border-t-[#00d0ff]" />
        )}

        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
          {children}
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">{loadingText}</p>
      )}
    </div>
  );
};

export default IconLoader;