export function FarmIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 700"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4EAD0" />
          <stop offset="100%" stopColor="#F0F9EE" />
        </linearGradient>
        <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#1B5E20" />
        </linearGradient>
        <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#388E3C" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient id="hillGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#388E3C" />
        </linearGradient>
        <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C68B3E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8E5F22" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="560" height="700" fill="url(#skyGrad)" />

      {/* Sun */}
      <circle cx="440" cy="110" r="52" fill="#FFF9C4" opacity="0.85" />
      <circle cx="440" cy="110" r="38" fill="#FFF176" opacity="0.95" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line
          key={i}
          x1={440 + Math.cos((deg * Math.PI) / 180) * 46}
          y1={110 + Math.sin((deg * Math.PI) / 180) * 46}
          x2={440 + Math.cos((deg * Math.PI) / 180) * 62}
          y2={110 + Math.sin((deg * Math.PI) / 180) * 62}
          stroke="#F9A825"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}

      {/* Soft clouds */}
      <g opacity="0.55">
        <ellipse cx="120" cy="130" rx="55" ry="22" fill="white" />
        <ellipse cx="155" cy="118" rx="38" ry="26" fill="white" />
        <ellipse cx="85" cy="120" rx="30" ry="18" fill="white" />
      </g>
      <g opacity="0.45">
        <ellipse cx="310" cy="80" rx="48" ry="18" fill="white" />
        <ellipse cx="340" cy="68" rx="32" ry="22" fill="white" />
        <ellipse cx="282" cy="74" rx="26" ry="16" fill="white" />
      </g>

      {/* Far hills — lightest / most distant */}
      <path
        d="M0 460 Q70 340 160 370 Q240 390 320 340 Q400 290 480 350 Q530 375 560 360 L560 700 L0 700 Z"
        fill="url(#hillGrad3)"
        opacity="0.45"
      />

      {/* Mid hills */}
      <path
        d="M0 520 Q80 400 190 430 Q290 455 380 400 Q460 360 560 420 L560 700 L0 700 Z"
        fill="url(#hillGrad2)"
        opacity="0.65"
      />

      {/* Foreground hill */}
      <path
        d="M0 600 Q100 490 220 530 Q340 570 460 510 Q510 490 560 520 L560 700 L0 700 Z"
        fill="url(#hillGrad1)"
      />

      {/* Ground / field base */}
      <rect x="0" y="640" width="560" height="60" fill="#1B5E20" />

      {/* Dirt road — perspective trapezoid */}
      <path
        d="M230 700 L260 580 L300 580 L330 700 Z"
        fill="url(#roadGrad)"
      />
      {/* Road dashes */}
      {[600, 622, 644, 666, 688].map((y, i) => (
        <rect key={i} x="277" y={y} width="6" height="10" rx="3" fill="#DDB066" opacity="0.6" />
      ))}

      {/* Small farmhouse */}
      <g transform="translate(66, 490)">
        {/* House body */}
        <rect x="0" y="30" width="58" height="42" rx="4" fill="#FAF7F0" />
        {/* Roof */}
        <polygon points="29,0 -6,34 64,34" fill="#C68B3E" />
        {/* Door */}
        <rect x="22" y="52" width="14" height="20" rx="3" fill="#8E5F22" />
        {/* Windows */}
        <rect x="6" y="40" width="12" height="10" rx="2" fill="#B3E5FC" opacity="0.8" />
        <rect x="40" y="40" width="12" height="10" rx="2" fill="#B3E5FC" opacity="0.8" />
        {/* Chimney */}
        <rect x="42" y="-8" width="9" height="22" rx="2" fill="#6D4819" />
        {/* Smoke */}
        <circle cx="46" cy="-14" r="5" fill="white" opacity="0.5" />
        <circle cx="42" cy="-22" r="4" fill="white" opacity="0.3" />
      </g>

      {/* Tree clusters — left */}
      <g transform="translate(30, 450)">
        <rect x="10" y="55" width="8" height="28" rx="3" fill="#5D4037" />
        <ellipse cx="14" cy="42" rx="18" ry="24" fill="#2E7D32" />
        <ellipse cx="14" cy="32" rx="12" ry="18" fill="#388E3C" />
      </g>
      <g transform="translate(8, 478)">
        <rect x="7" y="38" width="6" height="20" rx="2" fill="#5D4037" />
        <ellipse cx="10" cy="28" rx="13" ry="17" fill="#43A047" />
        <ellipse cx="10" cy="20" rx="9" ry="12" fill="#66BB6A" />
      </g>

      {/* Tree clusters — right */}
      <g transform="translate(460, 430)">
        <rect x="12" y="60" width="9" height="32" rx="3" fill="#5D4037" />
        <ellipse cx="16" cy="46" rx="20" ry="26" fill="#1B5E20" />
        <ellipse cx="16" cy="34" rx="13" ry="20" fill="#2E7D32" />
      </g>
      <g transform="translate(490, 455)">
        <rect x="8" y="44" width="7" height="24" rx="2" fill="#5D4037" />
        <ellipse cx="11" cy="32" rx="15" ry="20" fill="#388E3C" />
        <ellipse cx="11" cy="22" rx="10" ry="14" fill="#43A047" />
      </g>

      {/* Mid-ground scattered trees */}
      <g transform="translate(170, 500)">
        <rect x="6" y="32" width="6" height="18" rx="2" fill="#5D4037" />
        <ellipse cx="9" cy="22" rx="12" ry="16" fill="#2E7D32" />
      </g>
      <g transform="translate(360, 490)">
        <rect x="6" y="35" width="7" height="20" rx="2" fill="#5D4037" />
        <ellipse cx="9" cy="24" rx="13" ry="17" fill="#1B5E20" />
        <ellipse cx="9" cy="15" rx="9" ry="12" fill="#2E7D32" />
      </g>

      {/* Crop rows */}
      {[655, 667, 679].map((y, i) => (
        <g key={i}>
          {Array.from({ length: 18 }).map((_, j) => (
            <ellipse
              key={j}
              cx={20 + j * 30 + (i % 2) * 12}
              cy={y}
              rx="5"
              ry="7"
              fill="#66BB6A"
              opacity="0.75"
            />
          ))}
        </g>
      ))}

      {/* Birds */}
      <path d="M200 170 Q206 162 212 170" stroke="#6D6259" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M222 158 Q228 150 234 158" stroke="#6D6259" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M248 178 Q253 170 258 178" stroke="#6D6259" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
