import Link from 'next/link';

interface LogoProps {
  sub?: string;
}

export function Logo({ sub }: LogoProps) {
  return (
    <div className="flex items-center gap-3.5 shrink-0">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        {/* Red circle mark */}
        <div className="w-[38px] h-[38px] rounded-full bg-cta-primary relative flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-white/80" />
          <div className="absolute w-[9px] h-0.5 bg-white/90 rounded-sm" />
        </div>
        <span className="text-xl font-extrabold text-navy-900 tracking-tight">
          Meridian<span className="font-normal text-gray-500">Bank</span>
        </span>
      </Link>
      {sub && (
        <span className="text-[10px] font-bold text-cta-primary leading-tight uppercase tracking-wide">
          {sub.split(' ').map((word, i) => (
            <span key={i}>{word}<br /></span>
          ))}
        </span>
      )}
    </div>
  );
}
