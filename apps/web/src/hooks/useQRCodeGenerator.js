import { useState, useCallback, useMemo } from 'react';
import { formatQRData } from '@/lib/qrDataFormatter';

export const QR_TYPES = [
  { id: 'url',           label: 'Website URL',       icon: 'Globe',       color: '#4F6EF7', pastelBg: '#EEF4FF', desc: 'Direct link to any webpage or web app' },
  { id: 'text',          label: 'Text & Secret Note', icon: 'FileText',    color: '#64748B', pastelBg: '#F8FAFC', desc: 'Web notes & password-encrypted secret messages' },
  { id: 'email',         label: 'Email Message',     icon: 'Mail',        color: '#EF4444', pastelBg: '#FEF2F2', desc: 'Pre-addressed email with subject & body' },
  { id: 'phone',         label: 'Phone Call',        icon: 'Phone',       color: '#10B981', pastelBg: '#ECFDF5', desc: 'Instant dial international telephone numbers' },
  { id: 'sms',           label: 'SMS Text',          icon: 'MessageSquareText', color: '#06B6D4', pastelBg: '#ECFEFF', desc: 'SMS recipient with pre-filled message' },
  { id: 'whatsapp',      label: 'WhatsApp Chat',     icon: 'MessageCircle', color: '#22C55E', pastelBg: '#F0FDF4', desc: 'Direct WhatsApp click-to-chat link' },
  { id: 'wifi',          label: 'Wi-Fi Network',     icon: 'Wifi',        color: '#6366F1', pastelBg: '#EEF2FF', desc: 'Join protected Wi-Fi without typing passwords' },
  { id: 'vcard',         label: 'vCard Contact',     icon: 'Contact',     color: '#F97316', pastelBg: '#FFF7ED', desc: 'Full digital address book card (.vcf)' },
  { id: 'location',      label: 'GPS Coordinates',   icon: 'Crosshair',   color: '#0284C7', pastelBg: '#F0F9FF', desc: 'Raw latitude and longitude coordinates' },
  { id: 'maps',          label: 'Google Maps',       icon: 'MapPin',      color: '#EAB308', pastelBg: '#FEFCE8', desc: 'Direct map location pin and directions' },
  { id: 'event',         label: 'Calendar Event',    icon: 'Calendar',    color: '#EC4899', pastelBg: '#FDF2F8', desc: 'Schedule event with start & end date' },
  { id: 'social',        label: 'Social Media',      icon: 'Share2',      color: '#14B8A6', pastelBg: '#F0FDFA', desc: 'Instagram, YouTube, Twitter or LinkedIn profile' },
  { id: 'app_download',  label: 'App Store Link',    icon: 'Smartphone',  color: '#3B82F6', pastelBg: '#EFF6FF', desc: 'Universal iOS App Store or Google Play link' },
  { id: 'business_card', label: 'Business Profile',  icon: 'Briefcase',   color: '#2563EB', pastelBg: '#EFF6FF', desc: 'Executive digital profile & portfolio' },
  { id: 'crypto',        label: 'Crypto Wallet',     icon: 'Coins',       color: '#D97706', pastelBg: '#FFFBEB', desc: 'Bitcoin, Ethereum, Solana, or USDT wallet' },
];

export const PRESET_THEMES = [
  { id: 'classic',  name: 'Classic',  fgColor: '#172033', bgColor: '#FFFFFF', previewBg: 'bg-white', border: 'border-slate-300' },
  { id: 'ocean',    name: 'Ocean',    fgColor: '#0369A1', bgColor: '#F0F9FF', previewBg: 'bg-sky-50', border: 'border-sky-300' },
  { id: 'indigo',   name: 'Indigo',   fgColor: '#4338CA', bgColor: '#EEF2FF', previewBg: 'bg-indigo-50', border: 'border-indigo-300' },
  { id: 'mint',     name: 'Mint',     fgColor: '#047857', bgColor: '#ECFDF5', previewBg: 'bg-emerald-50', border: 'border-emerald-300' },
  { id: 'sunset',   name: 'Sunset',   fgColor: '#C2410C', bgColor: '#FFF7ED', previewBg: 'bg-orange-50', border: 'border-orange-300' },
  { id: 'lavender', name: 'Lavender', fgColor: '#6D28D9', bgColor: '#F5F3FF', previewBg: 'bg-purple-50', border: 'border-purple-300' },
];

export const DEFAULT_CUSTOMIZATION = {
  fgColor:       '#172033',
  bgColor:       '#ffffff',
  size:          256,
  ecLevel:       'M',
  includeMargin: true,
  marginSize:    4,
  imageUrl:      '',
  imageWidth:    44,
  imageHeight:   44,
  imageExcavate: true,
};

const DEFAULT_FORM_DATA = {
  url:          '',
  text:         '',
  mode:         'web',
  isProtected:  false,
  formattedUrl: '',
  email:        '',
  subject:      '',
  body:         '',
  phone:        '',
  message:      '',
  ssid:         '',
  password:     '',
  encryption:   'WPA',
  hidden:       false,
  firstName:    '',
  lastName:     '',
  organization: '',
  title:        '',
  website:      '',
  address:      '',
  note:         '',
  lat:          '',
  lng:          '',
  altitude:     '',
  query:        '',
  eventTitle:   '',
  startDate:    '',
  endDate:      '',
  location:     '',
  description:  '',
  platform:     'instagram',
  username:     '',
  profileUrl:   '',
  appStoreUrl:  '',
  playStoreUrl: '',
  currency:     'bitcoin',
  walletAddress:'',
  amount:       '',
  label:        '',
  value:        '',
};

export function useQRCodeGenerator(initialType = 'url', initialData = null) {
  const [qrType, setQrType]               = useState(initialType);
  const [formsData, setFormsData]         = useState(() => {
    const initial = {};
    QR_TYPES.forEach((t) => {
      initial[t.id] = {};
    });
    if (initialData) {
      initial[initialType] = { ...initialData };
    }
    return initial;
  });
  const [customization, setCustomization] = useState(DEFAULT_CUSTOMIZATION);
  const [filename, setFilename]           = useState('qrhub-code');

  // Currently active form data is strictly scoped to the active QR type
  const formData = formsData[qrType] || {};

  /** Compute the QR payload string and any validation error reactively */
  const { qrValue, error } = useMemo(() => {
    try {
      const payload = formatQRData(qrType, formData);
      return { qrValue: payload || '', error: null };
    } catch (err) {
      return { qrValue: '', error: err.message };
    }
  }, [qrType, formData]);

  const handleTypeChange = useCallback((type) => {
    setQrType(type);
  }, []);

  const handleFormChange = useCallback((field, value) => {
    setFormsData(prev => ({
      ...prev,
      [qrType]: {
        ...(prev[qrType] || {}),
        [field]: value,
      },
    }));
  }, [qrType]);

  const loadTemplate = useCallback((type, data, custom) => {
    setQrType(type);
    setFormsData(prev => ({
      ...prev,
      [type]: { ...(data || {}) },
    }));
    if (custom) {
      setCustomization(prev => ({ ...prev, ...custom }));
    }
  }, []);

  const handleCustomizationChange = useCallback((field, value) => {
    setCustomization(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormsData(prev => ({
      ...prev,
      [qrType]: {},
    }));
    setCustomization(DEFAULT_CUSTOMIZATION);
  }, [qrType]);

  const applyPreset = useCallback((preset) => {
    setCustomization(prev => ({ ...prev, fgColor: preset.fgColor, bgColor: preset.bgColor }));
  }, []);

  const currentTypeInfo = QR_TYPES.find(t => t.id === qrType) || QR_TYPES[0];
  const isReady = qrValue.length > 0 && !error;

  return {
    qrType,
    formData,
    customization,
    qrValue,
    error,
    filename,
    isReady,
    currentTypeInfo,
    QR_TYPES,
    PRESET_THEMES,
    handleTypeChange,
    handleFormChange,
    handleCustomizationChange,
    resetForm,
    applyPreset,
    setFilename,
    loadTemplate,
  };
}
