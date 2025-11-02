export function Logo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="url(#gradient)" />
      <g filter="url(#shadow)">
        <path
          d="M14 18C14 16.8954 14.8954 16 16 16H20C21.1046 16 22 16.8954 22 18V20C22 21.1046 21.1046 22 20 22H16C14.8954 22 14 21.1046 14 20V18Z"
          fill="white"
          opacity="0.95"
        />
        <path
          d="M26 18C26 16.8954 26.8954 16 28 16H32C33.1046 16 34 16.8954 34 18V20C34 21.1046 33.1046 22 32 22H28C26.8954 22 26 21.1046 26 20V18Z"
          fill="white"
          opacity="0.95"
        />
        <path
          d="M14 26C14 24.8954 14.8954 24 16 24H32C33.1046 24 34 24.8954 34 26V30C34 31.1046 33.1046 32 32 32H16C14.8954 32 14 31.1046 14 30V26Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="0.5" stopColor="#2563EB" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <filter id="shadow" x="10" y="14" width="28" height="22" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feOffset in="blur" dx="0" dy="1" result="offsetBlur"/>
          <feMerge>
            <feMergeNode in="offsetBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
