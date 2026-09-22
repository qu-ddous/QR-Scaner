import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  QrCode, Menu, X, Plus, Sparkles, History, LayoutTemplate,
  Sun, Moon, Home, Layers, User, Mail, ChevronRight, Copy, ScanLine
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home',      href: '/',          icon: Home },
  { label: 'Studio',    href: '/generator', icon: QrCode },
  { label: 'Scanner',   href: '/scanner',   icon: ScanLine },
  { label: 'Bulk QR',   href: '/bulk',      icon: Layers },
  { label: 'Templates', href: '/templates', icon: LayoutTemplate },
  { label: 'History',   href: '/history',   icon: History },
  { label: 'About',     href: '/about',     icon: User },
  { label: 'Contact',   href: '/contact',   icon: Mail },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 inset-x-0 z-50 w-full max-w-full transition-all duration-300',
          scrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(23,32,51,0.06)]'
            : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-b border-transparent'
        )}
      >
        <div className="container-wide">
          <div className="flex h-16 sm:h-18 items-center justify-between py-2 sm:py-2.5">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
              aria-label="QRHub — Modern Vector QR Code Platform"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-[0_4px_12px_rgba(79,110,247,0.35)] group-hover:scale-105 group-hover:shadow-[0_6px_18px_rgba(79,110,247,0.45)] transition-all duration-300">
                <QrCode className="h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    QR<span className="text-blue-600">Hub</span>
                  </span>
                  <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/40 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    HUB
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
                  Universal Studio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-full border-2 border-blue-500/40 dark:border-blue-500/60 shadow-[0_0_15px_-3px_rgba(59,130,246,0.18)] dark:shadow-[0_0_20px_-3px_rgba(59,130,246,0.3)] transition-all duration-300 hover:border-blue-500/70 dark:hover:border-blue-400/80">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-2 text-[13.5px] font-semibold rounded-full transition-all duration-200',
                      isActive
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Action Area: Theme Toggle + Create QR CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button */}
              {mounted && (
                <button
                  onClick={() => setTheme((resolvedTheme || theme) === 'dark' ? 'light' : 'dark')}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 shadow-xs transition-all"
                  aria-label="Toggle theme mode"
                >
                  {(resolvedTheme || theme) === 'dark' ? (
                    <Sun className="h-4.5 w-4.5 text-amber-400" />
                  ) : (
                    <Moon className="h-4.5 w-4.5 text-slate-600" />
                  )}
                </button>
              )}

              {/* Quick Generator CTA (Desktop & Tablet) */}
              <Link to="/generator" className="hidden sm:inline-flex">
                <Button
                  className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm h-10 px-4 sm:px-5 rounded-xl shadow-[0_4px_14px_rgba(79,110,247,0.35)] hover:shadow-[0_8px_22px_rgba(79,110,247,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 group"
                >
                  <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                  <span>Create QR</span>
                </Button>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 active:scale-95 transition-all"
                aria-label="Toggle Navigation Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Animated Drawer Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl px-4 py-5 shadow-2xl overflow-y-auto max-h-[calc(100vh-4.5rem)]"
            >
              <div className="grid grid-cols-2 gap-2 pb-3">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all',
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800 shadow-xs'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400')} />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link to="/generator" onClick={() => setMobileOpen(false)} className="block w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm">
                    <QrCode className="h-4 w-4" />
                    <span>Open Generator Studio</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Native App Bottom Navigation Bar (Fixed for mobile screens < lg) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 w-full max-w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 items-center h-16 px-2 max-w-md mx-auto">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 py-1 transition-colors',
                isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              )
            }
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] tracking-tight">Home</span>
          </NavLink>

          {/* Templates */}
          <NavLink
            to="/templates"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 py-1 transition-colors',
                isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              )
            }
          >
            <LayoutTemplate className="h-5 w-5" />
            <span className="text-[10px] tracking-tight">Templates</span>
          </NavLink>

          {/* Center Elevated Studio Action Button */}
          <NavLink
            to="/generator"
            className="flex flex-col items-center justify-center -mt-5 group"
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(79,110,247,0.45)] group-hover:scale-105 group-active:scale-95 transition-all">
              <QrCode className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1">
              Studio
            </span>
          </NavLink>

          {/* History */}
          <NavLink
            to="/history"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 py-1 transition-colors',
                isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              )
            }
          >
            <History className="h-5 w-5" />
            <span className="text-[10px] tracking-tight">History</span>
          </NavLink>

          {/* Menu / More */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 py-1 transition-colors',
              mobileOpen ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="text-[10px] tracking-tight">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
