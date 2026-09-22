import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import SEO from '@/components/SEO';

const LEGAL_NAV = [
  { label: 'Privacy Policy', href: '/privacy', current: true },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'HTML Sitemap', href: '/sitemap' },
];

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy — QRHub"
        description="Our transparent commitment to 100% client-side QR generation and zero personal data retention."
        canonical="/privacy"
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
                  Privacy Policy
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Transparent disclosure of our client-side processing architecture.
                </p>
              </div>

              {/* Highlight Card */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 space-y-2">
                <div className="font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-base">
                  <ShieldCheck className="h-5 w-5 shrink-0" />
                  <span>Your QR data stays in your browser</span>
                </div>
                <p className="leading-relaxed">
                  When you use QRHub to generate static QR codes, the encoding and rendering happen entirely within your local web browser. Your URLs, text, passwords, and contact info are never transmitted to, logged by, or stored on remote servers.
                </p>
              </div>

              <div className="prose-legal space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Information We Do Not Collect</h2>
                  <p>
                    Because QRHub is architected as a client-side application, we do not collect:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The target destination URL or payload of any generated QR code.</li>
                    <li>Wi-Fi network names (SSIDs) or pre-shared keys (passwords).</li>
                    <li>Personal vCard entries, phone numbers, email addresses, or calendar events.</li>
                    <li>Uploaded brand logos or images embedded in QR centers.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Local Storage Usage</h2>
                  <p>
                    QRHub utilizes your browser's standard <code>localStorage</code> API solely to provide local productivity features:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Theme Preference:</strong> Remembers your light or dark mode setting.</li>
                    <li><strong>QR History & Folders:</strong> Stores your previously created codes locally on your machine so you can revisit, categorize, or duplicate them. This data remains on your device and can be cleared at any time with the "Clear" button on the History page.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Third-Party Analytics & Cookies</h2>
                  <p>
                    QRHub does not employ invasive advertising networks, cross-site trackers, or third-party behavioral fingerprinting.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Contact & Inquiries</h2>
                  <p>
                    If you contact us via email, we only use your email address to reply to your inquiry. We never sell or share contact details.
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
