import { Zap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' },
  };

  return (
    <div className="flex items-center gap-3">
      <div className="bg-gradient-to-br from-[#ff6b00] to-[#ffa500] p-2 rounded-lg">
        <Zap 
          size={sizes[size].icon} 
          className="text-white" 
          fill="white"
        />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${sizes[size].text} font-black text-[#1a1a1a] tracking-tight uppercase`}>
            ULTRA
          </span>
          <span className="text-xs font-semibold text-[#6b7280] tracking-widest uppercase">
            ACADEMIA
          </span>
        </div>
      )}
    </div>
  );
}
