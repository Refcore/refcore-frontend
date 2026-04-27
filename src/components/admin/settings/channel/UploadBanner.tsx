'use client';

import * as React from 'react';
import Image from 'next/image';
import { Camera, Upload, X, ImageIcon } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';
import { getStorageFileUrl } from '@/utils/getStorageFileUrl';

import { cn } from '@/lib/utils';

type UploadChannelBannerProps = {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const UploadChannelBanner = ({
  name,
  label = 'Channel Banner',
  description = 'Upload a PNG, JPG, or WEBP banner up to 5MB.',
  required = false,
  disabled = false,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
}: UploadChannelBannerProps) => {
  const { control, setValue, setError, clearErrors } = useFormContext();

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    typeof field.value === 'string' && field.value ? field.value : null,
  );

  React.useEffect(() => {
     if (typeof field.value === 'string') {
        setPreviewUrl(
          field.value ? getStorageFileUrl('channel_banners', field.value) : null,
        );
        return;
      }

    if (field.value instanceof File) {
      const objectUrl = URL.createObjectURL(field.value);
      setPreviewUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setPreviewUrl(null);
  }, [field.value]);

  const handleOpenFilePicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(name, {
        type: 'manual',
        message: 'Channel banner must not exceed 5MB.',
      });

      event.target.value = '';
      return;
    }

    clearErrors(name);

    setValue(name, selectedFile, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    event.target.value = '';
  };

  const handleRemoveBanner = () => {
    setValue(name, null, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label ? (
        <label
          className={cn(
            'inline-flex items-center gap-1 text-sm font-medium text-white/90 md:text-base',
            labelClassName,
          )}
        >
          <span>{label}</span>
          {required ? <span className="text-[#00ff9d]">*</span> : null}
        </label>
      ) : null}

      <div
        className={cn(
          'rounded-xl border border-white/10 bg-white/5 p-4 md:p-5',
          error ? 'border-red-400/60' : '',
          disabled ? 'opacity-70' : '',
        )}
      >
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="relative aspect-3/1 w-full">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Channel banner preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-white/35">
                    <ImageIcon className="size-8 md:size-10" />
                    <span className="text-xs md:text-sm">
                      No banner uploaded
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!disabled ? (
              <button
                type="button"
                onClick={handleOpenFilePicker}
                className={cn(
                  'absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full',
                  'border border-white/10 bg-[#00ff9d] text-black shadow-lg transition hover:scale-105',
                )}
              >
                <Camera className="size-4" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleOpenFilePicker}
              disabled={disabled}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-1 text-sm font-medium transition',
                'border border-white/10 bg-white/5 text-white hover:bg-white/10',
                'disabled:cursor-not-allowed disabled:opacity-60',
              )}
            >
              <Upload className="size-4" />
              <span>{previewUrl ? 'Change Banner' : 'Choose Banner'}</span>
            </button>

            {previewUrl ? (
              <button
                type="button"
                onClick={handleRemoveBanner}
                disabled={disabled}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-1 text-sm font-medium transition',
                  'border border-red-400/25 bg-red-500/10 text-red-300 hover:bg-red-500/15',
                  'disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                <X className="size-4" />
                <span>Remove</span>
              </button>
            ) : null}
          </div>

          <p
            className={cn(
              'text-xs leading-5 text-white/50 md:text-sm',
              descriptionClassName,
            )}
          >
            {description}
          </p>

          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/45">
            Recommended: wide banner image, around 1500 x 500px
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>

      {error ? (
        <p
          className={cn(
            'text-xs font-medium leading-5 text-red-400 md:text-sm',
            errorClassName,
          )}
        >
          {error.message}
        </p>
      ) : null}
    </div>
  );
};

export default UploadChannelBanner;
