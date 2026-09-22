import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const LEGAL_NAV = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms', current: true },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'HTML Sitemap', href: '/sitemap' },
];

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service — QRHub"
        description="Terms of Service for using QRHub QR Code Generator Studio."
        canonical="/terms"
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-16 md:py-24">
        <div className="container-wide max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Sidebar Navigation */}
            <aside className="lg:col-span-3 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
                  Legal Documents
                </span>
                {LEGAL_NAV.map((nav) => (
                  <Link
                    key={nav.href}
                    to={nav.href}
                    className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      nav.current
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {nav.label}
                  </Link>
                ))}
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Effective Date: September 15, 2026
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Terms of Service
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Rules and agreements for utilizing QRHub.
                </p>
              </div>

              <div className="prose-legal space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using QRHub, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Service Usage & License</h2>
                  <p>
                    QRHub provides free client-side tools for generating, scanning, and exporting QR codes. You are granted an unrestricted, worldwide, royalty-free license to use all generated QR codes for personal, educational, commercial, and promotional printing.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. User Content & Prohibited Uses</h2>
                  <p>
                    You are solely responsible for any content or URLs encoded into your QR codes. You agree not to generate QR codes that link to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Malicious software, phishing pages, or malware downloads.</li>
                    <li>Unlawful content, harassment, or fraudulent investment schemes.</li>
                    <li>Content that infringes third-party intellectual property rights.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Availability & Warranties</h2>
                  <p>
                    QRHub is provided on an "as-is" and "as-available" basis. While our client-side architecture guarantees that static QR codes remain permanent and do not depend on our servers to function once downloaded, we make no warranties regarding uninterrupted website uptime.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
                  <p>
                    In no event shall QRHub be liable for any indirect, incidental, special, or consequential damages arising out of the use or inability to use the service.
                  </p>
                </section>
              </div>
            </main>

          </div>
        </div>
      </div>
    </>
  );
}
