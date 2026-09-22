import { useRef, useId } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * QRCodeGenerator — renders the live QR code preview.
 * Wraps qrcode.react with proper id anchors for the download system.
 * @param {string}  qrValue        - The QR payload string
 * @param {object}  customization  - Colour/size/ecLevel/margin/logo options
 * @param {string}  error          - Any format error to display instead
 * @param {boolean} useSvg         - Use SVG renderer (better for SVG export)
 */
export default function QRCodeGenerator({ qrValue, customization = {}, error, useSvg = false }) {
  const containerRef = useRef(null);
  const {
    fgColor       = '#1a1a2e',
    bgColor       = '#ffffff',
    size          = 256,
    ecLevel       = 'M',
    includeMargin = true,
    marginSize    = 4,
    imageUrl,
    imageWidth    = 40,
    imageHeight   = 40,
    imageExcavate = true,
  } = customization;

  const displaySize = Math.min(Math.max(size, 128), 512);
  const imageSettings = imageUrl
    ? { src: imageUrl, width: imageWidth, height: imageHeight, excavate: imageExcavate }
    : undefined;

  // Empty / error state
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl bg-red-50 border border-red-200 p-8 gap-3 text-center"
        style={{ width: displaySize, height: displaySize }}
      >
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <p className="text-sm text-red-600 font-medium leading-snug">{error}</p>
      </div>
    );
  }

  if (!qrValue) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 gap-3 text-center transition-all"
        style={{ width: displaySize, height: displaySize }}
      >
        <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-blue-500">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            Enter content above to generate QR code
          </p>
          <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-tight">
            Your live QR code will appear here as soon as you type or paste
          </p>
        </div>
      </div>
    );
  }

  const sharedProps = {
    value: qrValue,
    size: displaySize,
    fgColor,
    bgColor,
    level: ecLevel,
    includeMargin,
    marginSize,
    imageSettings,
  };

  return (
    <div
      id="qr-code-canvas"
      ref={containerRef}
      className={cn(
        'relative inline-flex rounded-2xl overflow-hidden',
        'shadow-soft-lg transition-shadow duration-300',
        'hover:shadow-soft-xl'
      )}
      style={{ background: bgColor }}
    >
      <QRCodeCanvas {...sharedProps} />
      <div style={{ display: 'none' }} aria-hidden="true">
        <QRCodeSVG {...sharedProps} />
      </div>
    </div>
  );
}
