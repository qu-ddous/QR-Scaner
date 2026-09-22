import { Link } from 'react-router-dom';
import {
  Compass, Globe, Layers, BookOpen, Shield, HelpCircle,
  ArrowRight, QrCode, Sparkles
} from 'lucide-react';

import SEO from '@/components/SEO';
import ScrollReveal from '@/components/ScrollReveal';
import Card3D from '@/components/Card3D';
import ShinyAnimatedIconBox from '@/components/ShinyAnimatedIconBox';
import { QR_TYPES } from '@/hooks/useQRCodeGenerator';
import { TEMPLATES } from '@/lib/templatesData';

const MAIN_PAGES = [
  { label: 'Home Page', href: '/', desc: 'Platform landing page & interactive demo' },
  { label: 'QR Generator Studio', href: '/generator', desc: 'Full workstation with 1-click logos & print presets' },
  { label: 'Bulk & Batch Generator', href: '/bulk', desc: 'Batch generation of up to 100 codes from CSV or text' },
  { label: 'Platform Features', href: '/features', desc: '17 schemas, vector exports & deep dives' },
  { label: 'Templates Catalog', href: '/templates', desc: 'Curated real-world blueprints' },
  { label: 'History & Folders', href: '/history', desc: 'Manage saved browser QR codes and export backups' },
];

const RESOURCES = [
  { label: 'About QRHub', href: '/about', desc: 'Mission, values & technical pipeline' },
  { label: 'Contact & Support', href: '/contact', desc: 'Direct team inquiries' },
];

const LEGAL_PAGES = [
  { label: 'Privacy Policy', href: '/privacy', desc: 'Client-side zero-storage commitment' },
  { label: 'Terms of Service', href: '/terms', desc: 'Royalty-free commercial use' },
  { label: 'Cookie Policy', href: '/cookies', desc: 'Local storage disclosure' },
];

export default function SitemapPage() {
  return (
    <>
      <SEO
        title="HTML Sitemap — QRHub All Pages Directory"
        description="Comprehensive index of all QRHub pages, dedicated QR schema landing pages, bulk generator, templates, and guides."
        canonical="/sitemap"
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-16 md:py-24">
        <div className="container-wide space-y-16">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              HTML Sitemap
            </h1>
            <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Quick access to every tool, documentation page, template blueprint, and legal disclosure across QRHub.
            </p>
          </div>

          {/* Section 1: Main Platform Pages */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Main Pages</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {MAIN_PAGES.map((page) => (
                <Link
                  key={page.href}
                  to={page.href}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {page.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{page.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Visit page</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 2: 16 Dedicated QR Landing Pages */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <QrCode className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">16 Dedicated QR Type Pages</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {QR_TYPES.map((t, idx) => (
                <Link
                  key={t.id}
                  to={`/qr/${t.id}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all flex items-center gap-2.5 group"
                >
                  <ShinyAnimatedIconBox
                    icon={QrCode}
                    color={t.color}
                    size="sm"
                    index={idx}
                    delay={idx * 0.08}
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 truncate">
                    {t.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 3: Templates Catalog */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ready-to-Use Templates</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {TEMPLATES.map((tpl) => (
                <Link
                  key={tpl.slug}
                  to={`/templates/${tpl.slug}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 truncate">
                    {tpl.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">{tpl.category}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 4: Resources & Legal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Resources */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <BookOpen className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resources & Company</h2>
              </div>
              <div className="space-y-2.5">
                {RESOURCES.map((r) => (
                  <Link
                    key={r.href}
                    to={r.href}
                    className="block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 hover:border-amber-300 transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
                      {r.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{r.desc}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <Shield className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Legal Agreements</h2>
              </div>
              <div className="space-y-2.5">
                {LEGAL_PAGES.map((l) => (
                  <Link
                    key={l.href}
                    to={l.href}
                    className="block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 hover:border-emerald-300 transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                      {l.label}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{l.desc}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
