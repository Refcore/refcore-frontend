'use client';

import Image from 'next/image';

const logos = [
  '/images/tv.png',
  '/images/tv.png',
  '/images/tv.png',
  '/images/tv.png',
  '/images/tv.png',
];

const TrustedBy = () => {
  return (
    <section className="w-full py-8 md:py-16">
      <div className="mx-auto max-w-(--breakpoint-2xl) px-6 md:px-12 text-center">
        {/* Heading */}
        <p className="text-2xl md:text-5xl font-semibold text-muted-foreground mb-8">
          Trusted by fast-growing brands
        </p>

        {/* Logos */}
        <div className="overflow-hidden max-w-2xl mx-auto">
          <div className="flex gap-12 animate-scroll">
            {[...logos, ...logos].map((logo, i) => (
              <Image key={i} src={logo} alt="" width={120} height={40} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
