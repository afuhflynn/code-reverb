interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 100, className = "" }: LogoProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="CodeReverb Logo"
    >
      {/* Reverb sound wave */}
      <path
        d="M10 50 Q20 30 30 50 Q40 70 50 50 Q60 30 70 50 Q80 70 90 50"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        className="text-blue-600 dark:text-blue-400"
      />
      {/* Neural network connections */}
      <circle
        cx="20"
        cy="40"
        r="3"
        className="fill-green-500 dark:fill-green-400"
      />
      <circle
        cx="50"
        cy="40"
        r="3"
        className="fill-green-500 dark:fill-green-400"
      />
      <circle
        cx="80"
        cy="40"
        r="3"
        className="fill-green-500 dark:fill-green-400"
      />
      <line
        x1="20"
        y1="40"
        x2="50"
        y2="40"
        stroke="currentColor"
        strokeWidth="2"
        className="text-blue-600 dark:text-blue-400"
      />
      <line
        x1="50"
        y1="40"
        x2="80"
        y2="40"
        stroke="currentColor"
        strokeWidth="2"
        className="text-blue-600 dark:text-blue-400"
      />
      {/* Code brackets */}
      <text
        x="15"
        y="65"
        fontFamily="monospace"
        fontSize="16"
        className="fill-green-500 dark:fill-green-400"
      >
        {"{"}
      </text>
      <text
        x="75"
        y="65"
        fontFamily="monospace"
        fontSize="16"
        className="fill-green-500 dark:fill-green-400"
      >
        {"}"}
      </text>
    </svg>
  );
};

export default Logo;
