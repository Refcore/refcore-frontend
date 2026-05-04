import Image from 'next/image';
import { cn } from '@/lib/utils';

type CompanyLogoProps = {
  noText?: boolean;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
};

export default function CompanyLogo({
  noText = false,
  className,
  imageClassName,
  width,
  height,
}: CompanyLogoProps) {
  const logoSrc = noText ? '/images/logo-main.png' : '/images/logo-text.png';

  const imageWidth = width ?? (noText ? 40 : 150);
  const imageHeight = height ?? (noText ? 40 : 44);

  return (
    <div className={cn('flex items-center', className)}>
      <Image
        alt="REFCORE logo"
        src={logoSrc}
        width={imageWidth}
        height={imageHeight}
        priority
        className={cn('h-auto w-auto object-contain', imageClassName)}
      />
    </div>
  );
}