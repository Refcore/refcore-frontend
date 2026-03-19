import Hero from '@/components/home-sections/Hero';
import TrustedBy from '@/components/home-sections/TrustedBy';
import Navbar from '@/components/shared/Navbar';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustedBy />
    </main>
  );
}
