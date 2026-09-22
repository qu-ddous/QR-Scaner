import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const LEGAL_NAV = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies', current: true },
  { label: 'HTML Sitemap', href: '/sitemap' },
];

export default function CookiesPage() {
  return (
    <>
      <SEO
        title="Cookie Policy — QRHub"
        description="Understanding how QRHub handles local browser storage and cookie settings."
        canonical="/cookies"
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
                  Cookie & Storage Policy
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Straightforward explanation of our local storage usage.
                </p>
              </div>

              <div className="prose-legal space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. What Are Cookies and Local Storage?</h2>
                  <p>
                    Cookies and Web Storage (localStorage) are small files placed on your browser by websites you visit. They allow sites to remember user preferences between visits.
                  </p>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Essential Local Storage Items</h2>
                  <p>
                    QRHub does not store marketing cookies. We use browser local storage solely for essential UI preferences:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Theme Preference:</strong> Stored to remember whether you selected Light or Dark mode.
                    </li>
                    <li>
                      <strong>Local QR History & Folders:</strong> Stored under <code>qrhub_history_v1</code> to allow you to revisit, categorize, and duplicate previous QR codes you customized.
                    </li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. How to Manage or Clear Local Storage</h2>
                  <p>
                    You can clear all saved QR history at any time using the "Clear" button directly inside QRHub, or by clearing your browser cache and cookies under your browser's Privacy & Security settings.
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
