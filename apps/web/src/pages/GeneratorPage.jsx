import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Type, Mail, Phone, MessageSquareText, MessageCircle, Wifi,
  Contact, Crosshair, MapPin, Calendar, Share2, Smartphone,
  Briefcase, Coins, Search, CheckCircle2, AlertTriangle, ExternalLink,
  Copy, RotateCcw, ShieldCheck, Sparkles, SlidersHorizontal, Eye,
  X, Trash2, Lock, KeyRound
} from 'lucide-react';
import { toast } from 'sonner';

import { encodeMessagePayload } from '@/lib/messageCrypto';

import { useQRCodeGenerator, QR_TYPES } from '@/hooks/useQRCodeGenerator';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import CustomizationPanel from '@/components/CustomizationPanel';
import DownloadManager from '@/components/DownloadManager';
import { getContrastRatio } from '@/lib/contrastChecker';
import { saveToHistory } from '@/lib/qrHistory';
import { TEMPLATES } from '@/lib/templatesData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import ShinyAnimatedIconBox from '@/components/ShinyAnimatedIconBox';
import SEO from '@/components/SEO';
import { cn } from '@/lib/utils';

const TYPE_ICONS = {
  url: Globe,
  text: Type,
  email: Mail,
  phone: Phone,
  sms: MessageSquareText,
  whatsapp: MessageCircle,
  wifi: Wifi,
  vcard: Contact,
  location: Crosshair,
  maps: MapPin,
  event: Calendar,
  social: Share2,
  app_download: Smartphone,
  business_card: Briefcase,
  crypto: Coins,
};

function Field({ label, id, children, hint, required }) {
  return (
    <div className="space-y-1.5 min-w-0 max-w-full">
      <div className="flex items-center justify-between min-w-0">
        <Label htmlFor={id} className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
          {label} {required && <span className="text-rose-500">*</span>}
        </Label>
      </div>
      <div className="min-w-0 max-w-full">
        {children}
      </div>
      {hint && <p className="text-[11px] text-slate-500 leading-tight break-words">{hint}</p>}
    </div>
  );
}

function TextQRForm({ formData, onChange }) {
  const [encoding, setEncoding] = useState(false);

  const text = formData.text || '';
  const title = formData.title || '';
  const isProtected = !!formData.isProtected;
  const password = formData.password || '';

  // Automatically compute and update encoded URL for Note or Secret viewer
  useEffect(() => {
    if (!text.trim()) {
      onChange('formattedUrl', '');
      return;
    }

    let isMounted = true;
    setEncoding(true);

    const hasPassword = isProtected && password.trim();

    encodeMessagePayload({ text, title }, hasPassword ? password : '')
      .then((payloadHash) => {
        if (isMounted) {
          const baseUrl = window.location.origin || '';
          // Separate pages: /secret for password protected, /note for simple
          const targetPath = hasPassword ? '/secret' : '/note';
          const fullUrl = `${baseUrl}${targetPath}#data=${payloadHash}`;
          onChange('formattedUrl', fullUrl);
        }
      })
      .catch((err) => {
        console.error('Error encoding message:', err);
      })
      .finally(() => {
        if (isMounted) setEncoding(false);
      });

    return () => {
      isMounted = false;
    };
  }, [text, title, isProtected, password]);

  return (
    <div className="space-y-4">
      {/* Note Title (Optional) */}
      <Field label="Note Title (Optional)" id="title" hint="Give your note a headline displayed when scanned.">
        <Input
          id="title"
          placeholder="e.g., Wi-Fi Instructions, Meeting Notes..."
          value={title}
          onChange={(e) => onChange('title', e.target.value)}
          className="h-11 rounded-xl text-sm"
        />
      </Field>

      {/* Main Text Content */}
      <Field
        label="Message / Note Content"
        id="text"
        required
        hint="When scanned, this message opens directly on your QRHub web page."
      >
        <Textarea
          id="text"
          rows={4}
          placeholder="Type or paste your message or notes here..."
          value={text}
          onChange={(e) => onChange('text', e.target.value)}
          className="rounded-xl text-sm"
        />
      </Field>

      {/* Passcode / Password Protection Toggle */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              isProtected
                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                : "bg-slate-200/60 dark:bg-slate-800 text-slate-500"
            )}>
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <Label htmlFor="protect-switch" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                Lock with Passcode / Password
              </Label>
              <p className="text-[11px] text-slate-500 leading-tight">
                Require a password to read this note on the Secret Vault page.
              </p>
            </div>
          </div>
          <Switch
            id="protect-switch"
            checked={isProtected}
            onCheckedChange={(checked) => onChange('isProtected', checked)}
          />
        </div>

        <AnimatePresence>
          {isProtected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 space-y-2 overflow-hidden"
            >
              <Field label="Secret Passcode / Password" id="pwd" required hint="Anyone scanning this QR code must enter this password to view the message.">
                <Input
                  id="pwd"
                  type="password"
                  placeholder="Set secret password or PIN..."
                  value={password}
                  onChange={(e) => onChange('password', e.target.value)}
                  className="h-10 rounded-xl text-xs font-semibold"
                />
              </Field>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Zero-knowledge client encryption. Decrypted on the recipient device.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{text.length} characters</span>
        <span className={cn(
          "font-semibold",
          isProtected && password.trim() ? "text-amber-600 dark:text-amber-400" : "text-blue-600 dark:text-blue-400"
        )}>
          {encoding
            ? 'Generating...'
            : isProtected && password.trim()
            ? '🔒 Secret Note (/secret)'
            : '✓ Web Note (/note)'}
        </span>
      </div>
    </div>
  );
}

function QRForm({ type, formData, onChange }) {
  const f = (field) => (e) => onChange(field, e?.target?.value ?? e);

  switch (type) {
    case 'url':
      return (
        <Field label="Website URL" id="url" hint="Tip: Protocol (https://) is automatically normalized." required>
          <Input
            id="url"
            type="url"
            placeholder="https://yourdomain.com"
            value={formData.url || ''}
            onChange={(e) => {
              let val = e.target.value;
              onChange('url', val);
            }}
            className="h-11 rounded-xl text-sm"
          />
        </Field>
      );

    case 'text':
      return <TextQRForm formData={formData} onChange={onChange} />;

    case 'email':
      return (
        <div className="space-y-3">
          <Field label="Recipient Email" id="email" required>
            <Input id="email" type="email" placeholder="contact@example.com" value={formData.email || ''} onChange={f('email')} className="h-11 rounded-xl" />
          </Field>
          <Field label="Subject Line" id="subject">
            <Input id="subject" placeholder="Inquiry about..." value={formData.subject || ''} onChange={f('subject')} className="h-11 rounded-xl" />
          </Field>
          <Field label="Body Message" id="body">
            <Textarea id="body" rows={3} placeholder="Pre-filled email body..." value={formData.body || ''} onChange={f('body')} className="rounded-xl" />
          </Field>
        </div>
      );

    case 'phone':
      return (
        <Field label="Telephone Number" id="phone" hint="Include country code (e.g. +1 555 123 4567)" required>
          <Input id="phone" type="tel" placeholder="+1 555 019 2834" value={formData.phone || ''} onChange={f('phone')} className="h-11 rounded-xl" />
        </Field>
      );

    case 'sms':
      return (
        <div className="space-y-3">
          <Field label="Recipient Number" id="smsPhone" required>
            <Input id="smsPhone" type="tel" placeholder="+1 555 019 2834" value={formData.phone || ''} onChange={f('phone')} className="h-11 rounded-xl" />
          </Field>
          <Field label="Pre-filled Message" id="smsMsg">
            <Textarea id="smsMsg" rows={3} placeholder="I want to subscribe to updates..." value={formData.message || ''} onChange={f('message')} className="rounded-xl" />
          </Field>
        </div>
      );

    case 'whatsapp':
      return (
        <div className="space-y-3">
          <Field label="WhatsApp Number" id="waPhone" hint="International format with country code, no symbols (e.g. 15551234567)" required>
            <Input id="waPhone" type="tel" placeholder="15550192834" value={formData.phone || ''} onChange={f('phone')} className="h-11 rounded-xl" />
          </Field>
          <Field label="Greeting Message" id="waMsg" hint="Pre-populated greeting message when customer taps send.">
            <Textarea id="waMsg" rows={3} placeholder="Hello! I would like to learn more about your services." value={formData.message || ''} onChange={f('message')} className="rounded-xl" />
          </Field>
        </div>
      );

    case 'wifi':
      return (
        <div className="space-y-3">
          <Field label="Network Name (SSID)" id="ssid" required>
            <Input id="ssid" placeholder="Guest-WiFi" value={formData.ssid || ''} onChange={f('ssid')} className="h-11 rounded-xl" />
          </Field>
          <Field label="Network Password" id="wifiPassword">
            <Input id="wifiPassword" type="text" placeholder="Passphrase" value={formData.password || ''} onChange={f('password')} className="h-11 rounded-xl" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Encryption Type" id="wifiEnc">
              <Select value={formData.encryption || 'WPA'} onValueChange={(val) => onChange('encryption', val)}>
                <SelectTrigger id="wifiEnc" className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
                  <SelectItem value="WEP">WEP</SelectItem>
                  <SelectItem value="nopass">None (Open Network)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 mt-6">
              <Label htmlFor="wifiHidden" className="text-xs font-semibold cursor-pointer">Hidden Network</Label>
              <Switch id="wifiHidden" checked={formData.hidden || false} onCheckedChange={(val) => onChange('hidden', val)} />
            </div>
          </div>
        </div>
      );

    case 'vcard':
      return (
        <div className="space-y-3 min-w-0 max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 max-w-full">
            <Field label="First Name" id="firstName" required>
              <Input id="firstName" placeholder="Alex" value={formData.firstName || ''} onChange={f('firstName')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
            <Field label="Last Name" id="lastName" required>
              <Input id="lastName" placeholder="Morgan" value={formData.lastName || ''} onChange={f('lastName')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 max-w-full">
            <Field label="Organization" id="org">
              <Input id="org" placeholder="Acme Corp" value={formData.organization || ''} onChange={f('organization')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
            <Field label="Job Title" id="title">
              <Input id="title" placeholder="Lead Designer" value={formData.title || ''} onChange={f('title')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 max-w-full">
            <Field label="Phone" id="vcardPhone">
              <Input id="vcardPhone" type="tel" placeholder="+1 555-019-2834" value={formData.phone || ''} onChange={f('phone')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
            <Field label="Email" id="vcardEmail">
              <Input id="vcardEmail" type="email" placeholder="alex@acme.com" value={formData.email || ''} onChange={f('email')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
          </div>
          <Field label="Website / Portfolio" id="vcardWeb">
            <Input id="vcardWeb" type="url" placeholder="https://alexmorgan.design" value={formData.website || ''} onChange={f('website')} className="h-10 rounded-xl w-full min-w-0" />
          </Field>
          <Field label="Physical Address" id="vcardAddr">
            <Input id="vcardAddr" placeholder="100 Market St, San Francisco, CA" value={formData.address || ''} onChange={f('address')} className="h-10 rounded-xl w-full min-w-0" />
          </Field>
        </div>
      );

    case 'location':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude" id="lat" hint="e.g. 37.7749" required>
              <Input id="lat" placeholder="37.7749" value={formData.lat || ''} onChange={f('lat')} className="h-11 rounded-xl" />
            </Field>
            <Field label="Longitude" id="lng" hint="e.g. -122.4194" required>
              <Input id="lng" placeholder="-122.4194" value={formData.lng || ''} onChange={f('lng')} className="h-11 rounded-xl" />
            </Field>
          </div>
        </div>
      );

    case 'maps':
      return (
        <Field label="Location or Address Search" id="mapsQuery" hint="Enter street address, business name, or Google Maps share URL" required>
          <Input id="mapsQuery" placeholder="Empire State Building, New York, NY" value={formData.query || ''} onChange={f('query')} className="h-11 rounded-xl" />
        </Field>
      );

    case 'event':
      return (
        <div className="space-y-3">
          <Field label="Event Name" id="eventTitle" required>
            <Input id="eventTitle" placeholder="Product Launch 2026" value={formData.eventTitle || ''} onChange={f('eventTitle')} className="h-10 rounded-xl" />
          </Field>
          <Field label="Venue Location" id="eventLoc">
            <Input id="eventLoc" placeholder="Moscone Center, SF" value={formData.location || ''} onChange={f('location')} className="h-10 rounded-xl" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Time" id="startDate" required>
              <Input id="startDate" type="datetime-local" value={formData.startDate || ''} onChange={f('startDate')} className="h-10 rounded-xl" />
            </Field>
            <Field label="End Time" id="endDate" required>
              <Input id="endDate" type="datetime-local" value={formData.endDate || ''} onChange={f('endDate')} className="h-10 rounded-xl" />
            </Field>
          </div>
          <Field label="Event Description" id="eventDesc">
            <Textarea id="eventDesc" rows={2} placeholder="Keynote details..." value={formData.description || ''} onChange={f('description')} className="rounded-xl" />
          </Field>
        </div>
      );

    case 'social':
      return (
        <div className="space-y-3">
          <Field label="Platform" id="socialPlat" required>
            <Select value={formData.platform || 'instagram'} onValueChange={(val) => onChange('platform', val)}>
              <SelectTrigger id="socialPlat" className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter / X</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Profile Handle or Link" id="socialHandle" hint="e.g. username or full URL" required>
            <Input id="socialHandle" placeholder="username" value={formData.username || ''} onChange={f('username')} className="h-11 rounded-xl" />
          </Field>
        </div>
      );

    case 'app_download':
      return (
        <div className="space-y-3">
          <Field label="iOS App Store URL" id="iosUrl">
            <Input id="iosUrl" type="url" placeholder="https://apps.apple.com/app/id..." value={formData.appStoreUrl || ''} onChange={f('appStoreUrl')} className="h-10 rounded-xl" />
          </Field>
          <Field label="Google Play Store URL" id="playUrl">
            <Input id="playUrl" type="url" placeholder="https://play.google.com/store/apps/details?id=..." value={formData.playStoreUrl || ''} onChange={f('playStoreUrl')} className="h-10 rounded-xl" />
          </Field>
        </div>
      );

    case 'business_card':
      return (
        <div className="space-y-3 min-w-0 max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 max-w-full">
            <Field label="Full Name" id="bcName" required>
              <Input id="bcName" placeholder="Elena Rostova" value={formData.firstName || ''} onChange={f('firstName')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
            <Field label="Role / Title" id="bcTitle">
              <Input id="bcTitle" placeholder="Managing Director" value={formData.title || ''} onChange={f('title')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 max-w-full">
            <Field label="Organization" id="bcOrg">
              <Input id="bcOrg" placeholder="Apex Studio" value={formData.organization || ''} onChange={f('organization')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
            <Field label="Work Phone" id="bcPhone">
              <Input id="bcPhone" placeholder="+1 555-019-2834" value={formData.phone || ''} onChange={f('phone')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 max-w-full">
            <Field label="Work Email" id="bcEmail">
              <Input id="bcEmail" type="email" placeholder="elena@apexstudio.com" value={formData.email || ''} onChange={f('email')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
            <Field label="Website Link" id="bcWeb">
              <Input id="bcWeb" type="url" placeholder="https://apexstudio.com" value={formData.website || ''} onChange={f('website')} className="h-10 rounded-xl w-full min-w-0" />
            </Field>
          </div>
        </div>
      );

    case 'crypto':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cryptocurrency" id="coinType" required>
              <Select value={formData.currency || 'bitcoin'} onValueChange={(val) => onChange('currency', val)}>
                <SelectTrigger id="coinType" className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="solana">Solana (SOL)</SelectItem>
                  <SelectItem value="tether">Tether (USDT)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Amount (Optional)" id="cryptoAmt">
              <Input id="cryptoAmt" placeholder="0.05" value={formData.amount || ''} onChange={f('amount')} className="h-11 rounded-xl" />
            </Field>
          </div>
          <Field label="Public Wallet Address" id="cryptoAddr" required>
            <Input id="cryptoAddr" placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" value={formData.walletAddress || ''} onChange={f('walletAddress')} className="h-11 font-mono text-xs rounded-xl" />
          </Field>
        </div>
      );

    default:
      return null;
  }
}

export default function GeneratorPage() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'url';
  const templateSlug = searchParams.get('template');

  const {
    qrType,
    formData,
    customization,
    qrValue,
    error,
    filename,
    isReady,
    currentTypeInfo,
    handleTypeChange,
    handleFormChange,
    handleCustomizationChange,
    resetForm,
    setFilename,
    loadTemplate,
  } = useQRCodeGenerator(initialType);

  const [search, setSearch] = useState('');

  // Handle URL type parameter changes (e.g. ?type=wifi)
  const queryType = searchParams.get('type');
  useEffect(() => {
    if (queryType && QR_TYPES.some((t) => t.id === queryType)) {
      handleTypeChange(queryType);
    }
  }, [queryType, handleTypeChange]);

  // Handle template pre-filling if navigated from /templates/:slug
  useEffect(() => {
    if (templateSlug) {
      const template = TEMPLATES.find((t) => t.slug === templateSlug);
      if (template) {
        loadTemplate(template.type, template.defaultData, template.customization);
        toast.success(`Template loaded: ${template.title}`);
      }
    }
  }, [templateSlug, loadTemplate]);

  // Handle prefill parameter from URL or external link
  const prefill = searchParams.get('prefill');
  useEffect(() => {
    if (prefill) {
      if (prefill.startsWith('http://') || prefill.startsWith('https://')) {
        handleTypeChange('url');
        handleFormChange('url', prefill);
      } else {
        handleTypeChange('text');
        handleFormChange('text', prefill);
      }
      toast.success('Decoded content loaded into Studio!');
    }
  }, [prefill, handleTypeChange, handleFormChange]);

  const filteredTypes = useMemo(() => {
    if (!search.trim()) return QR_TYPES;
    const s = search.toLowerCase();
    return QR_TYPES.filter(
      (t) => t.label.toLowerCase().includes(s) || t.id.toLowerCase().includes(s) || t.desc.toLowerCase().includes(s)
    );
  }, [search]);

  const CurrentTypeIcon = TYPE_ICONS[qrType] || Globe;
  const contrast = getContrastRatio(customization.fgColor, customization.bgColor);

  const copyPayload = () => {
    if (!qrValue) return;
    navigator.clipboard.writeText(qrValue);
    toast.success('Payload string copied!');
  };

  return (
    <>
      <SEO
        title="QR Code Studio — Generate, Customize & Download Free QR Codes"
        description="Professional client-side QR Code Studio. Create custom QR codes for URLs, WiFi, contacts, email, WhatsApp, and events with full color control and vector export."
        canonical="/generator"
      />

      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-28 lg:pb-20 pt-3 sm:pt-6">
        {/* Sub-header title bar */}
        <div className="container-wide py-3 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4 sm:pb-6">
            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                QR Code Studio
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Create, customize and export professional QR codes in real-time.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link to="/history">
                <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold h-9 px-3">
                  <span>History</span>
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold h-9 px-3">
                  <span>Templates</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 h-9 px-2.5"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                <span>Reset</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 3-COLUMN WORKSTATION LAYOUT */}
        <div className="container-wide">
          {/* MOBILE ONLY (< lg): APP-STYLE HORIZONTAL TYPE SELECTOR CAROUSEL */}
          <div className="lg:hidden mb-4 space-y-2 w-full max-w-full overflow-hidden">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                1. Select QR Type
              </span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800">
                {currentTypeInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 no-scrollbar w-full max-w-full min-w-0">
              {QR_TYPES.map((t) => {
                const Icon = TYPE_ICONS[t.id] || Globe;
                const isSelected = qrType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTypeChange(t.id)}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-2 rounded-xl shrink-0 text-xs font-bold transition-all active:scale-95',
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-400/30'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    )}
                  >
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-md shrink-0 text-white"
                      style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : t.color }}
                    >
                      <Icon className="h-3 w-3" />
                    </div>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)_340px] gap-6 items-start w-full max-w-full min-w-0">

            {/* LEFT COLUMN: QR TYPE EXPLORER (Desktop Only) */}
            <div className="hidden lg:block w-full min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  1. Select QR Type
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {QR_TYPES.length} Types
                </span>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="search"
                  name="qr_type_filter_input"
                  autoComplete="off"
                  spellCheck={false}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search QR types..."
                  className="w-full h-9 pl-8 pr-8 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold p-1"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Type List */}
              <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1 no-scrollbar">
                {filteredTypes.length === 0 ? (
                  <div className="text-center py-8 px-2 space-y-2">
                    <p className="text-xs text-slate-500">No QR types match &quot;{search}&quot;</p>
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  filteredTypes.map((t, idx) => {
                  const Icon = TYPE_ICONS[t.id] || Globe;
                  const isSelected = qrType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTypeChange(t.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all',
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-2 border-blue-500 ring-2 ring-blue-400/20 shadow-xs'
                          : 'border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-800'
                      )}
                    >
                      <ShinyAnimatedIconBox
                        icon={Icon}
                        color={t.color}
                        size="sm"
                        index={idx}
                        delay={idx * 0.1}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={cn('text-xs font-bold truncate', isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200')}>
                            {t.label}
                          </span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0 ml-1" />}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{t.desc}</p>
                      </div>
                    </button>
                  );
                })
                )}
              </div>
            </div>

            {/* CENTER COLUMN: DYNAMIC INPUT FORM (TOP) & GENERATED QR PREVIEW (BELOW) */}
            <div className="space-y-6 min-w-0 max-w-full overflow-hidden">

              {/* 1. Dynamic Input Form Card (AT THE TOP) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-6 space-y-4 min-w-0 max-w-full overflow-hidden">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-xs"
                    style={{ backgroundColor: currentTypeInfo.color }}
                  >
                    <CurrentTypeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      2. Enter {currentTypeInfo.label} Content
                    </h2>
                    <p className="text-xs text-slate-500">Fill in the fields below to generate your QR code</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={qrType}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    <QRForm
                      type={qrType}
                      formData={formData}
                      onChange={handleFormChange}
                    />
                  </motion.div>
                </AnimatePresence>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* 2. Generated QR Code Display Card (DIRECTLY BELOW INPUT BOX) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-6 space-y-5 min-w-0 max-w-full overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      3. Generated QR Code
                    </span>
                    {isReady ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Scan Ready</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                        <span>Waiting for Input</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {qrValue && qrValue.startsWith('http') && (
                      <a
                        href={qrValue}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Open URL in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {qrValue && (
                      <button
                        type="button"
                        onClick={copyPayload}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Copy raw QR text"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* QR Canvas Display */}
                <div className="flex justify-center items-center py-6 bg-slate-50/70 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50 min-h-[220px]">
                  <QRCodeGenerator
                    qrValue={qrValue}
                    customization={customization}
                    error={error}
                  />
                </div>

                {/* Payload Preview */}
                {qrValue && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2 min-w-0 max-w-full overflow-hidden">
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Encoded Payload ({qrType.toUpperCase()})
                      </span>
                      <span className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate block mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                        {qrValue.replace(/\r?\n/g, ' ')}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyPayload}
                      className="h-8 px-2.5 text-xs text-slate-600 hover:text-blue-600 shrink-0"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      <span>Copy</span>
                    </Button>
                  </div>
                )}

                {/* QR Health Checks List */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Payload</div>
                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{isReady ? 'Valid' : 'Waiting'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Contrast</div>
                    <div
                      className={cn(
                        'text-xs font-bold flex items-center gap-1 mt-0.5',
                        contrast.score === 'good'
                          ? 'text-emerald-600'
                          : contrast.score === 'fair'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      )}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{contrast.ratio}:1 ({contrast.score})</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Quiet Zone</div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>{customization.includeMargin ? 'Safe (4-mod)' : 'Disabled'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">ECC Level</div>
                    <div className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Level {customization.ecLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CUSTOMIZATION & DOWNLOAD PANELS */}
            <div className="space-y-6 w-full min-w-0 max-w-full">
              {/* Customization Panel */}
              <CustomizationPanel
                customization={customization}
                onChange={handleCustomizationChange}
                onReset={resetForm}
              />

              {/* Download & Export Card */}
              <DownloadManager
                isReady={isReady}
                filename={filename}
                setFilename={setFilename}
                qrType={qrType}
                payload={qrValue}
                customization={customization}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
