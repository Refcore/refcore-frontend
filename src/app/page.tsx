import BuilFor from '@/components/home-sections/BuilFor';
import Compete from '@/components/home-sections/Compete';
import Conclusion from '@/components/home-sections/Conclusion';
import Footer from '@/components/home-sections/Footer';
import Hero from '@/components/home-sections/Hero';
import Pricing from '@/components/home-sections/Pricing';
import Steps from '@/components/home-sections/Steps';
import TrustedBy from '@/components/home-sections/TrustedBy';
import Navbar from '@/components/shared/Navbar';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <div className="absolute bg-black/20 top-screen opacity-40 -z-5 h-full w-full">
        <Image
          src={'/svg/bbburst.svg'}
          className="pointer-events-none h-full w-full object-cover select-none"
          alt=""
          fill
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_top,transparent_0%,transparent_45%,rgba(10,10,15,0.35)_70%,rgba(10,10,15,0.75)_88%,#0a0a0f_100%)]" />
      </div>
      <TrustedBy />
      <Steps />
      <BuilFor />
      <Compete />
      <Pricing />
      <Conclusion />
      <Footer />
    </main>
  );
}
