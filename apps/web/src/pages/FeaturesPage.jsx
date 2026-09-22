import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  Zap, Layers, Palette, Download, ShieldCheck, Smartphone,
  Activity, LayoutTemplate, History, CheckCircle2, ArrowRight, Sparkles,
  QrCode, FileCode, Check
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

import SEO from '@/components/SEO';
import ScrollReveal from '@/components/ScrollReveal';
import Card3D from '@/components/Card3D';
import ShinyAnimatedIconBox from '@/components/ShinyAnimatedIconBox';
import { Button } from '@/components/ui/button';

const FEATURES_GRID = [
  {
    icon: Zap,
    title: 'Smart QR Generation',
    desc: 'Instant, deterministic matrix computation in native JavaScript with zero latency.',
    color: '#4F6EF7',
    tag: 'Instant Speed',
  },
  {
    icon: Layers,
    title: '16 Specialized QR Types',
    desc: 'Covers URLs, Wi-Fi networks, vCards, WhatsApp, events, crypto wallets, and more.',
    color: '#6366F1',
    tag: '16 Schemas',
  },
  {
    icon: Palette,
    title: 'Advanced Customization',
    desc: 'Precision color pickers, curated palettes, logo embedding, and margin control.',
    color: '#EC4899',
    tag: 'Hex Palettes',
  },
  {
    icon: Download,
    title: 'Multiple Export Formats',
    desc: 'Direct in-browser export to vector SVG & PDF, plus 4x resolution PNG, JPG, and WebP.',
    color: '#F59E0B',
    tag: 'Vector & Raster',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First Architecture',
    desc: 'Zero telemetry, no database logging, and no tracking redirects. Your data stays private.',
    color: '#10B981',
    tag: '100% Private',
  },
  {
    icon: Smartphone,
    title: 'Responsive Workstation',
    desc: 'Fully optimized studio layout for desktops, laptops, tablets, and mobile devices.',
    color: '#06B6D4',
    tag: 'Universal UI',
  },
  {
    icon: Activity,
    title: 'Real-Time Health Checks',
    desc: 'Automatic contrast ratio checks and payload validation to prevent unreadable prints.',
    color: '#8B5CF6',
    tag: 'Quality Guardrails',
  },
  {
    icon: LayoutTemplate,
    title: 'Curated Blueprint Templates',
    desc: 'Ready-to-use blueprints for dining menus, Wi-Fi stickers, conference passes, and tips.',
    color: '#F97316',
    tag: 'Ready Presets',
  },
  {
    icon: History,
    title: 'Local QR History',
    desc: 'Store, inspect, duplicate, and re-export your previously designed codes locally.',
    color: '#2563EB',
    tag: 'Local Storage',
  },
];

const DEEP_DIVES = [
  {
    tag: 'Generation Engine',
    title: 'Powerful, Deterministic QR Synthesis',
    desc: 'QRHub executes byte-level Reed-Solomon error correction directly in memory. Every module, alignment pattern, and timing track is computed precisely to meet ISO/IEC 18004 standards.',
    bullets: [
      'Standardized schema formatting (WIFI:, BEGIN:VCARD, mailto:, smsto:)',
      'Four error correction levels: L (7%), M (15%), Q (25%), H (30%)',
      'Automatic URL protocol normalization (adds https:// if missing)',
    ],
    qrValue: 'https://qrhub.app/generator',
    ecc: 'H',
    fg: '#172033',
    bg: '#ffffff',
    accent: '#4F6EF7',
  },
  {
    tag: 'Color & Contrast',
    title: 'Professional Customization with Built-in Quality Guardrails',
    desc: 'Beauty should never compromise scan reliability. QRHub includes automated WCAG contrast ratio calculations and warns you if your color selections fall below safe scannability thresholds.',
    bullets: [
      'Hex color pickers with curated designer palette presets',
      'Logo upload with auto-excavation of underlying QR modules',
      'Dynamic quiet zone (margin) toggle with 4-module safety spacing',
    ],
    qrValue: 'WIFI:S:Guest-Lounge;T:WPA;P:SecretPass2026;;',
    ecc: 'Q',
    fg: '#312E81',
    bg: '#EEF2FF',
    accent: '#6366F1',
  },
  {
    tag: 'Vector & Raster',
    title: 'Export Anywhere: From Mobile Screens to 100ft Billboards',
    desc: 'Never worry about pixelation again. Export mathematically precise vector SVG and PDF files that print razor-sharp at any size, or high-density 4x raster PNGs for digital sharing.',
    bullets: [
      'SVG & PDF vector output for offset and flexographic printing',
      '1x, 2x, and 4x (up to 4096px) raster supersampling',
      'Direct OS clipboard copying and native device sharing sheet support',
    ],
    qrValue: 'BEGIN:VCARD\nVERSION:3.0\nN:Sterling;Aria;;;\nFN:Aria Sterling\nORG:QRHub Studio\nTEL:+15550192834\nEMAIL:aria@qrhub.app\nEND:VCARD',
    ecc: 'H',
    fg: '#064E3B',
    bg: '#ECFDF5',
    accent: '#10B981',
  },
  {
    tag: 'Data Sovereignty',
    title: '100% Client-Side Privacy: No Server Middlemen',
    desc: 'Most online QR generators send your sensitive links and Wi-Fi passwords to a remote database, injecting proprietary short URLs that break when their service shuts down. QRHub creates direct, static QR codes that last forever.',
    bullets: [
      'Zero server round-trips for QR payload generation',
      'No URL shorteners, tracking redirects, or dynamic paywalls',
      'Wi-Fi passwords and private contact vCards remain strictly on your machine',
    ],
    qrValue: 'https://qrhub.app/about',
    ecc: 'M',
    fg: '#7C2D12',
    bg: '#FFF7ED',
    accent: '#F97316',
  },
];

export default function FeaturesPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <>
      <SEO
        title="Features — Powerful, Private & Vector-Ready QR Code Generation"
        description="Discover QRHub features: 17 QR types, vector SVG/PDF exports, contrast health checks, center logo embedding, and 100% client-side privacy."
        canonical="/features"
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-10 md:py-16">
        <div className="container-wide space-y-16">

          {/* 1. HERO */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Everything You Need to Create Better QR Codes.
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Designed from the ground up for designers, agencies, and businesses that need reliable, high-resolution QR codes without privacy compromises.
            </p>
          </div>

          {/* 2. 9-CARD FEATURE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES_GRID.map((f, idx) => {
              const Icon = f.icon;
              return (
                <ScrollReveal key={f.title} delay={idx * 0.03}>
                  <div
                    style={{
                      background: isDark
                        ? `radial-gradient(circle at 90% 10%, ${f.color}28 0%, transparent 60%), linear-gradient(145deg, ${f.color}18 0%, rgba(30, 41, 59, 0.85) 45%, rgba(15, 23, 42, 0.98) 100%)`
                        : `radial-gradient(circle at 90% 10%, ${f.color}1c 0%, transparent 60%), linear-gradient(145deg, ${f.color}10 0%, ${f.color}04 45%, rgba(255,255,255,0.98) 100%)`,
                      borderColor: isDark ? `${f.color}65` : `${f.color}45`,
                      boxShadow: isDark
                        ? `0 10px 24px -4px ${f.color}30`
                        : `0 8px 20px -4px ${f.color}20, 0 2px 6px rgba(0,0,0,0.04)`,
                    }}
                    className="group block h-full border-2 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    {/* Top decorative accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80"
                      style={{ color: f.color }}
                    />

                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <ShinyAnimatedIconBox
                        icon={Icon}
                        color={f.color}
                        size="md"
                        index={idx}
                      />
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-xs"
                        style={{
                          backgroundColor: isDark ? `${f.color}25` : `${f.color}15`,
                          borderColor: `${f.color}40`,
                          color: isDark ? '#ffffff' : f.color,
                        }}
                      >
                        {f.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">
                      {f.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed relative z-10 font-medium">
                      {f.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* 3. DEEP-DIVE ALTERNATING SECTIONS */}
          <div className="space-y-20 pt-8">
            {DEEP_DIVES.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <ScrollReveal key={item.title}>
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>

                    {/* Visual Mockup Card */}
                    <div className={`lg:col-span-5 flex justify-center ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div
                        style={{
                          background: isDark
                            ? `radial-gradient(circle at 90% 10%, ${item.accent}28 0%, transparent 60%), linear-gradient(145deg, ${item.accent}18 0%, rgba(30, 41, 59, 0.85) 45%, rgba(15, 23, 42, 0.98) 100%)`
                            : `radial-gradient(circle at 90% 10%, ${item.accent}1c 0%, transparent 60%), linear-gradient(145deg, ${item.accent}10 0%, ${item.accent}04 45%, rgba(255,255,255,0.98) 100%)`,
                          borderColor: isDark ? `${item.accent}65` : `${item.accent}45`,
                          boxShadow: isDark
                            ? `0 14px 30px -4px ${item.accent}30`
                            : `0 10px 24px -4px ${item.accent}20, 0 2px 6px rgba(0,0,0,0.04)`,
                        }}
                        className="w-full max-w-sm border-2 rounded-2xl p-8 shadow-md flex flex-col items-center text-center space-y-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                      >
                        {/* Top decorative accent line */}
                        <div
                          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80"
                          style={{ color: item.accent }}
                        />

                        <span
                          className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border relative z-10"
                          style={{
                            backgroundColor: isDark ? `${item.accent}25` : `${item.accent}15`,
                            borderColor: `${item.accent}40`,
                            color: isDark ? '#ffffff' : item.accent,
                          }}
                        >
                          {item.tag.toUpperCase()}
                        </span>
                        <div
                          className="p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative z-10"
                          style={{ backgroundColor: item.bg }}
                        >
                          <QRCodeCanvas
                            value={item.qrValue}
                            size={160}
                            fgColor={item.fg}
                            bgColor={item.bg}
                            level={item.ecc}
                            includeMargin={false}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 relative z-10">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>ISO/IEC 18004 Compliant</span>
                        </span>
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                        {item.tag}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {item.title}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>

                      <ul className="space-y-2.5 pt-2 text-sm text-slate-600 dark:text-slate-300">
                        {item.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* 4. BOTTOM CTA */}
          <div className="pt-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 sm:p-12 text-center space-y-5 max-w-4xl mx-auto shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to explore the studio?</h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto">
                Start generating print-ready codes in seconds. No login or payments required.
              </p>
              <Link to="/generator">
                <Button className="bg-white hover:bg-slate-100 text-blue-600 font-bold px-6 py-2.5 rounded-xl shadow-sm">
                  Launch QR Studio →
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
