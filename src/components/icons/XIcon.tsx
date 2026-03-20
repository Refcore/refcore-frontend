import type { SVGProps } from 'react';

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M18.244 2H21l-6.02 6.88L22 22h-5.828l-4.563-5.804L6.53 22H3.772l6.44-7.36L2 2h5.976l4.124 5.247zm-.967 18h1.527L7.148 3.894H5.51z"
      />
    </svg>
  );
}
