import { useMemo } from 'react';

// 16 rich, distinct vibrant colors spanning the entire color wheel
const COLOR_SPECTRUM = [
  '#4F6EF7', // Royal Blue
  '#8B5CF6', // Vivid Purple
  '#EC4899', // Hot Pink
  '#F43F5E', // Rose Coral
  '#F97316', // Bright Orange
  '#F59E0B', // Amber Gold
  '#10B981', // Emerald Mint
  '#14B8A6', // Caribbean Teal
  '#06B6D4', // Electric Cyan
  '#0284C7', // Ocean Sky
  '#6366F1', // Indigo Neon
  '#A855F7', // Bright Violet
  '#D946EF', // Magenta Fuchsia
  '#22C55E', // Spring Green
  '#E11D48', // Crimson
  '#3B82F6', // Cobalt
];

export default function ShinyAnimatedIconBox({
  icon: Icon,
  color,
  size = 'md',
  index = 0,
  className = '',
}) {
  const finalColor = useMemo(() => {
    if (color) return color;
    return COLOR_SPECTRUM[index % COLOR_SPECTRUM.length];
  }, [color, index]);

  const sizeClasses = {
    sm: 'h-8 w-8 rounded-lg',
    md: 'h-10 w-10 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
  }[size] || 'h-10 w-10 rounded-xl';

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }[size] || 'h-5 w-5';

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center text-white shrink-0 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${sizeClasses} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${finalColor} 0%, ${finalColor}dd 100%)`,
        boxShadow: `0 4px 14px -1px ${finalColor}45, 0 2px 4px rgba(0,0,0,0.12)`,
      }}
    >
      {/* 1. 3D Glass Surface Highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent pointer-events-none rounded-[inherit]" />

      {/* 2. Shiny Gleam Sweep on card hover (Pure CSS, 0 JS overhead) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none -skew-x-12" />

      {/* 3. Subtle Inner Rim for crisp depth */}
      <div className="absolute inset-0 rounded-[inherit] border border-white/25 pointer-events-none" />

      {/* 4. Centered Icon with crisp drop shadow */}
      {Icon && (
        <Icon
          className={`relative z-10 ${iconSizes} drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-110`}
        />
      )}
    </div>
  );
}
