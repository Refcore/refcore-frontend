'use client';

import * as React from 'react';
import Image from 'next/image';
import { Camera, Upload, User2, X } from 'lucide-react';
import { useController, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';

type UploadProfilePictureProps = {
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

const UploadProfilePicture = ({
  name,
  label = 'Profile Picture',
  description = 'Upload a PNG, JPG, or WEBP image up to 5MB.',
  required = false,
  disabled = false,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
}: UploadProfilePictureProps) => {
  const { control, setValue } = useFormContext();

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
      setPreviewUrl(field.value || null);
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
      setValue(name, null, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    setValue(name, selectedFile, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    event.target.value = '';
  };

  const handleRemoveImage = () => {
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="mx-auto sm:mx-0">
            <div className="relative size-24 overflow-hidden rounded-full border border-white/10 bg-white/5 sm:size-28 md:size-32">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile picture preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User2 className="size-10 text-white/30 md:size-12" />
                </div>
              )}

              {!disabled ? (
                <button
                  type="button"
                  onClick={handleOpenFilePicker}
                  className={cn(
                    'absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full',
                    'border border-white/10 bg-[#00ff9d] text-black shadow-lg transition hover:scale-105',
                    'md:size-9',
                  )}
                >
                  <Camera className="size-4 md:size-4.5" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-3 text-center sm:text-left">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white md:text-base">
                {previewUrl ? 'Update profile picture' : 'Upload profile picture'}
              </p>
              <p
                className={cn(
                  'text-xs leading-5 text-white/50 md:text-sm',
                  descriptionClassName,
                )}
              >
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={handleOpenFilePicker}
                disabled={disabled}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition',
                  'border border-white/10 bg-white/5 text-white hover:bg-white/10',
                  'disabled:cursor-not-allowed disabled:opacity-60',
                )}
              >
                <Upload className="size-4" />
                <span>{previewUrl ? 'Change Image' : 'Choose Image'}</span>
              </button>

              {previewUrl ? (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={disabled}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition',
                    'border border-red-400/25 bg-red-500/10 text-red-300 hover:bg-red-500/15',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                  )}
                >
                  <X className="size-4" />
                  <span>Remove</span>
                </button>
              ) : null}
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/45">
              Recommended: square image, at least 400x400px
            </div>
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

export default UploadProfilePicture;