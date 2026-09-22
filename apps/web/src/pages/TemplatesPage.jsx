import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Sparkles, ArrowRight, Utensils, Wifi, CreditCard, MessageSquare,
  Share2, MapPin, Calendar, Coins, ExternalLink, CheckCircle2,
  Lock, Layers
} from 'lucide-react';

import { TEMPLATES } from '@/lib/templatesData';
import { formatQRData } from '@/lib/qrDataFormatter';
import SEO from '@/components/SEO';
import ScrollReveal from '@/components/ScrollReveal';
import Card3D from '@/components/Card3D';
import ShinyAnimatedIconBox from '@/components/ShinyAnimatedIconBox';
import { Button } from '@/components/ui/button';

const ICONS = {
  Utensils,
  Wifi,
  CreditCard,
  MessageSquare,
  Share2,
  MapPin,
  Calendar,
  Coins,
  Lock,
  Layers,
};

export default function TemplatesPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

  const filtered = selectedCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <>
      <SEO
        title="Ready-to-Use QR Code Templates — QRHub"
        description="Jumpstart your QR codes with tested templates for restaurant menus, Wi-Fi access, digital business cards, WhatsApp support, and event invites."
        canonical="/templates"
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 py-8 md:py-16 pb-24 lg:pb-20">
        <div className="container-wide space-y-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Start Faster With Ready-to-Use QR Templates
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Curated layouts and pre-filled schemas crafted for immediate real-world deployment across retail, dining, networking, and events.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-102'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((t, idx) => {
              const Icon = ICONS[t.iconName] || Sparkles;
              return (
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
                    className="group border-2 rounded-2xl p-5 flex flex-col justify-between h-full space-y-4 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    {/* Top decorative accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-80"
                      style={{ color: t.accentColor }}
                    />

                    <div className="relative z-10">
                      {/* Badge & Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                          style={{
                            backgroundColor: isDark ? `${t.accentColor}25` : t.pastelBg,
                            borderColor: `${t.accentColor}40`,
                            color: isDark ? '#ffffff' : t.accentColor,
                          }}
                        >
                          {t.category}
                        </span>
                        <ShinyAnimatedIconBox
                          icon={Icon}
                          color={t.accentColor}
                          size="sm"
                          index={idx}
                          delay={idx * 0.12}
                        />
                      </div>

                      {/* QR Thumbnail Preview */}
                      <div className="flex justify-center items-center py-5 my-2 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div
                          className="p-2.5 rounded-xl shadow-xs"
                          style={{ backgroundColor: t.customization.bgColor }}
                        >
                          <QRCodeCanvas
                            value={formatQRData(t.type, t.defaultData) || 'https://qrhub.app'}
                            size={100}
                            fgColor={t.customization.fgColor}
                            bgColor={t.customization.bgColor}
                            level={t.customization.ecc}
                            includeMargin={false}
                          />
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5 mt-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {t.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-medium">
                          {t.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Link */}
                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2 relative z-10">
                      <Link
                        to={`/templates/${t.slug}`}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        View Details
                      </Link>

                      <Button
                        size="sm"
                        onClick={() => navigate(`/generator?template=${t.slug}`)}
                        style={{
                          background: `linear-gradient(135deg, ${t.accentColor}, ${t.accentColor}dd)`,
                          boxShadow: `0 4px 14px ${t.accentColor}40`,
                        }}
                        className="h-8 px-3 rounded-xl text-xs font-bold text-white hover:brightness-110 shadow-xs flex items-center gap-1 transition-all"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
