import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import HeroFloatingCard from './HeroFloatingCard';

const Hero = () => {
  return (
    <div className="relative h-screen w-full">
      <div className="mx-auto pt-25 lg:pt-30 border-white h-full flex flex-col lg:flex-row w-full max-w-(--breakpoint-2xl) justify-between px-6 md:px-12">
        <div className="flex-1 flex flex-col items-center lg:items-start w-full lg:w-[50%] gap-6 md:gap-14">
          <div className="text-xs border-2 rounded-2xl px-4 py-2 backdrop-blur-2xl flex items-center gap-2 w-fit">
            <p className="h-2 w-2 shrink-0 bg-green-400 rounded-full animate-pulse"></p>{' '}
            v2.0 Live: Advanced Anti-Cheat
          </div>
          <h1 className="font-bold text-center lg:text-left leading-[1.1] tracking-tight text-6xl lg:text-7xl">
            Run Viral <br />
            WhatsApp <br />
            <span className="text-gradient-success">
              Referral Contests
            </span>{' '}
            Automatically
          </h1>
          <p className="text-muted-foreground max-w-lg text-center lg:text-left">
            No manual counting. No cheating. Just growth. Turn your WhatsApp
            channel audience into a highly competitive growth engine.
          </p>
          <div className="flex gap-4">
            <Button
              className="
  md:text-lg px-5 py-6 rounded-2xl border-none text-white
  bg-linear-to-r from-[#b700ff] via-[#00d0ff] to-[#0b9eca]

  shadow-[0_10px_30px_rgba(183,0,255,0.35)]
  
  transition-all duration-200 ease-out

  hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]
  hover:translate-y-0.5

  active:translate-y-1
  active:shadow-[0_2px_6px_rgba(0,0,0,0.2)]
  "
            >
              Start Your Contest <ArrowRight />
            </Button>
            <Button
              variant={'outline'}
              className="md:text-lg px-5 py-6 rounded-2xl"
            >
              See How it Works
            </Button>
          </div>
          <div className="text-sm flex gap-4">
            <p className="flex items-center gap-2">
              <Check className="text-green-400 h-4 w-4" /> Set up in 5Mins
            </p>
            <p className="flex items-center gap-2">
              <Check className="text-green-400 h-4 w-4" />
              100% Automated
            </p>
          </div>
        </div>
        <div className="flex-1 hidden lg:flex lg:w-[50%] items-center justify-end">
          <HeroFloatingCard />
        </div>
      </div>

      <div className="absolute bg-black/20 top-0 right-0 opacity-50 -z-5 h-full w-full ">
        <Image
          src={'/images/green_variant.webp'}
          className="pointer-events-none h-full w-full object-cover select-none"
          alt=""
          fill
        />
      </div>
    </div>
  );
};

export default Hero;
