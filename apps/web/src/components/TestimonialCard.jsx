import { cn } from '@/lib/utils';

export default function TestimonialCard({ name, role, company, quote, avatar, className }) {
  return (
    <div className={cn('flex flex-col gap-4 p-6 rounded-2xl border border-border bg-white shadow-soft', className)}>
      <p className="text-sm text-muted-foreground leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold text-sm">
          {avatar || name[0]}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
          {(role || company) && (
            <div className="text-xs text-muted-foreground">{[role, company].filter(Boolean).join(' · ')}</div>
          )}
        </div>
      </div>
    </div>
  );
}
