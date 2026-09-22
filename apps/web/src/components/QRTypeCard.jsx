import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QRTypeCard({ type, href, delay = 0 }) {
  return (
    <Link
      to={href}
      className={cn(
        'group relative flex flex-col items-start gap-3 p-5 rounded-2xl border border-border bg-white',
        'hover:shadow-soft-md hover:border-brand-200 hover:-translate-y-0.5 transition-all duration-300'
      )}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
        style={{ backgroundColor: type.color + '18' }}
      >
        <span>{type.icon}</span>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
          {type.label}
        </h3>
      </div>
      <ArrowRight
        className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
      />
    </Link>
  );
}
