import { useState } from 'react';
import { Download, Copy, Share2, Check, Loader2, Sparkles, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { downloadQRCode, copyToClipboard } from '@/lib/downloadQRCode';
import { saveToHistory } from '@/lib/qrHistory';
import PrintModal from '@/components/PrintModal';
import { cn } from '@/lib/utils';

const FORMATS = [
  { id: 'png',  label: 'PNG',  badge: 'Raster',  color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' },
  { id: 'jpg',  label: 'JPG',  badge: 'Web',     color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
  { id: 'svg',  label: 'SVG',  badge: 'Vector',  color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' },
  { id: 'webp', label: 'WebP', badge: 'Modern',  color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  { id: 'pdf',  label: 'PDF',  badge: 'Print',   color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
];

const RESOLUTIONS = [
  { label: '1x (Standard)', value: 512,  hint: 'Digital sharing' },
  { label: '2x (High-Res)', value: 1024, hint: 'Retina & Small Print' },
  { label: '4x (Ultra HD)', value: 2048, hint: 'Commercial & Posters' },
];

export default function DownloadManager({
  isReady,
  filename = 'qrhub-code',
  setFilename,
  qrType = 'url',
  payload = '',
  customization = {},
}) {
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState(1024);
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  async function handleDownload() {
    if (!isReady || downloading) return;
    setDownloading(true);
    try {
      await downloadQRCode(format, filename, size);
      // Save to local history
      saveToHistory({
        type: qrType,
        payload,
        title: `${filename} (${format.toUpperCase()})`,
        fgColor: customization.fgColor,
        bgColor: customization.bgColor,
        size,
        ecc: customization.ecLevel,
      });

      toast.success(`QR downloaded as ${format.toUpperCase()}!`, {
        description: `Exported at ${size}px · ${filename}.${format}`,
      });
    } catch (err) {
      toast.error('Download failed', { description: err.message });
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopy() {
    if (!isReady || copying) return;
    setCopying(true);
    try {
      await copyToClipboard(size);
      setCopied(true);
      saveToHistory({
        type: qrType,
        payload,
        title: `${filename} (Copied)`,
        fgColor: customization.fgColor,
        bgColor: customization.bgColor,
        size,
        ecc: customization.ecLevel,
      });
      toast.success('QR Code image copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      toast.error('Copy failed', { description: err.message || 'Clipboard permission denied.' });
    } finally {
      setCopying(false);
    }
  }

  async function handleShare() {
    if (!isReady) return;
    if (!navigator.share) {
      toast.info('Direct sharing unavailable', { description: 'Please download the QR code image to share.' });
      return;
    }
    try {
      const canvas = document.querySelector('#qr-code-canvas canvas');
      if (!canvas) throw new Error('QR canvas not ready');
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      const file = new File([blob], `${filename}.png`, { type: 'image/png' });
      await navigator.share({
        title: 'Generated QR Code',
        text: `QR code for ${qrType.toUpperCase()}`,
        files: [file],
      });
      // Save shared QR code to local device history
      saveToHistory({
        type: qrType,
        payload,
        title: `${filename} (Shared)`,
        fgColor: customization.fgColor,
        bgColor: customization.bgColor,
        size,
        ecc: customization.ecLevel,
      });
      toast.success('Shared successfully & saved to history!');
    } catch (e) {
      if (e.name !== 'AbortError') {
        toast.error('Sharing failed', { description: e.message });
      }
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Export QR Code</span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
              Client-side
            </span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Choose file format & resolution</p>
        </div>
      </div>

      {/* Format Selection Chips */}
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
          Format
        </label>
        <div className="grid grid-cols-5 gap-2">
          {FORMATS.map((f) => {
            const isSelected = format === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormat(f.id)}
                className={cn(
                  'flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border text-xs font-bold transition-all',
                  isSelected
                    ? `${f.color} ring-2 ring-blue-500 shadow-sm scale-102`
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <span>{f.label}</span>
                <span className="text-[9px] font-medium opacity-75 mt-0.5">{f.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resolution Selector */}
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
          Resolution / Density
        </label>
        <div className="grid grid-cols-3 gap-2">
          {RESOLUTIONS.map((r) => {
            const isSelected = size === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setSize(r.value)}
                className={cn(
                  'py-2 px-2 rounded-xl border text-left transition-all',
                  isSelected
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                )}
              >
                <div className="text-xs font-bold">{r.label}</div>
                <div className="text-[10px] text-slate-500">{r.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Filename */}
      {setFilename && (
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
            File Name
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
              placeholder="qrhub-code"
              className="w-full h-10 px-3 pr-14 text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <span className="absolute right-3 text-xs font-bold text-slate-400">
              .{format}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-1 flex flex-col gap-2.5">
        <Button
          onClick={handleDownload}
          disabled={!isReady || downloading}
          className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {downloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Rendering {format.toUpperCase()}...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Download {format.toUpperCase()}</span>
            </>
          )}
        </Button>

        <div className="grid grid-cols-3 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            disabled={!isReady || copying}
            className="h-10 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : copying ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Copying...</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const canvas = document.querySelector('#qr-code-canvas canvas');
              if (canvas) {
                setQrDataUrl(canvas.toDataURL());
                setIsPrintOpen(true);
              } else {
                toast.error('QR Canvas not ready');
              }
            }}
            disabled={!isReady}
            className="h-10 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5"
            title="Open printable formats (Table Tents, Business Cards, Stickers)"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleShare}
            disabled={!isReady}
            className="h-10 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs rounded-xl flex items-center justify-center gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>
        </div>

        <PrintModal
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          qrDataUrl={qrDataUrl}
          qrValue={payload}
          title={filename}
        />
      </div>
    </div>
  );
}
