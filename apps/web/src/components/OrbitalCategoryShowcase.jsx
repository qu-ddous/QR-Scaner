import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Globe, Type, Mail, Phone, Wifi, ChevronRight,
  ChevronLeft, ArrowRight, Sparkles,
  MessageSquareText, MessageCircle, Contact, Crosshair,
  MapPin, Calendar, Share2, Smartphone, Briefcase, Coins,
  QrCode
} from 'lucide-react';
import { QR_TYPES } from '@/hooks/useQRCodeGenerator';
import ShinyAnimatedIconBox from '@/components/ShinyAnimatedIconBox';
import { Button } from '@/components/ui/button';

// Icon mapping matching QR_TYPES ids
const TYPE_ICONS = {
  url: Globe,
  text: Type,
  email: Mail,
  phone: Phone,
  sms: MessageSquareText,
  whatsapp: MessageCircle,
  wifi: Wifi,
  vcard: Contact,
  location: Crosshair,
  maps: MapPin,
  event: Calendar,
  social: Share2,
  app_download: Smartphone,
  business_card: Briefcase,
  crypto: Coins,
};

// Realistic preview payloads for live QR rendering in the center card
const TYPE_SAMPLES = {
  url: 'https://qrhub.app',
  text: 'Hello from QR Hub Studio!',
  email: 'mailto:contact@qrhub.app?subject=Inquiry',
  phone: 'tel:+18005550199',
  sms: 'smsto:+18005550199:Hello!',
  whatsapp: 'https://wa.me/18005550199?text=Hello',
  wifi: 'WIFI:T:WPA;S:StudioGuest_5G;P:SecurePass2026;;',
  vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Alex Carter\nORG:Digital Studio\nTEL:+18005550199\nEMAIL:alex@qrhub.app\nEND:VCARD',
  location: 'geo:37.7749,-122.4194',
  maps: 'https://maps.google.com/?q=37.7749,-122.4194',
  event: 'BEGIN:VEVENT\nSUMMARY:Launch Gala\nDTSTART:20261015T180000Z\nDTEND:20261015T210000Z\nEND:VEVENT',
  social: 'https://instagram.com/qrhub',
  app_download: 'https://qrhub.app/download',
  business_card: 'https://qrhub.app/profile/alex',
  crypto: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
};

export default function OrbitalCategoryShowcase() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  const containerRef = useRef(null);
  const cardNodesRef = useRef([]);
  const rotationRef = useRef(0);
  const activeIndexRef = useRef(0);
  const autoAdvanceTimerRef = useRef(null);

  const totalItems = QR_TYPES.length;
  const activeType = QR_TYPES[activeIndex] || QR_TYPES[0];
  const ActiveIcon = TYPE_ICONS[activeType.id] || QrCode;

  // Keep activeIndexRef synced for the animation loop
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Responsive container width tracking
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

  // Compute responsive elliptical orbit radii
  const { radiusX, radiusY, arenaHeight, isMobile } = useMemo(() => {
    const isMob = containerWidth < 640;
    const isTab = containerWidth >= 640 && containerWidth < 1024;

    let rx = 530;
    let ry = 230;
    let h = '740px';

    if (isMob) {
      rx = Math.max(145, containerWidth * 0.44);
      ry = 95;
      h = '610px';
    } else if (isTab) {
      rx = Math.max(290, containerWidth * 0.44);
      ry = 170;
      h = '680px';
    } else {
      rx = Math.min(530, containerWidth * 0.45);
      ry = 230;
      h = '740px';
    }

    return { radiusX: rx, radiusY: ry, arenaHeight: h, isMobile: isMob };
  }, [containerWidth]);

  // Radii ref for the animation loop so we don't restart the RAF on width change
  const radiiRef = useRef({ radiusX, radiusY, isMobile });
  useEffect(() => {
    radiiRef.current = { radiusX, radiusY, isMobile };
  }, [radiusX, radiusY, isMobile]);

  // 60FPS Hardware-Accelerated Direct DOM Animation:
  // Updates DOM transforms directly WITHOUT triggering React re-renders!
  // This completely eliminates scroll-jank and lagging when user scrolls up/down.
  useEffect(() => {
    let animId;
    let lastTime = null;

    const renderLoop = (time) => {
      if (lastTime != null) {
        const delta = Math.min(time - lastTime, 48); // Cap max frame jump
        // 0.00018 rad/ms = gentle, serene continuous rotation
        rotationRef.current = (rotationRef.current + 0.00018 * delta) % (2 * Math.PI);

        const { radiusX: rx, radiusY: ry, isMobile: isMob } = radiiRef.current;
        const currentRot = rotationRef.current;
        const curActive = activeIndexRef.current;

        for (let i = 0; i < totalItems; i++) {
          const el = cardNodesRef.current[i];
          if (!el) continue;

          const angle = (i / totalItems) * 2 * Math.PI + currentRot;
          const x = Math.cos(angle) * rx;
          const y = Math.sin(angle) * ry;

          const depthFactor = Math.sin(angle);
          const isBehind = depthFactor < 0;

          const zIndex = isBehind
            ? Math.round(8 + (depthFactor + 1) * 4)
            : Math.round(18 + depthFactor * 4);

          const scale = isMob
            ? 0.76 + depthFactor * 0.16
            : 0.82 + depthFactor * 0.18;

          const opacity = isBehind
            ? Math.max(0.5, 0.7 + depthFactor * 0.25)
            : Math.min(0.98, 0.86 + depthFactor * 0.14);

          el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0px) scale(${scale.toFixed(3)})`;
          el.style.zIndex = zIndex;
          el.style.opacity = i === curActive ? '0.98' : opacity.toFixed(2);
        }
      }
      lastTime = time;
      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [totalItems]);

  // Auto-advance active card every 5 seconds continuously
  useEffect(() => {
    autoAdvanceTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 5000);

    return () => {
      if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
    };
  }, [totalItems]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const handleSelectCard = useCallback((idx) => {
    setActiveIndex(idx);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none py-4 sm:py-8"
      style={{ contain: 'paint layout' }}
    >
      {/* Top Action & Status Ribbon (Removed "Live Solar Orbit" label as requested) */}
      <div className="flex items-center justify-end max-w-xl mx-auto mb-6 px-4">
        {/* Dynamic Category Counter Pill + Next/Prev Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {activeIndex + 1} / {totalItems} Types
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous category"
              className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next category"
              className="p-1.5 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Orbit Arena (Tilted Perspective Galaxy) */}
      <div
        className="relative mx-auto flex items-center justify-center"
        style={{
          height: arenaHeight,
          perspective: '1200px',
          transform: 'translateZ(0)',
        }}
      >
        {/* Background Celestial Glowing Aura */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-700"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${activeType.color}18 0%, transparent 70%)`,
          }}
        />

        {/* 3D SVG Orbit Track Line */}
        <svg
          className="absolute inset-0 pointer-events-none z-0 w-full h-full"
          style={{ overflow: 'visible' }}
        >
          {/* Luminous Ambient Halo along the exact orbit */}
          <ellipse
            cx="50%"
            cy="50%"
            rx={radiusX}
            ry={radiusY}
            fill="none"
            stroke={activeType.color}
            strokeWidth="8"
            strokeOpacity="0.12"
            className="transition-colors duration-700"
          />

          {/* Glowing Animated Dash Track */}
          <ellipse
            cx="50%"
            cy="50%"
            rx={radiusX}
            ry={radiusY}
            fill="none"
            stroke={activeType.color}
            strokeWidth="2.5"
            strokeDasharray="8 8"
            strokeOpacity="0.5"
            className="transition-colors duration-700"
          />

          {/* Solid Base Orbit Rail */}
          <ellipse
            cx="50%"
            cy="50%"
            rx={radiusX}
            ry={radiusY}
            fill="none"
            stroke={isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}
            strokeWidth="1.5"
          />
        </svg>

        {/* ========================================================= */}
        {/* SATELLITE ORBITING CARDS (HARDWARE ACCELERATED DOM NODES) */}
        {/* ========================================================= */}
        {QR_TYPES.map((type, idx) => {
          const isCurrentlyActive = idx === activeIndex;
          const Icon = TYPE_ICONS[type.id] || QrCode;

          return (
            <div
              key={type.id}
              ref={(el) => (cardNodesRef.current[idx] = el)}
              onClick={() => handleSelectCard(idx)}
              style={{
                // Initial placement, RAF will continuously animate transform on the GPU thread
                transformOrigin: 'center center',
                willChange: 'transform, opacity',
              }}
              className="absolute left-1/2 top-1/2 cursor-pointer group"
              title={`Click to focus ${type.label}`}
            >
              {/* Vertical / Portrait Orbit Card sitting directly on the line */}
              <div
                style={{
                  background: isDark
                    ? `radial-gradient(circle at 85% 15%, ${type.color}28 0%, transparent 60%), linear-gradient(150deg, ${type.color}20 0%, rgba(30, 41, 59, 0.96) 50%, rgba(15, 23, 42, 0.99) 100%)`
                    : `radial-gradient(circle at 85% 15%, ${type.color}22 0%, transparent 60%), linear-gradient(150deg, ${type.color}14 0%, #FFFFFF 55%, #F8FAFC 100%)`,
                  borderColor: isCurrentlyActive
                    ? type.color
                    : isDark
                    ? `${type.color}55`
                    : `${type.color}40`,
                  boxShadow: isCurrentlyActive
                    ? `0 0 26px -2px ${type.color}80, 0 14px 28px -4px rgba(0,0,0,0.35)`
                    : `0 10px 22px -4px ${type.color}28, 0 2px 6px rgba(0,0,0,0.06)`,
                }}
                className={`
                  w-28 sm:w-32 h-40 sm:h-48 rounded-2xl border-2 p-3
                  flex flex-col items-center justify-between text-center
                  transition-all duration-300
                  group-hover:scale-110 group-hover:-translate-y-1.5 group-hover:shadow-2xl
                  ${isCurrentlyActive ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                `}
              >
                {/* Top Accent Line */}
                <div
                  className="w-10 sm:w-12 h-1 rounded-full mb-1"
                  style={{ backgroundColor: type.color }}
                />

                {/* Satellite Icon with Glowing Backdrop */}
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-md my-auto transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${type.color} 0%, ${type.color}dd 100%)`,
                    boxShadow: `0 4px 14px -1px ${type.color}50`,
                  }}
                >
                  <Icon className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
                </div>

                {/* Category Label (Vertical Card Body) */}
                <div className="w-full mt-auto pt-1">
                  <span className="block text-xs sm:text-[12.5px] font-extrabold text-slate-800 dark:text-slate-100 tracking-tight truncate">
                    {type.label}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-400 dark:text-slate-400 truncate mt-0.5">
                    {isCurrentlyActive ? '★ Spotlight' : 'Tap to focus'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* ========================================================= */}
        {/* CENTRAL FEATURED CARD (THE SUN / CORE)                    */}
        {/* ========================================================= */}
        <div
          className="relative z-30 pointer-events-auto"
          style={{
            transform: 'translateZ(30px)',
          }}
        >
          {/* Animated Solar Glow Aura behind central card */}
          <div
            className="absolute -inset-6 rounded-[36px] filter blur-2xl opacity-45 transition-all duration-700 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${activeType.color} 0%, transparent 70%)`,
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeType.id}
              initial={{ opacity: 0, scale: 0.93, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative"
            >
              {/* Vertical / Portrait Core Showcase Card (Slightly more compact) */}
              <div
                style={{
                  background: isDark
                    ? `radial-gradient(circle at 90% 10%, ${activeType.color}35 0%, transparent 60%), linear-gradient(150deg, ${activeType.color}25 0%, rgba(30, 41, 59, 0.98) 45%, rgba(15, 23, 42, 0.99) 100%)`
                    : `radial-gradient(circle at 90% 10%, ${activeType.color}25 0%, transparent 60%), linear-gradient(150deg, ${activeType.color}15 0%, #FFFFFF 50%, #F8FAFC 100%)`,
                  borderColor: activeType.color,
                  boxShadow: isDark
                    ? `0 20px 40px -10px ${activeType.color}50, 0 0 35px -5px ${activeType.color}35, 0 10px 20px rgba(0,0,0,0.6)`
                    : `0 20px 40px -10px ${activeType.color}40, 0 0 30px -5px ${activeType.color}25, 0 4px 12px rgba(0,0,0,0.08)`,
                }}
                className="w-[245px] sm:w-[275px] md:w-[290px] rounded-3xl border-2 p-4 sm:p-4.5 backdrop-blur-md flex flex-col justify-between"
              >
                {/* Top Status Bar: Category Badge + Type Indicator */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <ShinyAnimatedIconBox
                      icon={ActiveIcon}
                      color={activeType.color}
                      size="sm"
                      index={activeIndex}
                    />
                    <div>
                      <span
                        className="inline-block text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: activeType.color }}
                      >
                        {activeType.id}
                      </span>
                      <h3 className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-white leading-tight">
                        {activeType.label}
                      </h3>
                    </div>
                  </div>

                  <span className="flex h-2 w-2 relative">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: activeType.color }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: activeType.color }}
                    />
                  </span>
                </div>

                {/* Central Live QR Canvas Preview */}
                <div className="my-2.5 py-2.5 px-2 bg-slate-50/90 dark:bg-slate-950/60 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 flex flex-col items-center justify-center relative overflow-hidden group">
                  {/* Watermarked corner marks */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 rounded-tl-sm opacity-60" style={{ borderColor: activeType.color }} />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 rounded-tr-sm opacity-60" style={{ borderColor: activeType.color }} />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 rounded-bl-sm opacity-60" style={{ borderColor: activeType.color }} />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 rounded-br-sm opacity-60" style={{ borderColor: activeType.color }} />

                  <div className="p-2 bg-white rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105">
                    <QRCodeCanvas
                      value={TYPE_SAMPLES[activeType.id] || 'https://qrhub.app'}
                      size={isMobile ? 104 : 118}
                      level="M"
                      marginSize={2}
                      fgColor={activeType.color}
                      bgColor="#FFFFFF"
                    />
                  </div>

                  <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                    <span>Native OS Action Ready</span>
                  </span>
                </div>

                {/* Description Text */}
                <div className="space-y-0.5 mb-2.5">
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2">
                    {activeType.desc}
                  </p>
                </div>

                {/* Action CTA Button directly to Studio */}
                <Link to={`/generator?type=${activeType.id}`} className="block w-full">
                  <Button
                    className="w-full h-9 sm:h-9.5 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${activeType.color} 0%, ${activeType.color}ee 100%)`,
                      boxShadow: `0 6px 16px -3px ${activeType.color}55`,
                    }}
                  >
                    <span>Create {activeType.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>

                {/* Bottom Auto-Cycle Timer Progress Line (Runs continuously) */}
                <div className="w-full bg-slate-200/60 dark:bg-slate-800/80 h-1 rounded-full mt-2.5 overflow-hidden">
                  <motion.div
                    key={activeType.id}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{
                      duration: 5.0,
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
    </div>
  );
}
