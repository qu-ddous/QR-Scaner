import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function FeatureCard({ icon: Icon, title, description, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'group relative flex flex-col p-6 rounded-2xl border border-border bg-white shadow-soft',
        'hover:shadow-soft-md hover:border-brand-200 transition-all duration-300',
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-primary mb-4 group-hover:bg-brand-100 transition-colors duration-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
    </motion.div>
  );
}
