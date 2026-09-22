import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scan, Camera, Upload, Wifi, Contact, Globe, MessageCircle,
  Copy, CheckCircle2, AlertCircle, RefreshCw, ExternalLink,
  ArrowLeft, FileText, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import jsQR from 'jsqr';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

// Robust multi-pass QR decoder helper for image data
function decodeImageDataWithFallbacks(imageData, width, height) {
  const data = new Uint8ClampedArray(imageData.data);

  // Normalize transparent pixels to solid white background
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = 255;
    }
  }

  // Pass 1: standard jsQR with both normal and inverted attempt on normalized data
  let code = jsQR(data, width, height, { inversionAttempts: 'attemptBoth' });
  if (code && code.data) return code.data;

  // Pass 2: Grayscale & High-Contrast threshold
  const dataContrast = new Uint8ClampedArray(data);
  for (let i = 0; i < dataContrast.length; i += 4) {
    const avg = dataContrast[i] * 0.299 + dataContrast[i + 1] * 0.587 + dataContrast[i + 2] * 0.114;
    const val = avg > 128 ? 255 : 0;
    dataContrast[i] = val;
    dataContrast[i + 1] = val;
    dataContrast[i + 2] = val;
    dataContrast[i + 3] = 255;
  }
  code = jsQR(dataContrast, width, height, { inversionAttempts: 'attemptBoth' });
  if (code && code.data) return code.data;

  // Pass 3: Dark/dim adaptive threshold
  const dataDark = new Uint8ClampedArray(data);
  for (let i = 0; i < dataDark.length; i += 4) {
    const avg = dataDark[i] * 0.299 + dataDark[i + 1] * 0.587 + dataDark[i + 2] * 0.114;
    const val = avg > 80 ? 255 : 0;
    dataDark[i] = val;
    dataDark[i + 1] = val;
    dataDark[i + 2] = val;
    dataDark[i + 3] = 255;
  }
  code = jsQR(dataDark, width, height, { inversionAttempts: 'attemptBoth' });
  if (code && code.data) return code.data;

  return null;
}

export default function ScannerPage() {
  const [scanMode, setScanMode] = useState('upload'); // 'upload' | 'camera'
  const [scannedResult, setScannedResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Stop camera when leaving or switching modes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startCamera = async () => {
    setScannedResult(null);
    setScanMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        requestAnimationFrame(scanVideoFrame);
      }
    } catch (err) {
      console.error(err);
      toast.error('Unable to access camera. Please allow camera permissions or upload an image.');
      setScanMode('upload');
    }
  };

  const scanVideoFrame = async () => {
    if (!videoRef.current || !isScanning) return;

    // 1. Try native BarcodeDetector first
    if ('BarcodeDetector' in window) {
      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          handleScanSuccess(barcodes[0].rawValue);
          stopCamera();
          toast.success('QR Code detected & decoded successfully!');
          return;
        }
      } catch {}
    }

    // 2. Pure JS fallback with jsQR
    try {
      const video = videoRef.current;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
        }
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });
        if (code && code.data) {
          handleScanSuccess(code.data);
          stopCamera();
          toast.success('QR Code detected & decoded successfully!');
          return;
        }
      }
    } catch {}

    if (isScanning) {
      requestAnimationFrame(scanVideoFrame);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value to permit re-uploading the same file
    e.target.value = '';

    const toastId = toast.loading('Analyzing image for QR codes...');

    try {
      let imageBlob = file;
      const isSvg = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');

      if (isSvg) {
        try {
          const svgText = await file.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(svgText, 'image/svg+xml');
          const svgEl = doc.documentElement;

          if (svgEl && svgEl.nodeName.toLowerCase() === 'svg') {
            const currentW = svgEl.getAttribute('width');
            const currentH = svgEl.getAttribute('height');
            const viewBox = svgEl.getAttribute('viewBox');

            // Force high-res vector dimensions for crisp rasterization
            svgEl.setAttribute('width', '1024');
            svgEl.setAttribute('height', '1024');

            if (!viewBox && currentW && currentH) {
              svgEl.setAttribute('viewBox', `0 0 ${parseFloat(currentW)} ${parseFloat(currentH)}`);
            }

            // Guarantee a solid white background rect
            const bgRect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bgRect.setAttribute('width', '100%');
            bgRect.setAttribute('height', '100%');
            bgRect.setAttribute('fill', '#ffffff');
            svgEl.insertBefore(bgRect, svgEl.firstChild);

            const serialized = new XMLSerializer().serializeToString(doc.documentElement);
            imageBlob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
          }
        } catch (svgErr) {
          console.warn('SVG preprocessing fallback:', svgErr);
        }
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(imageBlob);
      img.src = objectUrl;

      img.onload = async () => {
        try {
          const width = img.naturalWidth || img.width || 800;
          const height = img.naturalHeight || img.height || 800;

          // Pass 1: Try native BarcodeDetector if available
          if ('BarcodeDetector' in window) {
            try {
              const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
              const barcodes = await detector.detect(img);
              if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                toast.dismiss(toastId);
                handleScanSuccess(barcodes[0].rawValue);
                toast.success('QR Code detected & decoded successfully!');
                return;
              }
            } catch (detErr) {
              console.warn('BarcodeDetector native pass failed, continuing to jsQR...', detErr);
            }
          }

          // Pass 2: Draw to Canvas with WHITE background fill and run jsQR
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, width, height);
          let decoded = decodeImageDataWithFallbacks(imageData, width, height);

          if (decoded) {
            toast.dismiss(toastId);
            handleScanSuccess(decoded);
            toast.success('QR Code detected & decoded successfully!');
            return;
          }

          // Pass 3: Downsampled pass (for huge mobile camera photos, e.g. 4000x3000)
          if (width > 1200 || height > 1200) {
            const maxDim = 1000;
            const scale = maxDim / Math.max(width, height);
            const scaledW = Math.round(width * scale);
            const scaledH = Math.round(height * scale);
            canvas.width = scaledW;
            canvas.height = scaledH;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, scaledW, scaledH);
            ctx.drawImage(img, 0, 0, scaledW, scaledH);
            const scaledData = ctx.getImageData(0, 0, scaledW, scaledH);
            decoded = decodeImageDataWithFallbacks(scaledData, scaledW, scaledH);
            if (decoded) {
              toast.dismiss(toastId);
              handleScanSuccess(decoded);
              toast.success('QR Code detected & decoded successfully!');
              return;
            }
          }

          // Pass 4: Center crop pass (common for photos where QR code is in the center)
          if (width > 300 && height > 300) {
            const cropW = Math.round(width * 0.75);
            const cropH = Math.round(height * 0.75);
            const cropX = Math.round((width - cropW) / 2);
            const cropY = Math.round((height - cropH) / 2);
            canvas.width = cropW;
            canvas.height = cropH;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, cropW, cropH);
            ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
            const cropData = ctx.getImageData(0, 0, cropW, cropH);
            decoded = decodeImageDataWithFallbacks(cropData, cropW, cropH);
            if (decoded) {
              toast.dismiss(toastId);
              handleScanSuccess(decoded);
              toast.success('QR Code detected & decoded successfully!');
              return;
            }
          }

          toast.dismiss(toastId);
          toast.error('Could not detect QR code in this image. Please ensure the QR code is clearly visible and well-lit.');
        } catch (err) {
          console.error('Error in QR decoding:', err);
          toast.dismiss(toastId);
          toast.error('Could not process this image. Please upload a clear QR code image.');
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };

      img.onerror = () => {
        toast.dismiss(toastId);
        toast.error('Could not load this image file. Please upload a valid PNG, JPG, SVG, or WebP.');
        URL.revokeObjectURL(objectUrl);
      };
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      toast.error('Failed to read uploaded file.');
    }
  };

  const handleScanSuccess = (rawPayload) => {
    if (!rawPayload) return;

    let type = 'text';

    if (rawPayload.startsWith('WIFI:')) {
      type = 'wifi';
    } else if (rawPayload.startsWith('BEGIN:VCARD')) {
      type = 'vcard';
    } else if (rawPayload.startsWith('https://wa.me/')) {
      type = 'whatsapp';
    } else if (rawPayload.startsWith('http://') || rawPayload.startsWith('https://')) {
      type = 'url';
    }

    setScannedResult({
      payload: rawPayload,
      type,
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title="In-App QR Code Scanner & Reader — QRHub"
        description="Scan and decode QR codes instantly using your device camera or image upload. Fast, private client-side decoding."
        canonical="/scanner"
      />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2 pt-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Scan & Decode QR Codes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Scan with your webcam/camera or upload any QR code image to inspect its content and links safely.
            </p>
          </div>

          {/* Scanner Card */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
            {/* Mode Switch */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setScanMode('upload');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  scanMode === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload QR Image</span>
              </button>

              <button
                type="button"
                onClick={startCamera}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  scanMode === 'camera'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Live Camera</span>
              </button>
            </div>

            {/* Camera View */}
            {scanMode === 'camera' && (
              <div className="space-y-4">
                <div className="relative aspect-square max-w-sm mx-auto overflow-hidden rounded-2xl bg-black flex items-center justify-center border-2 border-blue-500/50 shadow-inner">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-blue-400/40 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-dashed border-white/80 rounded-2xl animate-pulse" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopCamera}
                    className="rounded-xl text-xs font-bold gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Stop Camera</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Upload View */}
            {scanMode === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Click to select QR Code photo
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Supports PNG, JPG, WEBP, GIF, SVG
                  </span>
                </button>
              </div>
            )}

            {/* Decoded Content Card */}
            {scannedResult && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {scannedResult.type === 'wifi' && <Wifi className="h-3.5 w-3.5" />}
                    {scannedResult.type === 'vcard' && <Contact className="h-3.5 w-3.5" />}
                    {scannedResult.type === 'whatsapp' && <MessageCircle className="h-3.5 w-3.5" />}
                    {scannedResult.type === 'url' && <Globe className="h-3.5 w-3.5" />}
                    {scannedResult.type === 'text' && <FileText className="h-3.5 w-3.5" />}
                    <span>{scannedResult.type} Detected</span>
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(scannedResult.payload)}
                    className="h-8 text-xs font-semibold rounded-lg gap-1"
                  >
                    {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Payload'}</span>
                  </Button>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 break-all max-h-48 overflow-y-auto">
                  {scannedResult.payload}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  {scannedResult.type === 'url' && (
                    <a href={scannedResult.payload} target="_blank" rel="noreferrer" className="w-full sm:flex-1">
                      <Button className="w-full font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 gap-1.5 shadow-md">
                        <ExternalLink className="h-4 w-4" />
                        <span>Visit Website Link</span>
                      </Button>
                    </a>
                  )}
                  <Link
                    to={`/generator?prefill=${encodeURIComponent(scannedResult.payload)}`}
                    className="w-full sm:flex-1"
                  >
                    <Button
                      variant={scannedResult.type === 'url' ? 'outline' : 'default'}
                      className={`w-full font-bold text-xs rounded-xl h-10 gap-1.5 ${
                        scannedResult.type !== 'url' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : ''
                      }`}
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Open & Customize in Studio</span>
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
