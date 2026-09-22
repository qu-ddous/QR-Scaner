import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function StatCard({ value, label, icon, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn('flex flex-col items-center text-center p-6', className)}
    >
      {icon && <div className="text-3xl mb-2">{icon}</div>}
      <div className="text-3xl font-extrabold text-foreground tracking-tight">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}
