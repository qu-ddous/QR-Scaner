import { useState, useRef } from 'react';
import { Palette, Sliders, ImagePlus, UploadCloud, X, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getContrastRatio } from '@/lib/contrastChecker';
import { PRESET_THEMES } from '@/hooks/useQRCodeGenerator';
import { LOGO_PRESETS } from '@/lib/logoPresets';
import { cn } from '@/lib/utils';

const ECC_LEVELS = [
  { value: 'L', label: 'Low (7%)', desc: 'Dense data, no logos' },
  { value: 'M', label: 'Medium (15%)', desc: 'Standard balance (Recommended)' },
  { value: 'Q', label: 'Quarter (25%)', desc: 'Good for small icons' },
  { value: 'H', label: 'High (30%)', desc: 'Maximum redundancy for logos' },
];

export default function CustomizationPanel({
  customization,
  onChange,
  onReset,
}) {
  const [activeTab, setActiveTab] = useState('design');
  const fileInputRef = useRef(null);

  const {
    fgColor = '#172033',
    bgColor = '#ffffff',
    size = 256,
    ecLevel = 'M',
    includeMargin = true,
    marginSize = 4,
    imageUrl = '',
    imageWidth = 44,
    imageHeight = 44,
  } = customization;

  const contrast = getContrastRatio(fgColor, bgColor);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange('imageUrl', reader.result);
      if (ecLevel === 'L' || ecLevel === 'M') {
        onChange('ecLevel', 'H'); // Auto-upgrade ECC for logo readability
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    onChange('imageUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Customization Studio</h4>
          <p className="text-xs text-slate-500">Fine-tune styling, palette & logos</p>
        </div>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl">
        {[
          { id: 'design', label: 'Design' },
          { id: 'colors', label: 'Colors' },
          { id: 'logo',   label: 'Logo' },
          { id: 'advanced', label: 'Adv.' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'py-1.5 px-2 rounded-lg text-xs font-bold transition-all',
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DESIGN TAB */}
      {activeTab === 'design' && (
        <div className="space-y-4">
          {/* Canvas Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Display Size</span>
              <span className="font-mono text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                {size}px
              </span>
            </div>
            <Slider
              value={[size]}
              min={128}
              max={512}
              step={16}
              onValueChange={([val]) => onChange('size', val)}
              className="py-1"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>128px</span>
              <span>256px</span>
              <span>512px</span>
            </div>
          </div>

          {/* Error Correction Level */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Error Correction (ECC)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {ECC_LEVELS.map((ecc) => {
                const isSelected = ecLevel === ecc.value;
                return (
                  <button
                    key={ecc.value}
                    type="button"
                    onClick={() => onChange('ecLevel', ecc.value)}
                    className={cn(
                      'p-2.5 rounded-xl border text-left transition-all',
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300'
                    )}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {ecc.label}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      {ecc.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* COLORS TAB */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          {/* Preset Themes */}
          <div>
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Curated Palettes
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_THEMES.map((theme) => {
                const isSelected = fgColor === theme.fgColor && bgColor === theme.bgColor;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      onChange('fgColor', theme.fgColor);
                      onChange('bgColor', theme.bgColor);
                    }}
                    className={cn(
                      'flex items-center gap-2 p-2 rounded-xl border text-left transition-all',
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-400/40 bg-blue-50/40 dark:bg-blue-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    )}
                  >
                    <div className="flex -space-x-1">
                      <span
                        className="h-4 w-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: theme.fgColor }}
                      />
                      <span
                        className="h-4 w-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: theme.bgColor }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Foreground */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Foreground (Modules)
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => onChange('fgColor', e.target.value)}
                  className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => onChange('fgColor', e.target.value)}
                  className="w-full h-9 px-2 text-xs font-mono font-medium uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Background */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Background
              </Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => onChange('bgColor', e.target.value)}
                  className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent p-0.5"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => onChange('bgColor', e.target.value)}
                  className="w-full h-9 px-2 text-xs font-mono font-medium uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Contrast Health Indicator */}
          <div
            className={cn(
              'flex items-center gap-2.5 p-3 rounded-xl border text-xs',
              contrast.score === 'good'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : contrast.score === 'fair'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            )}
          >
            {contrast.score === 'good' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            )}
            <div className="flex-1 leading-tight">
              <div className="font-bold">{contrast.label}</div>
              <div className="text-[10px] opacity-80">
                Contrast Ratio: {contrast.ratio}:1 (Minimum recommended: 4.5:1)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGO TAB */}
      {activeTab === 'logo' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/svg+xml"
            className="hidden"
          />

          {/* Popular 1-Click Logo Presets */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Popular Presets (1-Click)
            </Label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {LOGO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    onChange('imageUrl', preset.dataUrl);
                    if (ecLevel === 'L' || ecLevel === 'M') {
                      onChange('ecLevel', 'H');
                    }
                  }}
                  title={preset.name}
                  className={cn(
                    'p-2 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-xs',
                    imageUrl === preset.dataUrl
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/30 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-700'
                  )}
                >
                  <img src={preset.dataUrl} alt={preset.name} className="h-6 w-6 object-contain" />
                  <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 mt-1 truncate max-w-full">
                    {preset.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-bold uppercase">Or Upload Custom</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {!imageUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div className="h-9 w-9 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 mb-1.5">
                <UploadCloud className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Drop custom logo here
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                PNG, JPG or SVG up to 2MB
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-2.5">
                  <img
                    src={imageUrl}
                    alt="Logo preview"
                    className="h-9 w-9 object-contain rounded-lg border border-slate-200 bg-white"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Brand Logo Loaded
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Auto-switched to High ECC
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Logo Size Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Logo Dimension</span>
                  <span className="font-mono text-blue-600">{imageWidth}px</span>
                </div>
                <Slider
                  value={[imageWidth]}
                  min={24}
                  max={72}
                  step={4}
                  onValueChange={([val]) => {
                    onChange('imageWidth', val);
                    onChange('imageHeight', val);
                  }}
                />
                {imageWidth > 56 && (
                  <p className="text-[10px] text-amber-600 flex items-center gap-1 font-medium mt-1">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    Large logos cover more modules; test camera scanning before printing.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADVANCED TAB */}
      {activeTab === 'advanced' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Include Quiet Zone (Margin)
              </div>
              <div className="text-[10px] text-slate-500">
                Adds white border required by camera decoders
              </div>
            </div>
            <Switch
              checked={includeMargin}
              onCheckedChange={(val) => onChange('includeMargin', val)}
            />
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 leading-relaxed">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
              Client-Side Vector Engine
            </span>
            All QR matrices are computed mathematically in memory. SVG and PDF exports are rendered with vector paths that scale to any billboard size with zero distortion.
          </div>
        </div>
      )}
    </div>
  );
}
