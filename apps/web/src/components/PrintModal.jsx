import { useState } from 'react';
import { Printer, X, Layout, CreditCard, Grid, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrintModal({ isOpen, onClose, qrDataUrl, qrValue, title = 'Scan Me' }) {
  const [template, setTemplate] = useState('table-tent'); // 'table-tent' | 'business-card' | 'sticker-grid'
  const [headline, setHeadline] = useState('SCAN WITH CAMERA');
  const [subtext, setSubtext] = useState('Point your smartphone camera here to view content instantly.');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 my-8 print:shadow-none print:border-none print:p-0 print:max-w-none print:w-full">

        {/* Modal Header (Hidden during Print) */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Print-Ready Layout Presets</h2>
              <p className="text-xs text-slate-500">Select standard print formats for restaurants, events, or packaging.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Template Selector & Options (Hidden during Print) */}
        <div className="space-y-4 print:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'table-tent', label: 'Table Tent / Menu', icon: Layout, desc: 'Foldable stand for tables & counters' },
              { id: 'business-card', label: 'Business Card', icon: CreditCard, desc: 'Standard 3.5" x 2" networking card' },
              { id: 'sticker-grid', label: 'Sticker Grid (12-Up)', icon: Grid, desc: 'A4 sheet with 12 scannable labels' },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = template === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {isActive && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{t.label}</span>
                  <span className="text-xs text-slate-500 mt-0.5">{t.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Print Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-blue-600"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Subtitle / Instruction</label>
              <input
                type="text"
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Printable Canvas Area */}
        <div className="bg-slate-100 dark:bg-slate-950 rounded-2xl p-6 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 print:bg-white print:border-none print:p-0 print:m-0">

          {/* 1. Table Tent Format */}
          {template === 'table-tent' && (
            <div className="bg-white text-slate-900 w-[340px] rounded-2xl shadow-xl p-8 text-center space-y-5 border border-slate-200 print:w-full print:max-w-md print:shadow-none print:border-2 print:border-slate-900 print:mx-auto">
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                Table Display
              </div>
              <h3 className="text-2xl font-black text-slate-950 tracking-tight uppercase">
                {headline || 'SCAN TO VIEW'}
              </h3>
              <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-xs inline-block">
                <img src={qrDataUrl} alt="Print QR" className="w-48 h-48 mx-auto" />
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-[240px] mx-auto">
                {subtext}
              </p>
              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                Powered by QRHub • High-Contrast Vector
              </div>
            </div>
          )}

          {/* 2. Business Card Format */}
          {template === 'business-card' && (
            <div className="bg-white text-slate-900 w-[380px] h-[215px] rounded-xl shadow-xl p-6 flex items-center justify-between gap-4 border border-slate-200 print:shadow-none print:border-2 print:border-slate-900 print:mx-auto">
              <div className="space-y-2 flex-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Direct Access</span>
                <h4 className="text-lg font-black text-slate-950 tracking-tight leading-snug">{headline}</h4>
                <p className="text-[11px] text-slate-600 leading-tight line-clamp-3">{subtext}</p>
                <div className="text-[9px] text-slate-400 font-mono pt-1">QRHub Print Preset</div>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                <img src={qrDataUrl} alt="Print QR" className="w-28 h-28" />
              </div>
            </div>
          )}

          {/* 3. Sticker Grid (12-up) */}
          {template === 'sticker-grid' && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xl max-w-[440px] print:max-w-none print:grid-cols-3 print:gap-6 print:border-none print:shadow-none">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="p-2 border border-dashed border-slate-300 rounded-xl text-center space-y-1 bg-white">
                  <img src={qrDataUrl} alt="Sticker" className="w-16 h-16 mx-auto" />
                  <span className="text-[9px] font-bold text-slate-700 block truncate">{headline}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Actions (Hidden during Print) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 print:hidden">
          <span className="text-xs text-slate-500">Tips: Use 100% scale in browser print settings.</span>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl gap-2 px-6">
              <Printer className="h-4 w-4" />
              Print Now
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
