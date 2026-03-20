import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Plans } from '@/consts/plans';

const PriceCard = ({
  title,
  description,
  price,
  perks,
  buttonText,
  mostpopular,
}: Plans) => {
  return (
    <div
      className={cn(
        'relative flex w-full md:max-w-100 h-full flex-col rounded-3xl border-2 bg-[#0b0d1a] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-300',
        mostpopular
          ? 'border-primary shadow-[0_0_0_1px_hsl(var(--primary)),0_0_30px_rgba(183,0,255,0.18)]'
          : 'border-white/5',
      )}
    >
      {mostpopular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-primary to-cyan-400 px-4 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-3xl font-bold text-white">{title}</h3>
        <p className="mt-3 max-w-60 text-sm leading-6 text-white/60">
          {description}
        </p>
      </div>

      <div className="mb-8 flex items-end gap-1 text-white">
        <span className="text-5xl font-extrabold leading-none">${price}</span>
        <span className="mb-1 text-base text-white/65">/mo</span>
      </div>

      <div className="mb-10 space-y-4">
        {perks?.map((perk, index) => {
          const isDisabled =
            typeof perk === 'object' ? perk.disabled : false;
          const label =
            typeof perk === 'object' ? perk.label : perk;

          return (
            <div
              key={`${label}-${index}`}
              className={cn(
                'flex items-center gap-3 text-sm font-medium',
                isDisabled ? 'text-white/20' : 'text-white/85',
              )}
            >
              <span className="mt-0.5 shrink-0">
                {isDisabled ? (
                  <X className="h-4 w-4 text-white/20" />
                ) : (
                  <Check className="h-4 w-4 text-emerald-400" />
                )}
              </span>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      <button
        className={cn(
          'mt-auto h-14 w-full rounded-2xl border text-sm font-semibold transition-all duration-300 cursor-pointer',
          mostpopular
            ? 'border-0 bg-linear-to-r from-primary via-blue-500 to-cyan-400 text-white shadow-[0_10px_30px_rgba(0,170,255,0.25)] hover:shadow-none hover:opacity-90'
            : 'border-white/8 bg-white/3 text-white hover:bg-primary/10',
        )}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PriceCard;