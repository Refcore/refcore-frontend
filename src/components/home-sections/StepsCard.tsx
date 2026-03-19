import React from 'react';
import { cn } from '@/lib/utils';
import WhatsAppIcon from '../icons/WhatsappIcon';
import { ArrowUp, Copy } from 'lucide-react';

type StepsCardProps = {
  stepNumber: string;
  title: string;
  description: string;
  className?: string;
};

const StepsCard = ({
  stepNumber,
  title,
  description,
  className,
}: StepsCardProps) => {
  const textColor =
    stepNumber === '01'
      ? 'text-[#00d0ff]'
      : stepNumber === '02'
        ? 'text-[#b700ff]'
        : 'text-[#00ff9d]';

  const step1 = stepNumber === '01';
  const step2 = stepNumber === '02';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border-2 border-white/5 bg-white/5 backdrop-blur-xl',
        'p-3 sm:p-6 lg:p-7',
        'transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:bg-white/6',
        'shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:shadow-[0_18px_45px_rgba(0,0,0,0.28)]',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl transition-all duration-300 group-hover:scale-110 group-hover:opacity-100',
          stepNumber === '01'
            ? 'bg-[radial-gradient(circle,rgba(0,208,255,0.55)_0%,rgba(0,208,255,0.3)_24%,rgba(0,208,255,0.14)_48%,transparent_75%)] opacity-55'
            : stepNumber === '02'
              ? 'bg-[radial-gradient(circle,rgba(183,0,255,0.55)_0%,rgba(183,0,255,0.3)_24%,rgba(183,0,255,0.14)_48%,transparent_75%)] opacity-55'
              : 'bg-[radial-gradient(circle,rgba(0,255,157,0.55)_0%,rgba(0,255,157,0.3)_24%,rgba(0,255,157,0.14)_48%,transparent_75%)] opacity-55',
        )}
      />

      <div className="relative z-10 flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg border border-white/10 text-base sm:text-lg font-semibold ${textColor} shadow-inner`}
          >
            {stepNumber}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight text-white">
            {title}
          </h3>

          <p className="text-sm sm:text-base leading-6 text-white/65">
            {description}
          </p>
        </div>

        <div className="bg-background p-2 rounded-md">
          {step1 ? (
            <div className="flex gap-2">
              <WhatsAppIcon color="green" />
              <p className="bg-white/5 text-sm w-fit p-2 rounded-md rounded-tl-none">
                JOIN contest
              </p>
            </div>
          ) : step2 ? (
            <div className="bg-white/5 text-sm text-muted-foreground border border-dashed p-2 rounded-md flex justify-between">
              ref.co/user123
              <Copy className="w-4 h-4" />
            </div>
          ) : (
            <div className="space-y-2">
              <p className="flex items-center text-[#00ff9d] text-sm">
                Rank up <ArrowUp className="w-4 h-4" />
              </p>
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-1">
                <div
                  className="bg-linear-to-r from-[#00d0ff] to-[#00ff9d] h-1.5 rounded-full"
                  style={{ width: '80%' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepsCard;
