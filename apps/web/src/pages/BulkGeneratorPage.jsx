import { useState, useRef, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import JSZip from 'jszip';
import {
  Layers, Upload, Download, Sparkles, Check, FileText,
  AlertCircle, RefreshCw, Palette, X, Copy, ExternalLink,
  Search, SlidersHorizontal, Grid3X3, List, Eye, Printer,
  FileSpreadsheet, Hash, ArrowRight, ShieldCheck, Zap,
  FolderArchive, Image as ImageIcon, Trash2, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Color themes curated for high-contrast scannability
const PRESET_COLOR_THEMES = [
  { id: 'onyx', name: 'Onyx Black', fg: '#0f172a', bg: '#ffffff', preview: 'bg-slate-900 border-slate-700' },
  { id: 'indigo', name: 'Tech Indigo', fg: '#4338ca', bg: '#ffffff', preview: 'bg-indigo-600 border-indigo-500' },
  { id: 'ocean', name: 'Electric Ocean', fg: '#0284c7', bg: '#ffffff', preview: 'bg-sky-600 border-sky-500' },
  { id: 'emerald', name: 'Emerald Mint', fg: '#047857', bg: '#ffffff', preview: 'bg-emerald-600 border-emerald-500' },
  { id: 'sunset', name: 'Sunset Amber', fg: '#c2410c', bg: '#ffffff', preview: 'bg-orange-600 border-orange-500' },
  { id: 'purple', name: 'Royal Violet', fg: '#7c3aed', bg: '#ffffff', preview: 'bg-purple-600 border-purple-500' },
  { id: 'ruby', name: 'Crimson Ruby', fg: '#be123c', bg: '#ffffff', preview: 'bg-rose-600 border-rose-500' },
  { id: 'cyber', name: 'Cyber Dark', fg: '#38bdf8', bg: '#0b1120', preview: 'bg-sky-400 border-slate-900' },
];

// 1-Click Samples
const SAMPLES = {
  products: [
    'https://store.example.com/p/wireless-headphones',
    'https://store.example.com/p/smart-watch-ultra',
    'https://store.example.com/p/mechanical-keyboard',
    'https://store.example.com/p/usb-c-charger-65w',
    'https://store.example.com/p/ergonomic-mouse',
    'https://store.example.com/p/laptop-stand-aluminum',
  ].join('\n'),
  restaurant: [
    'https://menu.example.com/dine-in?table=1',
    'https://menu.example.com/dine-in?table=2',
    'https://menu.example.com/dine-in?table=3',
    'https://menu.example.com/dine-in?table=4',
    'https://menu.example.com/dine-in?table=5',
    'https://menu.example.com/dine-in?table=6',
  ].join('\n'),
  events: [
    'https://conf.example.com/badge/ATTENDEE-101',
    'https://conf.example.com/badge/ATTENDEE-102',
    'https://conf.example.com/badge/ATTENDEE-103',
    'https://conf.example.com/badge/ATTENDEE-104',
    'https://conf.example.com/badge/SPEAKER-01',
    'https://conf.example.com/badge/VIP-01',
  ].join('\n'),
};

export default function BulkGeneratorPage() {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'range' | 'csv'
  const [inputText, setInputText] = useState(SAMPLES.restaurant);
  
  // Range generator state
  const [rangePrefix, setRangePrefix] = useState('https://example.com/table/');
  const [rangeStart, setRangeStart] = useState('1');
  const [rangeEnd, setRangeEnd] = useState('20');
  const [rangeSuffix, setRangeSuffix] = useState('?order=app');
  const [rangeFilePrefix, setRangeFilePrefix] = useState('Table-');

  // Design styles
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [ecLevel, setEcLevel] = useState('M');
  const [logoUrl, setLogoUrl] = useState('');
  const [itemSize, setItemSize] = useState(160);

  // Batch items
  const [generatedItems, setGeneratedItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  // View & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [previewItem, setPreviewItem] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Parsed lines count
  const parsedLines = useMemo(() => {
    return inputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  }, [inputText]);

  // Generate batch from manual text list
  const handleGenerateBatch = (customList = null) => {
    const list = customList || parsedLines;

    if (list.length === 0) {
      toast.error('Please enter at least one URL or text item.');
      return;
    }

    if (list.length > 200) {
      toast.error('Maximum 200 items per bulk generation batch for optimal browser performance.');
      return;
    }

    setIsProcessing(true);

    const items = list.map((val, idx) => {
      let label = `qr-code-${idx + 1}`;
      // Extract smart name from URL or text if possible
      try {
        if (val.startsWith('http')) {
          const u = new URL(val);
          const pathSegments = u.pathname.split('/').filter(Boolean);
          const lastSegment = pathSegments[pathSegments.length - 1];
          const queryParam = Array.from(u.searchParams.values())[0];
          if (queryParam) {
            label = `qr-${queryParam}`;
          } else if (lastSegment) {
            label = `qr-${lastSegment}`;
          }
        }
      } catch (_) {}

      return {
        id: `bulk-${Date.now()}-${idx}`,
        value: val,
        name: label,
        index: idx + 1,
      };
    });

    setGeneratedItems(items);
    setIsProcessing(false);
    toast.success(`Successfully generated ${items.length} vector QR codes!`);
  };

  // Generate sequential range
  const handleGenerateRange = (e) => {
    e?.preventDefault();
    const start = parseInt(rangeStart, 10);
    const end = parseInt(rangeEnd, 10);

    if (isNaN(start) || isNaN(end) || start > end) {
      toast.error('Please enter valid Start and End numbers (e.g. 1 to 20).');
      return;
    }

    const count = end - start + 1;
    if (count > 200) {
      toast.error('Maximum 200 items per batch. Please adjust the range.');
      return;
    }

    const generatedLines = [];
    for (let i = start; i <= end; i++) {
      generatedLines.push(`${rangePrefix.trim()}${i}${rangeSuffix.trim()}`);
    }

    setInputText(generatedLines.join('\n'));
    setActiveTab('list');

    const items = generatedLines.map((val, idx) => ({
      id: `bulk-range-${Date.now()}-${idx}`,
      value: val,
      name: `${rangeFilePrefix || 'item-'}${start + idx}`,
      index: idx + 1,
    }));

    setGeneratedItems(items);
    toast.success(`Generated sequential sequence of ${items.length} QR codes!`);
  };

  // Handle CSV file upload
  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const rows = content
          .split(/[\r\n]+/)
          .map((r) => r.split(',')[0].trim().replace(/^"|"$/g, ''))
          .filter((r) => r.length > 0);

        if (rows.length > 0) {
          const limited = rows.slice(0, 200);
          setInputText(limited.join('\n'));
          toast.success(`Loaded ${limited.length} entries from ${file.name}!`);
          setActiveTab('list');
        } else {
          toast.error('No valid rows found in CSV.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Handle custom logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error('Logo image must be under 1.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setLogoUrl(event.target.result);
        toast.success('Custom center logo applied to all QR codes!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Convert SVG element to PNG blob at high resolution
  const svgToPngBlob = (svgEl, size = 1024) => {
    return new Promise((resolve, reject) => {
      try {
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svgEl);
        const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            resolve(blob);
          }, 'image/png');
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to render SVG image'));
        };

        img.src = url;
      } catch (err) {
        reject(err);
      }
    });
  };

  // Download single SVG
  const downloadSingleSvg = (itemId, fileName) => {
    const svgEl = document.getElementById(`svg-${itemId}`);
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${fileName}.svg`);
  };

  // Download single PNG
  const downloadSinglePng = async (itemId, fileName) => {
    const svgEl = document.getElementById(`svg-${itemId}`);
    if (!svgEl) return;

    try {
      const blob = await svgToPngBlob(svgEl, 1024);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${fileName}.png (1024px)`);
    } catch (err) {
      toast.error('Failed to export PNG.');
    }
  };

  // Download complete batch as a ZIP archive
  const handleDownloadZip = async (format = 'svg') => {
    if (generatedItems.length === 0) return;

    setIsZipping(true);
    setZipProgress(5);
    const zip = new JSZip();
    const folderName = `qrhub-bulk-${format.toLowerCase()}`;
    const folder = zip.folder(folderName);

    // Add manifest CSV
    let manifestCsv = 'Filename,Target_URL_Or_Text,Index\n';
    generatedItems.forEach((item, i) => {
      manifestCsv += `"${item.name}.${format}","${item.value.replace(/"/g, '""')}",${i + 1}\n`;
    });
    folder.file('manifest.csv', manifestCsv);

    try {
      for (let i = 0; i < generatedItems.length; i++) {
        const item = generatedItems[i];
        const svgEl = document.getElementById(`svg-${item.id}`);

        if (svgEl) {
          if (format === 'svg') {
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(svgEl);
            folder.file(`${item.name}.svg`, source);
          } else {
            // PNG mode
            const pngBlob = await svgToPngBlob(svgEl, 1024);
            if (pngBlob) {
              const arrayBuffer = await pngBlob.arrayBuffer();
              folder.file(`${item.name}.png`, arrayBuffer);
            }
          }
        }

        setZipProgress(Math.round(((i + 1) / generatedItems.length) * 90));
      }

      const zipContent = await zip.generateAsync({ type: 'blob' }, (metadata) => {
        setZipProgress(90 + Math.round(metadata.percent / 10));
      });

      const url = URL.createObjectURL(zipContent);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrhub_batch_${generatedItems.length}_codes_${format}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`ZIP Archive created! Downloaded ${generatedItems.length} QR codes.`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate ZIP archive.');
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  // Filtered items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return generatedItems;
    const q = searchQuery.toLowerCase();
    return generatedItems.filter(
      (item) => item.name.toLowerCase().includes(q) || item.value.toLowerCase().includes(q)
    );
  }, [generatedItems, searchQuery]);

  return (
    <>
      <SEO
        title="Bulk QR Code Generator — Generate 200+ Vector QRs Free | QRHub"
        description="Mass generate professional vector QR codes from list, CSV, or sequential range. Free ZIP export, high-res PNG & SVG downloads."
        canonical="/bulk"
      />

      <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 py-10 md:py-16 text-slate-900 dark:text-slate-100 transition-colors">
        <div className="container-wide space-y-10">

          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Bulk & Batch QR Code Studio
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Generate hundreds of branded vector QR codes in seconds. Enter lists, import CSV tables, or generate numbered sequences with 1-click ZIP export.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Instant Client-Side</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FolderArchive className="h-4 w-4 text-blue-500" />
                <span>1-Click ZIP Download</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Printer className="h-4 w-4 text-emerald-500" />
                <span>Printable Sheet Layout</span>
              </span>
            </div>
          </div>

          {/* Main Workspace Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Col (7/12): Source Input & Generator Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

                {/* Input Method Selector Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <TabsList className="grid grid-cols-3 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl h-11">
                      <TabsTrigger value="list" className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Text List</span>
                      </TabsTrigger>
                      <TabsTrigger value="range" className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
                        <Hash className="h-3.5 w-3.5" />
                        <span>Sequence</span>
                      </TabsTrigger>
                      <TabsTrigger value="csv" className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
                        <FileSpreadsheet className="h-3.5 w-3.5" />
                        <span>CSV Import</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* 1-Click Samples Menu */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400">Sample:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setInputText(SAMPLES.restaurant);
                          setActiveTab('list');
                          toast.success('Loaded Restaurant Tables sample');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                      >
                        Tables
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInputText(SAMPLES.products);
                          setActiveTab('list');
                          toast.success('Loaded Products sample');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                      >
                        Products
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInputText(SAMPLES.events);
                          setActiveTab('list');
                          toast.success('Loaded Conference Badges sample');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                      >
                        Badges
                      </button>
                    </div>
                  </div>

                  {/* Tab 1: Manual List Input */}
                  <TabsContent value="list" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bulk-text" className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        Input Items (One URL or text string per line)
                      </Label>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {parsedLines.length} item{parsedLines.length !== 1 ? 's' : ''} detected
                      </span>
                    </div>

                    <textarea
                      id="bulk-text"
                      rows={9}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="https://example.com/item-1&#10;https://example.com/item-2&#10;https://example.com/item-3"
                      className="w-full font-mono text-xs p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-blue-600 leading-relaxed shadow-inner"
                    />
                  </TabsContent>

                  {/* Tab 2: Sequential Number Range Generator */}
                  <TabsContent value="range" className="space-y-4 pt-4">
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-2">
                      <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                        <span>Sequential Number Range Builder</span>
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Generate sequential QR codes for table stickers, product lots, tickets, or warehouse bins (e.g. Table 1 to 30).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">Base URL / Prefix</Label>
                        <Input
                          value={rangePrefix}
                          onChange={(e) => setRangePrefix(e.target.value)}
                          placeholder="https://example.com/table/"
                          className="rounded-xl h-10 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">URL Suffix (Optional)</Label>
                        <Input
                          value={rangeSuffix}
                          onChange={(e) => setRangeSuffix(e.target.value)}
                          placeholder="?ref=qr"
                          className="rounded-xl h-10 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">Start Number</Label>
                        <Input
                          type="number"
                          value={rangeStart}
                          onChange={(e) => setRangeStart(e.target.value)}
                          className="rounded-xl h-10 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">End Number</Label>
                        <Input
                          type="number"
                          value={rangeEnd}
                          onChange={(e) => setRangeEnd(e.target.value)}
                          className="rounded-xl h-10 text-xs"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleGenerateRange}
                      className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2"
                    >
                      <Hash className="h-4 w-4" />
                      <span>Generate Sequence ({Math.max(0, (parseInt(rangeEnd) || 0) - (parseInt(rangeStart) || 0) + 1)} Codes)</span>
                    </Button>
                  </TabsContent>

                  {/* Tab 3: CSV Import */}
                  <TabsContent value="csv" className="space-y-4 pt-4">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 text-center space-y-4 hover:border-blue-500 transition-colors bg-slate-50/50 dark:bg-slate-950/50">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Upload CSV or Text File
                        </h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Choose a .csv or .txt file. The first column will be extracted automatically (up to 200 rows).
                        </p>
                      </div>

                      <label className="inline-flex">
                        <input type="file" accept=".csv,.txt" className="sr-only" onChange={handleCSVUpload} />
                        <span className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all">
                          <Upload className="h-4 w-4" />
                          <span>Select CSV File</span>
                        </span>
                      </label>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Batch Action Button */}
                <Button
                  onClick={() => handleGenerateBatch()}
                  disabled={isProcessing || parsedLines.length === 0}
                  className="w-full h-13 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-blue-500/20 gap-2 transition-all hover:scale-[1.01]"
                >
                  <Sparkles className="h-4.5 w-4.5" />
                  <span>Generate All {parsedLines.length} QR Codes Now</span>
                </Button>
              </div>
            </div>

            {/* Right Col (5/12): Styling Suite & Batch Downloader */}
            <div className="lg:col-span-5 space-y-6">

              {/* Design Customizer Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Palette className="h-4 w-4 text-blue-600" />
                    <span>Batch Design Theme</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Applies to all
                  </span>
                </div>

                {/* Preset Color Themes */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Curated Color Presets
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_COLOR_THEMES.map((theme) => {
                      const isSelected = fgColor === theme.fg && bgColor === theme.bg;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => {
                            setFgColor(theme.fg);
                            setBgColor(theme.bg);
                          }}
                          className={cn(
                            'p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5',
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          )}
                        >
                          <div className={cn('w-5 h-5 rounded-full shadow-xs', theme.preview)} />
                          <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">
                            {theme.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Inputs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">QR Pattern Color</Label>
                    <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="h-7 w-7 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{fgColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Background Color</Label>
                    <div className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-7 w-7 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">{bgColor}</span>
                    </div>
                  </div>
                </div>

                {/* Error Correction & Custom Logo */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Error Correction</Label>
                    <select
                      value={ecLevel}
                      onChange={(e) => setEcLevel(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-800 dark:text-slate-200"
                    >
                      <option value="L">L — 7% Restoration</option>
                      <option value="M">M — 15% (Standard)</option>
                      <option value="Q">Q — 25% (Clean)</option>
                      <option value="H">H — 30% (High Resilience)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Brand Center Logo</Label>
                    <label className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer">
                      <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                      <span className="truncate">{logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleLogoUpload} />
                    </label>
                  </div>
                </div>

                {logoUrl && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 text-xs text-blue-700 dark:text-blue-300 border border-blue-200/60">
                    <span className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Logo active in all QRs
                    </span>
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="text-slate-400 hover:text-rose-600 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Master Download Actions (Active when batch is generated) */}
              {generatedItems.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                        <Check className="h-3 w-3" />
                        <span>Ready for Export</span>
                      </span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                        {generatedItems.length} QR Codes Ready
                      </h4>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPrintModal(true)}
                      className="rounded-xl text-xs font-bold gap-1.5 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                    >
                      <Printer className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                      <span>Print Sheet</span>
                    </Button>
                  </div>

                  {/* ZIP Progress Bar */}
                  {isZipping && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span>Packaging ZIP Archive...</span>
                        <span>{zipProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-200"
                          style={{ width: `${zipProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Export Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Button
                      onClick={() => handleDownloadZip('svg')}
                      disabled={isZipping}
                      className="h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-md shadow-emerald-600/20"
                    >
                      <FolderArchive className="h-4 w-4" />
                      <span>Download SVG ZIP</span>
                    </Button>

                    <Button
                      onClick={() => handleDownloadZip('png')}
                      disabled={isZipping}
                      className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2 shadow-md shadow-blue-600/20"
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span>Download PNG ZIP</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rendered Batch QR Codes Gallery */}
          {generatedItems.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              {/* Gallery Controls Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Generated Codes</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                      {filteredItems.length} of {generatedItems.length}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any card to inspect full high-resolution preview & export options
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative w-48 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="Filter codes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 pl-9 rounded-xl text-xs bg-white dark:bg-slate-900"
                    />
                  </div>

                  {/* Clear Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGeneratedItems([]);
                      toast.info('Cleared bulk generation batch.');
                    }}
                    className="h-9 rounded-xl text-xs font-bold gap-1 text-slate-500 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Clear All</span>
                  </Button>
                </div>
              </div>

              {/* Grid of Generated QR Codes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {filteredItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setPreviewItem(item)}
                    className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl p-4 flex flex-col justify-between space-y-3 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
                  >
                    {/* Index tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                        #{item.index}
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover:text-blue-600 font-semibold flex items-center gap-0.5">
                        <Eye className="h-3 w-3" /> Preview
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="aspect-square bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center p-3 border border-slate-100 dark:border-slate-800/80 overflow-hidden group-hover:scale-105 transition-transform">
                      <QRCodeSVG
                        id={`svg-${item.id}`}
                        value={item.value}
                        size={itemSize}
                        fgColor={fgColor}
                        bgColor={bgColor}
                        level={ecLevel}
                        imageSettings={
                          logoUrl
                            ? {
                                src: logoUrl,
                                height: 28,
                                width: 28,
                                excavate: true,
                              }
                            : undefined
                        }
                        className="w-full h-full max-w-[130px] max-h-[130px]"
                      />
                    </div>

                    {/* Meta & Download buttons */}
                    <div className="space-y-2">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 truncate" title={item.value}>
                        {item.value}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSingleSvg(item.id, item.name);
                          }}
                          className="h-7 text-[10px] font-bold p-0 rounded-lg bg-slate-100/70 dark:bg-slate-800/70 hover:bg-blue-50 text-slate-700 dark:text-slate-300 hover:text-blue-600"
                        >
                          SVG
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSinglePng(item.id, item.name);
                          }}
                          className="h-7 text-[10px] font-bold p-0 rounded-lg bg-slate-100/70 dark:bg-slate-800/70 hover:bg-blue-50 text-slate-700 dark:text-slate-300 hover:text-blue-600"
                        >
                          PNG
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Item Inspection Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
              {previewItem?.name}
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-slate-500 break-all">
              {previewItem?.value}
            </DialogDescription>
          </DialogHeader>

          {previewItem && (
            <div className="space-y-6 pt-2">
              <div className="aspect-square w-56 mx-auto bg-slate-50 dark:bg-slate-950 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-lg">
                <QRCodeSVG
                  value={previewItem.value}
                  size={200}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={ecLevel}
                  imageSettings={
                    logoUrl
                      ? {
                          src: logoUrl,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }
                      : undefined
                  }
                  className="w-full h-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => downloadSingleSvg(previewItem.id, previewItem.name)}
                  className="h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download SVG</span>
                </Button>

                <Button
                  onClick={() => downloadSinglePng(previewItem.id, previewItem.name)}
                  className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PNG (1024px)</span>
                </Button>
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewItem.value);
                    toast.success('URL copied to clipboard!');
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Payload Text</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Printable Sheet View Modal */}
      <Dialog open={showPrintModal} onOpenChange={setShowPrintModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
                  Print-Ready Label Sheet
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Ready to print onto sticker paper or cardstock ({generatedItems.length} codes)
                </DialogDescription>
              </div>

              <Button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2 rounded-xl"
              >
                <Printer className="h-4 w-4" />
                <span>Print Sheet (Ctrl+P)</span>
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-4 bg-white text-black border border-slate-200 rounded-2xl my-4">
            {generatedItems.map((item) => (
              <div key={`print-${item.id}`} className="border border-slate-300 rounded-xl p-3 text-center space-y-1.5">
                <div className="w-24 h-24 mx-auto flex items-center justify-center">
                  <QRCodeSVG
                    value={item.value}
                    size={90}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={ecLevel}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[11px] font-bold truncate text-slate-800">{item.name}</p>
                <p className="text-[9px] font-mono text-slate-500 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
