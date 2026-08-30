import farmHeroImg from '@/assets/farm-hero.jpg';

export function FarmIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={farmHeroImg}
        alt="ShetkariHit Indian farming landscape"
        className="w-full h-full object-cover object-center"
        loading="eager"
      />
      {/* Subtle bottom lighting overlay to blend nicely with card borders */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/25 via-transparent to-black/10 pointer-events-none" />
    </div>
  );
}
