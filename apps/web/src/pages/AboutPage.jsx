import { Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  ShieldCheck, Zap, Palette, Cpu, Sparkles, ArrowRight,
  CheckCircle2, Lock, EyeOff, Layers, FileCode
} from 'lucide-react';

import SEO from '@/components/SEO';
import ScrollReveal from '@/components/ScrollReveal';
import Card3D from '@/components/Card3D';
import ShinyAnimatedIconBox from '@/components/ShinyAnimatedIconBox';
import { Button } from '@/components/ui/button';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'No database trackers, no proprietary redirect links, and no advertising cookies. Your data belongs to you.',
    color: '#10B981',
    pastel: '#ECFDF5',
  },
  {
    icon: Zap,
    title: 'Simple Workflow',
    desc: 'Frictionless generation with zero mandatory sign-up screens, onboarding walls, or spam emails.',
    color: '#4F6EF7',
    pastel: '#EEF4FF',
  },
  {
    icon: Palette,
    title: 'Professional Design',
    desc: 'Print-grade aesthetics with automated WCAG contrast checks and lossless vector SVG/PDF rendering.',
    color: '#EC4899',
    pastel: '#FFF1F7',
  },
  {
    icon: Cpu,
    title: 'Fast Generation',
    desc: 'Instant in-memory matrix synthesis running on client hardware without network round-trips.',
    color: '#F59E0B',
    pastel: '#FEF3C7',
  },
];

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'User Input',
    desc: 'You enter standard parameters like URLs, Wi-Fi credentials, or vCard fields.',
    badge: 'Raw Data',
    color: '#3B82F6',
  },
  {
    step: '02',
    title: 'Schema Formatter',
    desc: 'The data is structured into standard protocols (WIFI:, BEGIN:VCARD, mailto:).',
    badge: 'Standardized',
    color: '#6366F1',
  },
  {
    step: '03',
    title: 'QR Engine & ECC',
    desc: 'Reed-Solomon error correction matrices are generated mathematically in-memory.',
    badge: 'ISO/IEC 18004',
    color: '#8B5CF6',
  },
  {
    step: '04',
    title: 'Customization & Contrast',
    desc: 'Colors, logo excavation, and quiet zone margins are styled with live health validation.',
    badge: 'Visual Layer',
    color: '#EC4899',
  },
  {
    step: '05',
    title: 'Vector & Raster Export',
    desc: 'Rendered directly into pure SVG XML, PDF binary streams, or high-res PNG blobs.',
    badge: 'Instant Download',
    color: '#10B981',
  },
];

export default function AboutPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <SEO
        title="About QRHub — Private, Client-Side QR Generation"
        description="Learn about QRHub's mission to democratize fast, professional, and surveillance-free QR code generation for everyone."
        canonical="/about"
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-10 md:py-16">
        <div className="container-wide space-y-14">

          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              QR creation made simple, powerful and private.
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              We built QRHub because online QR code generators have become predatory — demanding recurring subscriptions for static links and capturing private customer data.
            </p>
          </div>

          {/* 4 Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, idx) => {
              const Icon = v.icon;
              return (
                <ScrollReveal key={v.title} delay={idx * 0.04}>
                  <div
                    style={{
                      background: isDark
                        ? `radial-gradient(circle at 90% 10%, ${v.color}28 0%, transparent 60%), linear-gradient(145deg, ${v.color}18 0%, rgba(30, 41, 59, 0.85) 45%, rgba(15, 23, 42, 0.98) 100%)`
                        : `radial-gradient(circle at 90% 10%, ${v.color}1c 0%, transparent 60%), linear-gradient(145deg, ${v.color}10 0%, ${v.color}04 45%, rgba(255,255,255,0.98) 100%)`,
                      borderColor: isDark ? `${v.color}65` : `${v.color}45`,
                      boxShadow: isDark
                        ? `0 10px 24px -4px ${v.color}30`
                        : `0 8px 20px -4px ${v.color}20, 0 2px 6px rgba(0,0,0,0.04)`,
                    }}
                    className="group border-2 rounded-2xl p-6 h-full space-y-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    {/* Top decorative accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80"
                      style={{ color: v.color }}
                    />

                    <div className="relative z-10">
                      <ShinyAnimatedIconBox
                        icon={Icon}
                        color={v.color}
                        size="lg"
                        index={idx}
                      />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors relative z-10">
                      {v.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed relative z-10 font-medium">
                      {v.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* How QRHub Works Architecture Pipeline */}
          <div className="space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Technical Blueprint
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                How QRHub Works in Your Browser
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                No servers in the loop. Follow the internal pipeline of client-side synthesis:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {PIPELINE_STEPS.map((step, idx) => (
                <ScrollReveal key={step.step} delay={idx * 0.04}>
                  <div
                    style={{
                      background: isDark
                        ? `radial-gradient(circle at 90% 10%, ${step.color}28 0%, transparent 60%), linear-gradient(145deg, ${step.color}18 0%, rgba(30, 41, 59, 0.85) 45%, rgba(15, 23, 42, 0.98) 100%)`
                        : `radial-gradient(circle at 90% 10%, ${step.color}1c 0%, transparent 60%), linear-gradient(145deg, ${step.color}10 0%, ${step.color}04 45%, rgba(255,255,255,0.98) 100%)`,
                      borderColor: isDark ? `${step.color}65` : `${step.color}45`,
                      boxShadow: isDark
                        ? `0 10px 24px -4px ${step.color}30`
                        : `0 8px 20px -4px ${step.color}20, 0 2px 6px rgba(0,0,0,0.04)`,
                    }}
                    className="group border-2 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-full space-y-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    {/* Top decorative accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80"
                      style={{ color: step.color }}
                    />

                    <div className="space-y-2 relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-extrabold" style={{ color: step.color }}>
                          {step.step}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: isDark ? `${step.color}25` : `${step.color}15`,
                            borderColor: `${step.color}40`,
                            color: isDark ? '#ffffff' : step.color,
                          }}
                        >
                          {step.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Direct Statement */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50/70 to-indigo-50/40 dark:from-slate-900 dark:to-slate-800/80 border border-blue-200/80 dark:border-slate-700 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
              <Lock className="h-4 w-4" />
              <span>Zero-Storage Guarantee</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              When you generate a Wi-Fi QR code containing your home or office password, that string is converted into a matrix directly in your computer's RAM. It is never logged in a cloud database or transmitted over an API. You can even disconnect your internet after loading QRHub and generate codes completely offline.
            </p>
            <div className="pt-2">
              <Link to="/generator">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs">
                  Try the Studio →
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
