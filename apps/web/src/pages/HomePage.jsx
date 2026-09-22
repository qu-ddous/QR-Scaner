import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { QRCodeCanvas } from 'qrcode.react';
import {
  QrCode, ArrowRight, Zap, ShieldCheck, Palette, Download,
  CheckCircle2, Sparkles, Globe, Type, Mail, Phone, Wifi,
  ChevronDown, ExternalLink, Copy, Check, Layers, Sliders,
  FileText, MessageSquareText, MessageCircle, Contact,
  Crosshair, MapPin, Calendar, Share2, FileCode, Smartphone,
  Briefcase, Coins, Lock, KeyRound
} from 'lucide-react';
import { toast } from 'sonner';

import SEO from '@/components/SEO';
import ScrollReveal from '@/components/ScrollReveal';
import Card3D from '@/components/Card3D';
import ShinyAnimatedIconBox from '@/components/ShinyAnimatedIconBox';
import OrbitalCategoryShowcase from '@/components/OrbitalCategoryShowcase';
import HeroInteractiveShowcase from '@/components/HeroInteractiveShowcase';
import { Button } from '@/components/ui/button';

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
  pdf: FileCode,
  app_download: Smartphone,
  business_card: Briefcase,
  crypto: Coins,
};
import { QR_TYPES } from '@/hooks/useQRCodeGenerator';
import { TEMPLATES } from '@/lib/templatesData';

const MARQUEE_ITEMS_1 = [
  { icon: Layers, label: 'Bulk & Batch 100+ Generation', color: '#4F6EF7' },
  { icon: ShieldCheck, label: '100% Client-Side Privacy', color: '#10B981' },
  { icon: Zap, label: 'Instant In-Memory Generation', color: '#3B82F6' },
  { icon: Download, label: 'Lossless Vector SVG & PDF', color: '#8B5CF6' },
  { icon: Palette, label: 'Custom Colors & Margins', color: '#F59E0B' },
  { icon: Wifi, label: 'One-Tap Wi-Fi Sharing', color: '#6366F1' },
  { icon: Contact, label: 'Digital vCard 3.0 Contacts', color: '#EC4899' },
  { icon: Sparkles, label: '16 Specialized QR Types', color: '#06B6D4' },
  { icon: CheckCircle2, label: 'Permanent Unlimited Scans', color: '#10B981' },
];

const MARQUEE_ITEMS_2 = [
  { icon: Lock, label: 'AES-256 Encrypted Secret Notes', color: '#F59E0B' },
  { icon: Globe, label: 'Website & Portfolio Links', color: '#3B82F6' },
  { icon: Smartphone, label: 'iOS App Store & Google Play', color: '#6366F1' },
  { icon: Calendar, label: 'Calendar Events (.ics)', color: '#F59E0B' },
  { icon: Coins, label: 'Bitcoin & Crypto Wallets', color: '#D97706' },
  { icon: MapPin, label: 'Google Maps GPS Pins', color: '#EF4444' },
  { icon: Share2, label: 'Social Media Profiles', color: '#14B8A6' },
  { icon: FileCode, label: 'Hosted PDF Documents', color: '#E11D48' },
  { icon: ShieldCheck, label: 'Level H 30% Error Recovery', color: '#10B981' },
];

const VALUE_PROPS = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Instant in-memory DOM rendering without server round-trips or cold starts.',
    accent: '#4F6EF7',
    pastel: '#EEF4FF',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'Your links, passwords, and contact data never leave your browser. Zero telemetry.',
    accent: '#10B981',
    pastel: '#ECFDF5',
  },
  {
    icon: Palette,
    title: 'Fully Customizable',
    desc: 'Precision hex color palettes, logo integration, canvas sizing, and 4 error correction tiers.',
    accent: '#6366F1',
    pastel: '#EEF2FF',
  },
  {
    icon: Download,
    title: 'Multiple Export Formats',
    desc: 'Download crisp vector SVG and PDF files or high-res 4x PNG, JPG, and WebP raster images.',
    accent: '#F59E0B',
    pastel: '#FEF3C7',
  },
];

const POWER_STUDIOS = [
  {
    icon: Layers,
    accent: '#4F6EF7',
    tag: 'Mass Production',
    title: 'Bulk & Batch Studio',
    desc: 'Generate up to 200 vector QR codes from CSV lists or sequential number ranges with 1-click ZIP export.',
    action: 'Open Bulk Studio',
    href: '/bulk',
  },
  {
    icon: Lock,
    accent: '#8B5CF6',
    tag: 'AES-256 Encrypted',
    title: 'Secret Encrypted Notes',
    desc: 'Lock private credentials, Wi-Fi keys, or secret memos behind a passcode. Unlocks directly in the Secret Vault.',
    action: 'Create Secret Note',
    href: '/generator?type=text',
  },
  {
    icon: Crosshair,
    accent: '#10B981',
    tag: 'Dual Scan Engine',
    title: 'Universal QR Scanner',
    desc: 'Scan with live device camera or drag-and-drop QR image files for instant payload decoding and action links.',
    action: 'Open Scanner',
    href: '/scanner',
  },
];

const FAQS = [
  {
    q: 'What is QRHub?',
    a: 'QRHub is a professional, client-side QR Code studio that allows anyone to generate, customize, and bulk-generate print-ready QR codes for 17 specialized data types completely free.',
  },
  {
    q: 'Does QRHub store my QR data?',
    a: 'No. QRHub operates 100% within your client browser. Your URLs, text, Wi-Fi credentials, and contacts are converted to QR matrices locally and never transmitted to any cloud servers.',
  },
  {
    q: 'Can I customize QR colors and embed logos?',
    a: 'Yes. You can customize colors with real-time contrast checking, choose from 12+ built-in popular logos (WhatsApp, Instagram, etc.), or upload your custom brand logo.',
  },
  {
    q: 'Which export formats are supported?',
    a: 'We support vector SVG and PDF (for infinite sharpness on posters and billboards), print presets (table tents, business cards, stickers), as well as raster PNG, JPG, and WebP.',
  },
  {
    q: 'Can I bulk-generate QR codes?',
    a: 'Yes. QRHub includes a Bulk Generator capable of processing up to 100 QR codes from CSV or multi-line lists with one-click vector download.',
  },
  {
    q: 'Why isn\'t my QR code scanning?',
    a: 'Common reasons include low contrast between dark and light colors, oversized logos covering timing modules, or insufficient quiet zone margins. Use our built-in QR Health indicators to ensure optimal scan reliability.',
  },
];

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <SEO
        title="QRHub — Free, Beautiful & Private QR Code Generator"
        description="Create beautiful, customizable vector QR codes. 100% private, client-side generation for URLs, Wi-Fi, contacts, events, secrets and bulk batches."
        canonical="/"
      />

      <div className="overflow-hidden">

        {/* 1. HERO SECTION */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32 bg-gradient-to-b from-blue-50/40 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* Left Hero Column */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <ScrollReveal delay={0.1}>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.18]">
                    Create QR Codes That <span className="gradient-text">Actually Work.</span>
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Generate beautiful, customizable QR codes for websites, Wi-Fi, contact cards, events, payments, and social media. Free forever with unlimited scans and zero tracking.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                    <Link to="/generator" className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto h-12 px-7 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                        <QrCode className="h-4 w-4" />
                        <span>Create QR Code</span>
                      </Button>
                    </Link>

                    <Link to="/features" className="w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto h-12 px-6 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center justify-center gap-2"
                      >
                        <span>Explore Features</span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>

                {/* Trust Badges */}
                <ScrollReveal delay={0.4}>
                  <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>No Sign-up Required</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Vector SVG & PDF</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>100% Client-Side</span>
                    </span>
                  </div>
                </ScrollReveal>
              </div>

              {/* Right Hero Column: 3D Holographic Scanner & Morphing Studio Showcase */}
              <div className="lg:col-span-6 relative flex items-center justify-center">
                <HeroInteractiveShowcase />
              </div>

            </div>
          </div>
        </section>

        {/* 2. BUTTERY-SMOOTH INFINITE TICKER STRIP (RIGHT TO LEFT) */}
        <section className="py-5 sm:py-6 bg-slate-50/90 dark:bg-slate-900/90 border-y border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden backdrop-blur-md w-full max-w-full">
          {/* Left & Right Smooth Edge Fade Gradients */}
          <div className="absolute left-0 inset-y-0 w-20 sm:w-36 bg-gradient-to-r from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-20 sm:w-36 bg-gradient-to-l from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-20 pointer-events-none" />

          <div className="space-y-3 w-full max-w-full overflow-hidden">
            {/* Track 1: Calm, Steady, Hardware-Accelerated (Right to Left) */}
            <div className="flex w-full max-w-full overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
              <div className="animate-marquee-slow flex items-center gap-3">
                {MARQUEE_ITEMS_1.concat(MARQUEE_ITEMS_1).concat(MARQUEE_ITEMS_1).map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all duration-200 whitespace-nowrap cursor-default group shrink-0"
                    >
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-lg border shrink-0 transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: `${item.color}15`,
                          borderColor: `${item.color}35`,
                          color: item.color,
                        }}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track 2: Secondary Offset Stream (Right to Left) */}
            <div className="flex w-full max-w-full overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
              <div className="animate-marquee-slow flex items-center gap-3" style={{ animationDuration: '82s' }}>
                {MARQUEE_ITEMS_2.concat(MARQUEE_ITEMS_2).concat(MARQUEE_ITEMS_2).map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 shadow-xs hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 whitespace-nowrap cursor-default group shrink-0"
                    >
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-md border shrink-0"
                        style={{
                          backgroundColor: `${item.color}12`,
                          borderColor: `${item.color}30`,
                          color: item.color,
                        }}
                      >
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 3. 15 QR TYPE EXPLORER SECTION (ORBITAL 3D SOLAR SHOWCASE) */}
        <section className="section bg-slate-50/60 dark:bg-slate-950 overflow-hidden">
          <div className="container-wide space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                One Generator. Every QR Use Case.
              </h2>
              <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
                Standard protocols formatted mathematically to trigger native operating system actions on iOS and Android.
              </p>
            </div>

            <ScrollReveal>
              <OrbitalCategoryShowcase />
            </ScrollReveal>
          </div>
        </section>

        {/* SPECIALIZED POWER STUDIOS SPOTLIGHT */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-t border-slate-200/80 dark:border-slate-800">
          <div className="container-wide space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Beyond Standard QR Codes
              </h2>
              <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
                Discover enterprise bulk batching, password-encrypted secret notes, and instant camera scanning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {POWER_STUDIOS.map((studio, idx) => {
                const Icon = studio.icon;
                return (
                  <ScrollReveal key={studio.title} delay={idx * 0.05}>
                    <Link to={studio.href} className="group block h-full">
                      <div
                        style={{
                          background: isDark
                            ? `radial-gradient(circle at 90% 10%, ${studio.accent}25 0%, transparent 60%), linear-gradient(145deg, ${studio.accent}15 0%, rgba(30, 41, 59, 0.85) 45%, rgba(15, 23, 42, 0.98) 100%)`
                            : `radial-gradient(circle at 90% 10%, ${studio.accent}18 0%, transparent 60%), linear-gradient(145deg, ${studio.accent}0e 0%, ${studio.accent}03 45%, rgba(255,255,255,0.98) 100%)`,
                          borderColor: isDark ? `${studio.accent}60` : `${studio.accent}40`,
                          boxShadow: isDark
                            ? `0 8px 20px -4px ${studio.accent}25`
                            : `0 6px 16px -4px ${studio.accent}15, 0 2px 4px rgba(0,0,0,0.03)`,
                        }}
                        className="border-2 rounded-2xl p-5 sm:p-5.5 h-full space-y-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                      >
                        {/* Top decorative accent line */}
                        <div
                          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-80"
                          style={{ color: studio.accent }}
                        />

                        <div className="space-y-3 relative z-10">
                          <ShinyAnimatedIconBox
                            icon={Icon}
                            color={studio.accent}
                            size="md"
                            index={idx + 24}
                          />

                          <div>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1.5 border"
                              style={{
                                backgroundColor: `${studio.accent}15`,
                                borderColor: `${studio.accent}35`,
                                color: studio.accent,
                              }}
                            >
                              {studio.tag}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {studio.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
                              {studio.desc}
                            </p>
                          </div>
                        </div>

                        <div
                          className="flex items-center gap-1.5 text-xs font-bold pt-2.5 border-t relative z-10 transition-colors"
                          style={{
                            color: studio.accent,
                            borderColor: isDark ? `${studio.accent}30` : `${studio.accent}20`
                          }}
                        >
                          <span>{studio.action}</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. VALUE PROPOSITION SECTION */}
        <section className="section bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
          <div className="container-wide space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Built for Precision, Privacy & Speed
              </h2>
              <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
                Experience utility without surveillance, hidden paywalls, or degraded export resolution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUE_PROPS.map((vp, idx) => {
                const Icon = vp.icon;
                return (
                  <ScrollReveal key={vp.title} delay={idx * 0.04}>
                    <div
                      style={{
                        background: isDark
                          ? `radial-gradient(circle at 90% 10%, ${vp.accent}28 0%, transparent 60%), linear-gradient(145deg, ${vp.accent}18 0%, rgba(30, 41, 59, 0.85) 45%, rgba(15, 23, 42, 0.98) 100%)`
                          : `radial-gradient(circle at 90% 10%, ${vp.accent}1c 0%, transparent 60%), linear-gradient(145deg, ${vp.accent}10 0%, ${vp.accent}04 45%, rgba(255,255,255,0.98) 100%)`,
                        borderColor: isDark ? `${vp.accent}65` : `${vp.accent}45`,
                        boxShadow: isDark
                          ? `0 10px 24px -4px ${vp.accent}30`
                          : `0 8px 20px -4px ${vp.accent}20, 0 2px 6px rgba(0,0,0,0.04)`,
                      }}
                      className="group border-2 rounded-2xl p-6 h-full space-y-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                    >
                      {/* Top decorative accent line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80"
                        style={{ color: vp.accent }}
                      />

                      <div className="relative z-10">
                        <ShinyAnimatedIconBox
                          icon={Icon}
                          color={vp.accent}
                          size="lg"
                          index={idx + 16}
                        />
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">
                        {vp.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed relative z-10 font-medium">
                        {vp.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section className="section bg-slate-50/60 dark:bg-slate-950">
          <div className="container-wide space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                How QRHub Works
              </h2>
              <p className="text-sm md:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
                From idea to commercial print in under 30 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                {
                  step: '01',
                  title: 'Choose QR Type',
                  desc: 'Select from 16 specialized protocols like URLs, Wi-Fi, vCard, WhatsApp, or Google Maps.',
                  color: '#3B82F6',
                  colorSec: '#6366F1',
                },
                {
                  step: '02',
                  title: 'Customize Design',
                  desc: 'Pick contrast-verified colors, upload your center logo, and adjust error correction levels.',
                  color: '#8B5CF6',
                  colorSec: '#EC4899',
                },
                {
                  step: '03',
                  title: 'Download & Share',
                  desc: 'Export infinitely scalable vector SVG and PDF files or 4x high-DPI raster images for web and print.',
                  color: '#10B981',
                  colorSec: '#06B6D4',
                },
              ].map((st, i) => (
                <ScrollReveal key={st.step} delay={i * 0.06}>
                  <div
                    style={{
                      background: isDark
                        ? `radial-gradient(circle at 90% 10%, ${st.color}28 0%, transparent 60%), linear-gradient(145deg, ${st.color}18 0%, rgba(30, 41, 59, 0.85) 45%, rgba(15, 23, 42, 0.98) 100%)`
                        : `radial-gradient(circle at 90% 10%, ${st.color}1c 0%, transparent 60%), linear-gradient(145deg, ${st.color}10 0%, ${st.color}04 45%, rgba(255,255,255,0.98) 100%)`,
                      borderColor: isDark ? `${st.color}65` : `${st.color}45`,
                      boxShadow: isDark
                        ? `0 10px 24px -4px ${st.color}30`
                        : `0 8px 20px -4px ${st.color}20, 0 2px 6px rgba(0,0,0,0.04)`,
                    }}
                    className="group border-2 rounded-2xl p-7 relative overflow-hidden space-y-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    {/* Top decorative accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80"
                      style={{ color: st.color }}
                    />

                    {/* Elevated Shiny Step Pill */}
                    <div
                      className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-lg font-extrabold font-mono text-white shadow-md relative overflow-hidden transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, ${st.color}, ${st.colorSec})`,
                        boxShadow: `0 4px 14px ${st.color}45`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
                      <span className="relative z-10">{st.step}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed relative z-10 font-medium">
                      {st.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 6. TEMPLATES PREVIEW STRIP */}
        <section className="section bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
          <div className="container-wide space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Popular QR Templates
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Pre-configured layouts ready for dining, guest Wi-Fi, and executive networking.
                </p>
              </div>

              <Link to="/templates">
                <Button variant="outline" className="rounded-xl text-xs font-bold border-slate-200 dark:border-slate-700">
                  <span>Browse All Templates</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEMPLATES.slice(0, 4).map((t, idx) => (
                <ScrollReveal key={t.slug} delay={idx * 0.04}>
                  <div
                    style={{
                      background: isDark
                        ? `radial-gradient(circle at 90% 10%, ${t.accentColor}28 0%, transparent 60%), linear-gradient(145deg, ${t.accentColor}18 0%, rgba(30, 41, 59, 0.85) 45%, rgba(15, 23, 42, 0.98) 100%)`
                        : `radial-gradient(circle at 90% 10%, ${t.accentColor}1c 0%, transparent 60%), linear-gradient(145deg, ${t.accentColor}10 0%, ${t.accentColor}04 45%, rgba(255,255,255,0.98) 100%)`,
                      borderColor: isDark ? `${t.accentColor}65` : `${t.accentColor}45`,
                      boxShadow: isDark
                        ? `0 10px 24px -4px ${t.accentColor}30`
                        : `0 8px 20px -4px ${t.accentColor}20, 0 2px 6px rgba(0,0,0,0.04)`,
                    }}
                    className="group border-2 rounded-2xl p-6 flex flex-col justify-between h-full space-y-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    {/* Top decorative accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80"
                      style={{ color: t.accentColor }}
                    />

                    <div className="relative z-10">
                      <span
                        className="inline-flex px-3 py-1 rounded-full text-[11px] font-extrabold shadow-xs"
                        style={{
                          backgroundColor: isDark ? `${t.accentColor}25` : t.pastelBg,
                          color: isDark ? '#ffffff' : t.accentColor,
                          border: `1px solid ${t.accentColor}40`,
                        }}
                      >
                        {t.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-2.5">
                        {t.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 font-medium leading-relaxed">
                        {t.description}
                      </p>
                    </div>

                    <Link to={`/generator?template=${t.slug}`} className="relative z-10 mt-2">
                      <Button
                        size="sm"
                        style={{
                          background: `linear-gradient(135deg, ${t.accentColor}, ${t.accentColor}dd)`,
                          boxShadow: `0 4px 14px ${t.accentColor}40`,
                        }}
                        className="w-full text-white hover:brightness-110 font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FAQ ACCORDION SECTION */}
        <section id="faq" className="section bg-slate-50/60 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800">
          <div className="container-wide max-w-5xl space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <ScrollReveal key={i} delay={i * 0.03}>
                  <details className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                    <summary className="flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
                      <span>{faq.q}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </p>
                  </details>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FINAL CONVERSION BANNER */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
          <div className="container-wide">
            <ScrollReveal>
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-8 sm:p-12 md:p-16 text-center shadow-xl space-y-6 max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  Ready to Create Your QR Code?
                </h2>
                <p className="text-sm sm:text-base text-blue-100 max-w-lg mx-auto leading-relaxed">
                  Join professionals, marketers, and creators crafting reliable, high-resolution QR codes completely free.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                  <Link to="/generator" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto h-12 px-8 bg-white hover:bg-slate-100 text-blue-700 font-bold rounded-xl shadow-md flex items-center justify-center gap-2">
                      <QrCode className="h-4 w-4" />
                      <span>Create QR Code Now</span>
                    </Button>
                  </Link>
                  <Link to="/features" className="w-full sm:w-auto">
                    <button
                      type="button"
                      className="w-full sm:w-auto h-12 px-7 bg-blue-950/40 hover:bg-blue-950/60 active:bg-blue-950/80 text-white border-2 border-white/60 hover:border-white font-bold text-sm rounded-xl shadow-md backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      <span>Explore Features</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </div>
    </>
  );
}
