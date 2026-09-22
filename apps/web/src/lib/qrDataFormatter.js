/**
 * QR Data Formatter — converts form data into standards-compliant QR payloads.
 * All formatters return a string or throw an Error with a user-friendly message.
 */

const UNSAFE_PROTOCOLS = ['javascript:', 'data:', 'file:', 'vbscript:', 'about:'];

/** Normalise a raw URL to https://... and reject unsafe schemes */
export function formatUrl(raw) {
  if (!raw || !raw.trim()) return '';
  let url = raw.trim();

  // If user is just beginning to type protocol (e.g. 'http:', 'https://'), don't throw error
  if (/^https?:?\/?\/?$/i.test(url)) {
    return '';
  }

  // Reject unsafe protocols
  const lower = url.toLowerCase();
  for (const proto of UNSAFE_PROTOCOLS) {
    if (lower.startsWith(proto)) {
      throw new Error(`Unsafe protocol "${proto}" is not allowed.`);
    }
  }

  // If no protocol, prepend https://
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  // Validate
  try {
    new URL(url);
  } catch {
    throw new Error('Please enter a valid URL (e.g. example.com).');
  }

  return url;
}

/** Plain text / QRHub Web Hosted Message */
export function formatText(data) {
  if (!data) return '';
  if (typeof data === 'object') {
    if (data.mode === 'raw') {
      return data.text ? data.text.trim() : '';
    }
    if (data.formattedUrl) {
      return data.formattedUrl;
    }
    return data.text ? data.text.trim() : '';
  }
  return String(data).trim();
}

/** mailto: with optional subject and body */
export function formatEmail({ email = '', subject = '', body = '' }) {
  if (!email || !email.trim()) return '';
  const addr = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) {
    throw new Error('Please enter a valid email address.');
  }
  const params = new URLSearchParams();
  if (subject.trim()) params.set('subject', subject.trim());
  if (body.trim()) params.set('body', body.trim());
  const qs = params.toString();
  return `mailto:${addr}${qs ? '?' + qs : ''}`;
}

/** tel: with digits only (strip formatting) */
export function formatPhone(phone) {
  if (!phone || !phone.trim()) return '';
  // keep + at start, digits only
  const digits = phone.trim().replace(/[^\d+]/g, '');
  if (digits.length < 4) {
    throw new Error('Please enter a valid phone number.');
  }
  return `tel:${digits}`;
}

/** smsto: with optional message */
export function formatSms({ phone = '', message = '' }) {
  if (!phone || !phone.trim()) return '';
  const digits = phone.trim().replace(/[^\d+]/g, '');
  if (digits.length < 4) {
    throw new Error('Please enter a valid phone number.');
  }
  return message.trim()
    ? `smsto:${digits}:${message.trim()}`
    : `smsto:${digits}`;
}

/** WhatsApp wa.me link */
export function formatWhatsApp({ phone = '', message = '' }) {
  if (!phone || !phone.trim()) return '';
  // strip non-digits and leading zeros; keep +
  let digits = phone.trim().replace(/[^\d]/g, '');
  if (!digits) throw new Error('Please enter a valid WhatsApp number.');
  const params = message.trim()
    ? `?text=${encodeURIComponent(message.trim())}`
    : '';
  return `https://wa.me/${digits}${params}`;
}

/** WiFi: — escape special chars ; : \ " , */
function wifiEscape(str) {
  return String(str).replace(/([;:,\\"'])/g, '\\$1');
}
export function formatWifi({ ssid = '', password = '', encryption = 'WPA', hidden = false }) {
  if (!ssid || !ssid.trim()) return '';
  const enc = encryption || 'WPA';
  const nopass = enc === 'nopass' || !password;
  const parts = [
    `WIFI:T:${enc}`,
    `S:${wifiEscape(ssid.trim())}`,
    `P:${nopass ? '' : wifiEscape(password)}`,
    `H:${hidden ? 'true' : 'false'}`,
    '',
  ];
  return parts.join(';') + ';';
}

/** vCard 3.0 */
export function formatVCard({
  firstName = '', lastName = '', phone = '', email = '',
  organization = '', title = '', website = '',
  address = '', note = '',
}) {
  const hasContent = [
    firstName, lastName, phone, email,
    organization, title, website, address, note
  ].some((val) => typeof val === 'string' && val.trim().length > 0);

  if (!hasContent) {
    return '';
  }

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName.trim()};${firstName.trim()};;;`,
    `FN:${[firstName.trim(), lastName.trim()].filter(Boolean).join(' ')}`,
  ];
  if (organization.trim()) lines.push(`ORG:${organization.trim()}`);
  if (title.trim())        lines.push(`TITLE:${title.trim()}`);
  if (phone.trim())        lines.push(`TEL;TYPE=CELL:${phone.trim()}`);
  if (email.trim())        lines.push(`EMAIL:${email.trim()}`);
  if (website.trim())      lines.push(`URL:${formatUrl(website.trim())}`);
  if (address.trim())      lines.push(`ADR:;;${address.trim()};;;;`);
  if (note.trim())         lines.push(`NOTE:${note.trim()}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/** geo: URI */
export function formatLocation({ lat, lng, altitude = '' }) {
  if (lat === undefined || lat === null || lat === '') return '';
  if (lng === undefined || lng === null || lng === '') return '';
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  if (isNaN(latNum) || isNaN(lngNum)) {
    throw new Error('Please enter valid latitude and longitude values.');
  }
  if (latNum < -90 || latNum > 90)   throw new Error('Latitude must be between -90 and 90.');
  if (lngNum < -180 || lngNum > 180) throw new Error('Longitude must be between -180 and 180.');
  const alt = altitude !== '' ? `,${parseFloat(altitude)}` : '';
  return `geo:${latNum},${lngNum}${alt}`;
}

/** Google Maps URL */
export function formatMaps({ query = '', lat = '', lng = '' }) {
  if (query.trim()) {
    return `https://maps.google.com/?q=${encodeURIComponent(query.trim())}`;
  }
  if (lat && lng) {
    return `https://maps.google.com/?q=${parseFloat(lat)},${parseFloat(lng)}`;
  }
  return '';
}

/** iCal VEVENT */
function toICalDate(dateStr) {
  if (!dateStr) return '';
  return dateStr.replace(/[-:]/g, '').replace('T', 'T').slice(0, 15) + 'Z';
}
export function formatEvent({ title = '', startDate = '', endDate = '', location = '', description = '' }) {
  if (!title.trim() || !startDate) return '';
  const uid = `qrhub-${Date.now()}@qrhub.app`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QRHub//QR Generator//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `SUMMARY:${title.trim()}`,
    `DTSTART:${toICalDate(startDate)}`,
  ];
  if (endDate)           lines.push(`DTEND:${toICalDate(endDate)}`);
  if (location.trim())   lines.push(`LOCATION:${location.trim()}`);
  if (description.trim()) lines.push(`DESCRIPTION:${description.trim()}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

/** Social media profile URL */
const SOCIAL_BASE = {
  twitter:   'https://twitter.com/',
  instagram: 'https://instagram.com/',
  facebook:  'https://facebook.com/',
  linkedin:  'https://linkedin.com/in/',
  youtube:   'https://youtube.com/@',
  tiktok:    'https://tiktok.com/@',
  github:    'https://github.com/',
  snapchat:  'https://snapchat.com/add/',
  pinterest: 'https://pinterest.com/',
  reddit:    'https://reddit.com/u/',
};
export function formatSocial({ platform = 'twitter', username = '', profileUrl = '' }) {
  if (profileUrl.trim()) return formatUrl(profileUrl.trim());
  if (!username.trim()) return '';
  const base = SOCIAL_BASE[platform] || 'https://';
  const handle = username.trim().replace(/^@/, '');
  return `${base}${handle}`;
}

/** App store links */
export function formatAppDownload({ appStoreUrl = '', playStoreUrl = '' }) {
  // Prefer a universal link page, or return play store, or app store
  if (appStoreUrl.trim() && playStoreUrl.trim()) {
    // If both are given, use the Play Store as primary (more common for QR scanning on Android)
    // User can also provide a universal link instead
    return formatUrl(playStoreUrl.trim());
  }
  if (appStoreUrl.trim()) return formatUrl(appStoreUrl.trim());
  if (playStoreUrl.trim()) return formatUrl(playStoreUrl.trim());
  return '';
}

/** Business profile / digital business card */
export function formatBusinessCard({
  firstName = '',
  title = '',
  organization = '',
  phone = '',
  email = '',
  website = '',
}) {
  const hasContent = [firstName, title, organization, phone, email, website]
    .some((val) => typeof val === 'string' && val.trim().length > 0);

  if (!hasContent) {
    return '';
  }

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${firstName.trim()};;;`,
    `FN:${firstName.trim()}`,
  ];
  if (title.trim())        lines.push(`TITLE:${title.trim()}`);
  if (organization.trim()) lines.push(`ORG:${organization.trim()}`);
  if (phone.trim())        lines.push(`TEL;TYPE=WORK,VOICE:${phone.trim()}`);
  if (email.trim())        lines.push(`EMAIL:${email.trim()}`);
  if (website.trim())      lines.push(`URL:${formatUrl(website.trim())}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/** Crypto payment URI */
const CRYPTO_SCHEMES = {
  bitcoin:  'bitcoin:',
  ethereum: 'ethereum:',
  litecoin: 'litecoin:',
  dogecoin: 'dogecoin:',
  monero:   'monero:',
};
export function formatCrypto({ currency = 'bitcoin', address = '', amount = '', label = '' }) {
  if (!address.trim()) return '';
  const scheme = CRYPTO_SCHEMES[currency] || `${currency}:`;
  const params = new URLSearchParams();
  if (amount && parseFloat(amount) > 0) params.set('amount', parseFloat(amount).toString());
  if (label.trim()) params.set('label', label.trim());
  const qs = params.toString();
  return `${scheme}${address.trim()}${qs ? '?' + qs : ''}`;
}/**
 * Master formatter — routes to the right function based on QR type.
 * @param {string} type - QR type key
 * @param {Object} data - form data
 * @returns {string} QR payload
 */
export function formatQRData(type, data) {
  try {
    switch (type) {
      case 'url':           return formatUrl(data.url || data.value || '');
      case 'text':          return formatText(data);
      case 'secret':        return formatText(data);
      case 'email':         return formatEmail(data);
      case 'phone':         return formatPhone(data.phone || data.value || '');
      case 'sms':           return formatSms(data);
      case 'whatsapp':      return formatWhatsApp(data);
      case 'wifi':          return formatWifi(data);
      case 'vcard':         return formatVCard(data);
      case 'location':      return formatLocation(data);
      case 'maps':          return formatMaps(data);
      case 'event':         return formatEvent(data);
      case 'social':        return formatSocial(data);
      case 'app_download':  return formatAppDownload(data);
      case 'business_card': return formatBusinessCard(data);
      case 'crypto':        return formatCrypto(data);
      default:              return data.value || '';
    }
  } catch (err) {
    throw err;
  }
}
