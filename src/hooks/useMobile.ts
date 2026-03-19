import { useState, useEffect } from 'react';


export const useMobile = (breakpoint: number = 1024) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    onChange(mql);


    mql.addEventListener('change', onChange);
    
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
};