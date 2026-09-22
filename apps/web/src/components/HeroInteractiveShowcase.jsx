import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Globe, Type, Mail, Phone, Wifi, ArrowRight,
  Sparkles, MessageSquareText, MessageCircle, Contact,
  Crosshair, MapPin, Calendar, Share2, Smartphone,
  Briefcase, Coins, QrCode
} from 'lucide-react';
import { QR_TYPES } from '@/hooks/useQRCodeGenerator';
import { Button } from '@/components/ui/button';

// Icon mapping matching QR_TYPES ids
const TYPE_ICONS = {
  url: Globe,
  wifi: Wifi,
  vcard: Contact,
  whatsapp: MessageCircle,
  email: Mail,
  phone: Phone,
  sms: MessageSquareText,
  crypto: Coins,
  social: Share2,
  event: Calendar,
  maps: MapPin,
  location: Crosshair,
  app_download: Smartphone,
  business_card: Briefcase,
  text: Type,
};

// Realistic payloads for each category's QR preview
const TYPE_SAMPLES = {
  url: 'https://qrhub.app',
  wifi: 'WIFI:T:WPA;S:StudioGuest_5G;P:SecurePass2026;;',
  vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Alex Carter\nORG:Digital Studio\nTEL:+18005550199\nEMAIL:alex@qrhub.app\nEND:VCARD',
  whatsapp: 'https://wa.me/18005550199?text=Hello',
  email: 'mailto:contact@qrhub.app?subject=Inquiry',
  phone: 'tel:+18005550199',
  sms: 'smsto:+18005550199:Hello!',
  crypto: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  social: 'https://instagram.com/qrhub',
  event: 'BEGIN:VEVENT\nSUMMARY:Launch Gala\nDTSTART:20261015T180000Z\nEND:VEVENT',
  maps: 'https://maps.google.com/?q=37.7749,-122.4194',
  location: 'geo:37.7749,-122.4194',
  app_download: 'https://qrhub.app/download',
  business_card: 'https://qrhub.app/profile/alex',
  text: 'Hello from QR Hub Studio!',
};

// Selected top 8 diverse categories for a spacious, clean, and stunning orbit
const HERO_ORBIT_TYPES = QR_TYPES.filter((t) =>
  ['url', 'wifi', 'vcard', 'whatsapp', 'crypto', 'email', 'maps', 'app_download'].includes(t.id)
);

export default function HeroInteractiveShowcase() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(500);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const iconNodesRef = useRef([]);
  const cometNodeRef = useRef(null);
  const rotationRef = useRef(0);
  const activeIndexRef = useRef(0);
  const isHoveredRef = useRef(false);
  const autoAdvanceTimerRef = useRef(null);

  const totalItems = HERO_ORBIT_TYPES.length;
  const activeType = HERO_ORBIT_TYPES[activeIndex] || HERO_ORBIT_TYPES[0];
  const ActiveIcon = TYPE_ICONS[activeType.id] || QrCode;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Responsive width tracker
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute responsive orbit radii - wide enough to clear the center card perimeter completely
  const { radiusX, radiusY, isMobile } = useMemo(() => {
    const isMob = containerWidth < 480;
    let rx = 245;
    let ry = 150;

    if (isMob) {
      rx = Math.max(165, containerWidth * 0.46);
      ry = Math.max(120, containerWidth * 0.38);
    } else {
      rx = Math.min(255, containerWidth * 0.48);
      ry = 155;
    }

    return { radiusX: rx, radiusY: ry, isMobile: isMob };
  }, [containerWidth]);

  // Distinct 3D Diagonal Planetary Tilt (-28 deg)
  const TILT_DEG = -28;
  const TILT_RAD = (TILT_DEG * Math.PI) / 180;
  const cosTilt = Math.cos(TILT_RAD);
  const sinTilt = Math.sin(TILT_RAD);

  const radiiRef = useRef({ radiusX, radiusY, isMobile });
  useEffect(() => {
    radiiRef.current = { radiusX, radiusY, isMobile };
  }, [radiusX, radiusY, isMobile]);

  // 60FPS Hardware-Accelerated direct DOM rotation
  useEffect(() => {
    let animId;
    let lastTime = null;

    const renderLoop = (time) => {
      if (lastTime != null) {
        const delta = Math.min(time - lastTime, 48);
        // Smooth rotation, slows slightly when user hovers to inspect
        const speed = isHoveredRef.current ? 0.00007 : 0.00025;
        rotationRef.current = (rotationRef.current + speed * delta) % (2 * Math.PI);

        const { radiusX: rx, radiusY: ry, isMobile: isMob } = radiiRef.current;
        const currentRot = rotationRef.current;
        const curActive = activeIndexRef.current;

        // Position Orbiting Icons along the Tilted 3D Orbit Rail
        for (let i = 0; i < totalItems; i++) {
          const el = iconNodesRef.current[i];
          if (!el) continue;

          const angle = (i / totalItems) * 2 * Math.PI + currentRot;
          const rawX = Math.cos(angle) * rx;
          const rawY = Math.sin(angle) * ry;

          // Apply 3D diagonal tilt matrix
          const x = rawX * cosTilt - rawY * sinTilt;
          const y = rawX * sinTilt + rawY * cosTilt;

          const depthFactor = Math.sin(angle);
          const isBehind = depthFactor < -0.15;

          // Behind card: lower zIndex; In front: high zIndex
          const zIndex = isBehind ? 6 : 30;

          const scale = isMob
            ? 0.85 + depthFactor * 0.15
            : 0.92 + depthFactor * 0.18;

          const opacity = isBehind
            ? Math.max(0.48, 0.72 + depthFactor * 0.28)
            : Math.min(1, 0.92 + depthFactor * 0.1);

          el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0px) scale(${scale.toFixed(3)})`;
          el.style.zIndex = zIndex;
          el.style.opacity = i === curActive ? '1' : opacity.toFixed(2);
        }

        // Position Comet Particle along Tilted Rail
        if (cometNodeRef.current) {
          const cometAngle = currentRot * 2.2;
          const rawCx = Math.cos(cometAngle) * rx;
          const rawCy = Math.sin(cometAngle) * ry;
          const cx = rawCx * cosTilt - rawCy * sinTilt;
          const cy = rawCx * sinTilt + rawCy * cosTilt;
          cometNodeRef.current.style.transform = `translate3d(calc(-50% + ${cx.toFixed(1)}px), calc(-50% + ${cy.toFixed(1)}px), 0px)`;
        }
      }
      lastTime = time;
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [totalItems, cosTilt, sinTilt]);

  // Auto-advance active center card every 4.2 seconds
  useEffect(() => {
    autoAdvanceTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 4200);

    return () => {
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
    };
  }, [totalItems]);

  const handleSelectIcon = useCallback((idx) => {
    setActiveIndex(idx);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-lg mx-auto flex items-center justify-center select-none py-6"
      style={{
        height: isMobile ? '480px' : '530px',
        perspective: '1200px',
        contain: 'paint layout',
      }}
    >
      {/* Background Radial Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 50% 50%, ${activeType.color}15 0%, transparent 72%)`,
        }}
      />

      {/* SVG Dual Concentric Tilted Orbit Track Lines */}
      <svg
        className="absolute inset-0 pointer-events-none z-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <g style={{ transform: `rotate(${TILT_DEG}deg)`, transformOrigin: '50% 50%' }}>
          {/* Outer Faint Ambient Ring */}
          <ellipse
            cx="50%"
            cy="50%"
            rx={radiusX + 18}
            ry={radiusY + 16}
            fill="none"
            stroke={isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'}
            strokeWidth="1"
            strokeDasharray="4 8"
          />

          {/* Luminous Glow Halo around Main Track */}
          <ellipse
            cx="50%"
            cy="50%"
            rx={radiusX}
            ry={radiusY}
            fill="none"
            stroke={activeType.color}
            strokeWidth="8"
            strokeOpacity="0.1"
            className="transition-colors duration-700"
          />

          {/* Main Dashed Glowing Rail Line */}
          <ellipse
            cx="50%"
            cy="50%"
            rx={radiusX}
            ry={radiusY}
            fill="none"
            stroke={activeType.color}
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeOpacity="0.55"
            className="transition-colors duration-700"
          />

          {/* Inner Guide Track */}
          <ellipse
            cx="50%"
            cy="50%"
            rx={radiusX - 16}
            ry={radiusY - 14}
            fill="none"
            stroke={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'}
            strokeWidth="1"
            strokeDasharray="2 6"
          />
        </g>
      </svg>

      {/* Traveling Comet / Photon Particle */}
      <div
        ref={cometNodeRef}
        className="absolute left-1/2 top-1/2 pointer-events-none z-10 w-2.5 h-2.5 rounded-full"
        style={{
          backgroundColor: activeType.color,
          boxShadow: `0 0 14px 4px ${activeType.color}, 0 0 24px 8px ${activeType.color}80`,
          willChange: 'transform',
        }}
      />

      {/* ========================================================= */}
      {/* 8 SPACIOUS ORBITING SATELLITE ICONS                       */}
      {/* ========================================================= */}
      {HERO_ORBIT_TYPES.map((type, idx) => {
        const Icon = TYPE_ICONS[type.id] || QrCode;
        const isCurrent = idx === activeIndex;

        return (
          <div
            key={type.id}
            ref={(el) => (iconNodesRef.current[idx] = el)}
            onClick={() => handleSelectIcon(idx)}
            style={{
              transformOrigin: 'center center',
              willChange: 'transform, opacity',
            }}
            className="absolute left-1/2 top-1/2 cursor-pointer group"
          >
            {/* Tooltip on Hover */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xl backdrop-blur-md"
                style={{ backgroundColor: type.color }}
              >
                {type.label}
              </span>
            </div>

            {/* Glowing Orbiting Icon Orb */}
            <div
              className={`
                w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white
                transition-all duration-300 group-hover:scale-125
                border-2 backdrop-blur-xl relative
                ${isCurrent ? 'scale-115 shadow-2xl' : 'hover:shadow-xl'}
              `}
              style={{
                background: `linear-gradient(135deg, ${type.color} 0%, ${type.color}ee 100%)`,
                borderColor: isCurrent ? '#FFFFFF' : `${type.color}70`,
                boxShadow: isCurrent
                  ? `0 0 24px 4px ${type.color}95, 0 8px 18px rgba(0,0,0,0.35)`
                  : `0 4px 14px -1px ${type.color}55`,
              }}
            >
              {/* Active Pulsing Energy Aura */}
              {isCurrent && (
                <span
                  className="absolute -inset-1 rounded-2xl animate-ping opacity-35"
                  style={{ backgroundColor: type.color }}
                />
              )}

              <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 drop-shadow-sm" />
            </div>
          </div>
        );
      })}

      {/* ========================================================= */}
      {/* CENTER FEATURED QR CODE CARD                              */}
      {/* ========================================================= */}
      <div
        className="relative z-20 pointer-events-auto"
        style={{ transform: 'translateZ(20px)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType.id}
            initial={{ opacity: 0, scale: 0.92, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -6 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <div
              style={{
                background: isDark
                  ? `radial-gradient(circle at 90% 10%, ${activeType.color}35 0%, transparent 60%), linear-gradient(150deg, ${activeType.color}25 0%, rgba(30, 41, 59, 0.97) 50%, rgba(15, 23, 42, 0.99) 100%)`
                  : `radial-gradient(circle at 90% 10%, ${activeType.color}20 0%, transparent 60%), linear-gradient(150deg, ${activeType.color}15 0%, #FFFFFF 50%, #F8FAFC 100%)`,
                borderColor: activeType.color,
                boxShadow: isDark
                  ? `0 18px 40px -10px ${activeType.color}45, 0 0 30px -5px ${activeType.color}30, 0 10px 22px rgba(0,0,0,0.6)`
                  : `0 18px 36px -10px ${activeType.color}35, 0 0 24px -5px ${activeType.color}20, 0 4px 12px rgba(0,0,0,0.06)`,
              }}
              className="w-[195px] sm:w-[220px] rounded-2xl border-2 p-2.5 sm:p-3 backdrop-blur-xl flex flex-col justify-between"
            >
              {/* Top Header: Badge + Label */}
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
                    style={{ backgroundColor: activeType.color }}
                  >
                    <ActiveIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span
                      className="inline-block text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full text-white"
                      style={{ backgroundColor: activeType.color }}
                    >
                      {activeType.id}
                    </span>
                    <h3 className="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                      {activeType.label}
                    </h3>
                  </div>
                </div>

                <span className="flex h-1.5 w-1.5 relative">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: activeType.color }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ backgroundColor: activeType.color }}
                  />
                </span>
              </div>

              {/* QR Code Canvas with Viewfinder Reticle Corners */}
              <div className="my-1.5 py-1.5 px-1.5 bg-slate-50/90 dark:bg-slate-950/70 rounded-xl border border-slate-200/70 dark:border-slate-800/80 flex flex-col items-center justify-center relative">
                {/* Reticle Viewfinder Corners */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t-2 border-l-2 rounded-tl" style={{ borderColor: activeType.color }} />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t-2 border-r-2 rounded-tr" style={{ borderColor: activeType.color }} />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b-2 border-l-2 rounded-bl" style={{ borderColor: activeType.color }} />
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b-2 border-r-2 rounded-br" style={{ borderColor: activeType.color }} />

                <div className="p-1 bg-white rounded-lg shadow-sm">
                  <QRCodeCanvas
                    value={TYPE_SAMPLES[activeType.id] || 'https://qrhub.app'}
                    size={isMobile ? 82 : 92}
                    level="M"
                    marginSize={2}
                    fgColor={activeType.color}
                    bgColor="#FFFFFF"
                  />
                </div>
                <span className="text-[8.5px] font-mono font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <Sparkles className="h-2 w-2 text-amber-500" />
                  <span>0.1s Instant Scan</span>
                </span>
              </div>

              {/* Action Button to Studio */}
              <Link to={`/generator?type=${activeType.id}`} className="block w-full mt-0.5">
                <Button
                  className="w-full h-7.5 text-white font-bold rounded-lg text-[11px] shadow-sm flex items-center justify-center gap-1 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${activeType.color} 0%, ${activeType.color}ee 100%)`,
                    boxShadow: `0 4px 12px -2px ${activeType.color}55`,
                  }}
                >
                  <span>Create {activeType.label}</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>

              {/* Timer Progress Indicator Line */}
              <div className="w-full bg-slate-200/60 dark:bg-slate-800/80 h-1 rounded-full mt-1.5 overflow-hidden">
                <motion.div
                  key={activeType.id}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{
                    duration: 4.2,
                    ease: 'linear',
                    repeat: Infinity,
                  }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: activeType.color }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
