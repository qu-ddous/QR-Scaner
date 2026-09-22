import React from 'react';
import { Link } from 'react-router-dom';
import {
  QrCode, Github, Globe, Linkedin, Instagram,
  Mail, ArrowUp, ShieldCheck, Sparkles, Layers,
  Palette
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full overflow-hidden mt-16 sm:mt-24 select-none">

      {/* ========================================================================= */}
      {/* TOP CURVED WAVE DIVIDER (High Visibility in Light & Dark Mode)             */}
      {/* ========================================================================= */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 md:h-20 block preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Luminous Gradient Stroke for Dark Mode & Light Mode Separation */}
            <linearGradient id="topWaveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Fill Path: Adaptive for Light (slate-900) and Dark (vibrant royal indigo) */}
          <path
            d="M0,40 C320,85 460,10 740,45 C1020,80 1220,15 1440,30 L1440,90 L0,90 Z"
            className="fill-slate-900 dark:fill-[#141e33] transition-colors duration-300"
          />
          {/* Glowing Wave Crest Line (Guarantees visible organic separation in ALL themes) */}
          <path
            d="M0,40 C320,85 460,10 740,45 C1020,80 1220,15 1440,30"
            stroke="url(#topWaveStroke)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-90 dark:opacity-100 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* BAND 1: CORE ARCHITECTURE PILLARS (Slate-900 in Light, Royal Navy in Dark)*/}
      {/* ========================================================================= */}
      <div className="w-full bg-slate-900 dark:bg-[#141e33] text-white pt-2 pb-8 sm:pb-12 px-4 sm:px-8 relative border-t border-indigo-500/20 dark:border-indigo-500/30 transition-colors duration-300">

        {/* Subtle Ambient Glow inside Band 1 */}
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-blue-500/10 dark:bg-blue-500/20 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-purple-500/10 dark:bg-purple-500/20 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-left">

            {/* Pillar 1: Privacy First Architecture (Subtle Royal Blue Tint) */}
            <div className="space-y-2.5 group p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-500/15 via-slate-800/80 to-blue-900/10 dark:from-blue-600/20 dark:via-[#172554]/40 dark:to-slate-900/60 border border-blue-500/30 dark:border-blue-400/35 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/15 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/25 text-blue-400 dark:text-blue-300 border border-blue-400/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-blue-500/20">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">
                  100% Private & Local
                </h4>
              </div>
              <p className="text-xs text-slate-300/85 dark:text-slate-300 leading-relaxed">
                Zero server telemetry or data logs. QR generation, data hashing, and encryption run exclusively in your browser.
              </p>
            </div>

            {/* Pillar 2: Vector SVG & Print Ready (Subtle Violet / Purple Tint) */}
            <div className="space-y-2.5 group p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-violet-500/15 via-slate-800/80 to-purple-900/10 dark:from-violet-600/20 dark:via-[#2e1065]/40 dark:to-slate-900/60 border border-violet-500/30 dark:border-violet-400/35 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/15 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-500/25 text-violet-400 dark:text-violet-300 border border-violet-400/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-violet-500/20">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                  Lossless Vector SVG & PDF
                </h4>
              </div>
              <p className="text-xs text-slate-300/85 dark:text-slate-300 leading-relaxed">
                Export ultra-crisp vector graphics, 1024px PNG, and printable label sheets that never pixelate on print or screens.
              </p>
            </div>

            {/* Pillar 3: Smart Power Studios (Subtle Emerald / Mint Tint) */}
            <div className="space-y-2.5 group p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-800/80 to-teal-900/10 dark:from-emerald-600/20 dark:via-[#064e3b]/40 dark:to-slate-900/60 border border-emerald-500/30 dark:border-emerald-400/35 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/15 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/25 text-emerald-400 dark:text-emerald-300 border border-emerald-400/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-emerald-500/20">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-200 transition-colors">
                  Bulk & Secret Studios
                </h4>
              </div>
              <p className="text-xs text-slate-300/85 dark:text-slate-300 leading-relaxed">
                Generate 100+ QR codes in seconds with CSV import, camera scanner, and password-protected encrypted notes.
              </p>
            </div>

            {/* Pillar 4: Custom Design & Styling (Subtle Amber / Orange Tint) */}
            <div className="space-y-2.5 group p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-800/80 to-orange-900/10 dark:from-amber-600/20 dark:via-[#451a03]/40 dark:to-slate-900/60 border border-amber-500/30 dark:border-amber-400/35 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15 transition-all duration-300 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/25 text-amber-400 dark:text-amber-300 border border-amber-400/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-amber-500/20">
                  <Palette className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors">
                  Design & Custom Styles
                </h4>
              </div>
              <p className="text-xs text-slate-300/85 dark:text-slate-300 leading-relaxed">
                Tailor vibrant linear gradients, custom dot patterns, unique eye styles, and upload brand logos effortlessly.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECOND CURVED WAVE DIVIDER (Clear Contrast Between Bands)                 */}
      {/* ========================================================================= */}
      <div className="w-full overflow-hidden leading-none -mb-[1px] bg-slate-900 dark:bg-[#141e33] transition-colors duration-300">
        <svg
          viewBox="0 0 1440 95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 md:h-20 block preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="bottomWaveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Fill Path: Deep Navy in Light Mode, Midnight Obsidian in Dark Mode */}
          <path
            d="M0,30 C300,90 520,95 820,45 C1120,-5 1280,65 1440,50 L1440,95 L0,95 Z"
            className="fill-[#080d1a] dark:fill-[#080d18] transition-colors duration-300"
          />
          {/* Glowing Wave Crest Line */}
          <path
            d="M0,30 C300,90 520,95 820,45 C1120,-5 1280,65 1440,50"
            stroke="url(#bottomWaveStroke)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-80 dark:opacity-90 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* BAND 2: DEEP MIDNIGHT BOTTOM TIER (QRHub Links, Socials & Branding)       */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#080d1a] dark:bg-[#080d18] text-slate-300 pt-6 pb-12 sm:pb-16 px-4 sm:px-8 border-t border-slate-800/80 dark:border-indigo-500/20 transition-colors duration-300 relative">

        {/* Soft Ambient Radiance in Footer Bottom */}
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[180px] bg-blue-600/5 dark:bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* Column 1: About (2 Cols) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 dark:text-blue-200 font-mono">
                About QRHub
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400 dark:text-slate-300">
                <li>
                  <Link to="/about" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    About Project
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Core Features
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Saved History
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Studios & Tools (2 Cols) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 dark:text-blue-200 font-mono">
                Power Studios
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400 dark:text-slate-300">
                <li>
                  <Link to="/generator" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Standard Generator
                  </Link>
                </li>
                <li>
                  <Link to="/bulk" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Bulk & Batch Studio
                  </Link>
                </li>
                <li>
                  <Link to="/generator?type=text" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Secret Encrypted Note
                  </Link>
                </li>
                <li>
                  <Link to="/scanner" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Universal QR Scanner
                  </Link>
                </li>
                <li>
                  <Link to="/templates" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Templates Library
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Types (2 Cols) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 dark:text-blue-200 font-mono">
                QR Types
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400 dark:text-slate-300">
                <li>
                  <Link to="/qr/url" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Website & Link
                  </Link>
                </li>
                <li>
                  <Link to="/qr/wifi" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Wi-Fi Auto-Connect
                  </Link>
                </li>
                <li>
                  <Link to="/qr/vcard" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Digital vCard
                  </Link>
                </li>
                <li>
                  <Link to="/qr/whatsapp" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    WhatsApp Message
                  </Link>
                </li>
                <li>
                  <Link to="/qr/email" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Email & Phone
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Trust (2 Cols) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 dark:text-blue-200 font-mono">
                Trust & Legal
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400 dark:text-slate-300">
                <li>
                  <Link to="/privacy" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="hover:text-blue-400 dark:hover:text-blue-300 transition-colors block">
                    Sitemap Directory
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Brand Identity + Social Links + Back to top (4 Cols on LG) */}
            <div className="col-span-2 md:col-span-4 lg:col-span-4 flex flex-col items-center lg:items-end justify-between pt-4 lg:pt-0 border-t md:border-t-0 border-slate-800 dark:border-slate-800 text-center lg:text-right space-y-5">

              {/* Brand Logo & Back to Top */}
              <div className="flex flex-col items-center lg:items-end gap-2.5">
                <Link to="/" className="inline-flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all duration-200">
                    <QrCode className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-lg font-black tracking-tight text-white">
                    QR<span className="text-blue-400">Hub</span>
                  </span>
                </Link>
                <p className="text-xs text-slate-400 dark:text-slate-300 max-w-xs leading-relaxed">
                  The private, client-side QR studio for developers, designers and creators.
                </p>
                <button
                  onClick={scrollToTop}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 dark:bg-slate-800 hover:bg-slate-700 dark:hover:bg-slate-700 px-3.5 py-1.5 rounded-full border border-slate-700/80 dark:border-indigo-500/30 transition-all hover:scale-105 shadow-sm"
                  title="Scroll to top of page"
                >
                  <span>Back to top</span>
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Social Media Links */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-300 font-mono">
                  Social & Developer Links
                </p>
                <div className="flex items-center justify-center lg:justify-end gap-2 flex-wrap">
                  {/* Portfolio Website (Replaced Twitter) */}
                  <a
                    href="https://quddous-portfolio.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Developer Portfolio"
                    title="Portfolio Website"
                    className="w-8 h-8 rounded-lg bg-slate-800/90 dark:bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/80 dark:border-slate-700 shadow-sm hover:scale-110"
                  >
                    <Globe className="h-4 w-4" />
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/qu-ddous"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    title="GitHub: qu-ddous"
                    className="w-8 h-8 rounded-lg bg-slate-800/90 dark:bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/80 dark:border-slate-700 shadow-sm hover:scale-110"
                  >
                    <Github className="h-4 w-4" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/m-quddous-4850903a4"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn: M Quddous"
                    className="w-8 h-8 rounded-lg bg-slate-800/90 dark:bg-slate-800 hover:bg-blue-700 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/80 dark:border-slate-700 shadow-sm hover:scale-110"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/quddous.08?stkn=bjI1N3hnZXY5Y2F4"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram: @quddous.08"
                    className="w-8 h-8 rounded-lg bg-slate-800/90 dark:bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/80 dark:border-slate-700 shadow-sm hover:scale-110"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/923092189637"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    title="WhatsApp: +92 309 2189637"
                    className="w-8 h-8 rounded-lg bg-slate-800/90 dark:bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/80 dark:border-slate-700 shadow-sm hover:scale-110"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>

                  {/* Mail */}
                  <a
                    href="mailto:m.quddous7172@gmail.com"
                    aria-label="Contact Email"
                    title="Email: m.quddous7172@gmail.com"
                    className="w-8 h-8 rounded-lg bg-slate-800/90 dark:bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/80 dark:border-slate-700 shadow-sm hover:scale-110"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Copyright Notice */}
              <div className="text-[11px] text-slate-400 dark:text-slate-400 space-y-0.5 pt-1">
                <p className="font-semibold text-slate-300 dark:text-slate-200">
                  © {currentYear} QRHub. All rights reserved.
                </p>
                <p className="text-[10px] text-slate-400">
                  Engineered for Privacy, Speed & Precision.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

    </footer>
  );
}
