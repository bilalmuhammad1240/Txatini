import Link from 'next/link';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const SIZES = {
  sm: { width: 90, height: 28 },
  md: { width: 120, height: 36 },
  lg: { width: 160, height: 48 },
};

export default function Logo({
  variant = 'dark',
  size = 'md',
  href = '/',
}: LogoProps) {
  const { width, height } = SIZES[size];
  const color = variant === 'dark' ? '#1A4230' : '#FFFFFF';
  const accentColor = variant === 'dark' ? '#B85215' : '#F4A261';

  const svg = (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Txatiní"
    >
      {/* Símbolo: chama estilizada à esquerda */}
      <path
        d="M8 28 C8 28 6 22 10 18 C11 16 10 13 10 13 C10 13 13 16 12 20 C14 17 15 14 14 11 C14 11 18 15 17 21 C18 19 18 17 17 15 C17 15 20 19 19 24 C19 27 16 30 12 30 C10 30 8 29 8 28 Z"
        fill={accentColor}
        opacity="0.9"
      />
      {/* Wordmark: TXATINÍ */}
      <text
        x="24"
        y="26"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="800"
        letterSpacing="0.5"
        fill={color}
      >
        TXATINÍ
      </text>
      {/* Linha subtil sob o wordmark */}
      <line
        x1="24"
        y1="29"
        x2="116"
        y2="29"
        stroke={accentColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Txatiní — página principal">
        {svg}
      </Link>
    );
  }

  return svg;
}
