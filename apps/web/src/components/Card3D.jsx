import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Card3D({
  children,
  className = '',
  maxTilt = 8,
  glow = false,
  onClick,
  style = {},
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        scale: isHovered ? 1.015 : 1,
      }}
      transition={{
        scale: { duration: 0.2 },
      }}
      className={`relative rounded-2xl transition-shadow duration-300 ${
        isHovered
          ? 'shadow-[0_20px_40px_-15px_rgba(23,32,51,0.12),0_8px_16px_-4px_rgba(79,110,247,0.08)]'
          : 'shadow-[0_4px_16px_-4px_rgba(23,32,51,0.05)]'
      } ${className}`}
    >
      <div style={{ transform: 'translateZ(12px)' }} className="h-full">
        {children}
      </div>

      {glow && isHovered && (
        <div
          className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-75 blur-sm transition-opacity duration-300"
          style={{ transform: 'translateZ(-10px)' }}
        />
      )}
    </motion.div>
  );
}
