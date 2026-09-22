import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

/**
 * Reusable QR type landing page template.
 */
export default function QRLandingPage({
  seoTitle, seoDesc, canonical,
  icon, title, subtitle, color = '#4263EB',
  whyItems = [], howItems = [], faqs = [],
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <>
      <SEO title={seoTitle} description={seoDesc} canonical={canonical} />
      <div className="pt-8 md:pt-12 min-h-screen bg-slate-50/60 dark:bg-slate-950">
        {/* Hero */}
        <section
          className="relative py-20 md:py-28 text-center overflow-hidden border-b border-slate-200/80 dark:border-slate-800"
          style={{
            background: isDark
              ? `radial-gradient(circle at 50% 10%, ${color}22 0%, transparent 70%), linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 1) 100%)`
              : `radial-gradient(circle at 50% 10%, ${color}15 0%, transparent 70%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)`,
          }}
        >
          <div className="container-wide">
            <div
              className="inline-flex h-20 w-20 items-center justify-center rounded-3xl text-4xl mb-6 shadow-xl border-2 transition-transform duration-300 hover:scale-105"
              style={{
                backgroundColor: isDark ? `${color}25` : `${color}15`,
                borderColor: isDark ? `${color}60` : `${color}40`,
                boxShadow: `0 10px 25px -5px ${color}30`,
              }}
            >
              {icon}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 max-w-4xl mx-auto tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              {subtitle}
            </p>
            <Button
              asChild
              size="xl"
              style={{ backgroundColor: color, boxShadow: `0 8px 24px -4px ${color}50` }}
              className="hover:-translate-y-0.5 transition-transform duration-200 text-white font-bold px-8 py-6 rounded-2xl"
            >
              <Link to="/generator" className="inline-flex items-center gap-2.5">
                <Zap className="h-5 w-5" />
                <span>Create {title.split(' ')[0]} QR Code Free</span>
              </Link>
            </Button>
          </div>
        </section>

        {/* Why section */}
        {whyItems.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container-wide max-w-5xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-10 text-center tracking-tight">
                Why use a {title.split(' ')[0]} QR code?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyItems.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      borderColor: isDark ? `${color}40` : `${color}30`,
                      boxShadow: isDark
                        ? `0 8px 20px -4px ${color}15`
                        : `0 4px 16px -2px ${color}10, 0 1px 3px rgba(0,0,0,0.04)`,
                    }}
                    className="flex gap-4 p-6 rounded-2xl border-2 bg-white dark:bg-slate-900/90 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="text-3xl shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center h-12 w-12">
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">{item.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How to section */}
        {howItems.length > 0 && (
          <section className="py-16 md:py-24 bg-slate-100/70 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
            <div className="container-wide max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-10 text-center tracking-tight">
                How to create one in 4 easy steps
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {howItems.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-sm font-black shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {i + 1}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</p>
                      {step.desc && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{step.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Button asChild size="lg" className="rounded-xl px-6 py-5">
                  <Link to="/generator" className="inline-flex items-center gap-2 font-bold">
                    <span>Open Generator</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container-wide max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-10 text-center tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs"
                  >
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
