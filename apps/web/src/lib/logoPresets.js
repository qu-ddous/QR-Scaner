/**
 * Curated Vector SVG Data URLs for 1-click Center QR Logos.
 * Crisp, officially styled vector icons formatted for high-contrast QR placement.
 */

// Helper to encode SVG to base64 data URI
const svgToDataUrl = (svgString) => `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

export const LOGO_PRESETS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Social',
    bgColor: '#25D366',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="24" fill="#25D366"/>
        <path fill="#ffffff" d="M34.2 13.8C31.5 11.1 27.9 9.6 24 9.6c-7.9 0-14.4 6.4-14.4 14.4 0 2.5.7 5 1.9 7.1L9.6 38.4l7.5-2c2.1 1.1 4.4 1.7 6.9 1.7 7.9 0 14.4-6.4 14.4-14.4 0-3.9-1.5-7.5-4.2-9.7zm-10.2 22.1c-2.1 0-4.2-.6-6-1.6l-.4-.3-4.5 1.2 1.2-4.4-.3-.4c-1.2-1.9-1.8-4-1.8-6.3 0-6.6 5.4-12 12-12 3.2 0 6.2 1.2 8.5 3.5s3.5 5.3 3.5 8.5c0 6.6-5.4 11.9-12.2 11.9zm6.6-8.9c-.4-.2-2.1-1-2.4-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.1-2.7-.2-.4 0-.6.2-.8.2-.2.4-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6-.1-.2-.8-2-.9-2.7-.2-.7-.5-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .8.8.3 1.6.2 2.2.1.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.6.2-1.7-.1-.2-.3-.3-.7-.5z"/>
      </svg>
    `),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social',
    bgColor: '#E1306C',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <defs>
          <linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFDC80"/>
            <stop offset="50%" stop-color="#FD1D1D"/>
            <stop offset="100%" stop-color="#C13584"/>
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#ig)"/>
        <rect x="11" y="11" width="26" height="26" rx="7" fill="none" stroke="#ffffff" stroke-width="3"/>
        <circle cx="24" cy="24" r="6" fill="none" stroke="#ffffff" stroke-width="3"/>
        <circle cx="31.5" cy="16.5" r="1.75" fill="#ffffff"/>
      </svg>
    `),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Social',
    bgColor: '#FF0000',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <rect width="48" height="48" rx="12" fill="#FF0000"/>
        <path fill="#ffffff" d="M37.8 17.2c-.4-1.6-1.7-2.9-3.3-3.3C31.6 13 24 13 24 13s-7.6 0-10.5.9c-1.6.4-2.9 1.7-3.3 3.3C9.3 20.1 9.3 24 9.3 24s0 3.9.9 6.8c.4 1.6 1.7 2.9 3.3 3.3 2.9.9 10.5.9 10.5.9s7.6 0 10.5-.9c1.6-.4 2.9-1.7 3.3-3.3.9-2.9.9-6.8.9-6.8s0-3.9-.9-6.8zM21 28.5v-9l7.8 4.5L21 28.5z"/>
      </svg>
    `),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Professional',
    bgColor: '#0A66C2',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <rect width="48" height="48" rx="10" fill="#0A66C2"/>
        <path fill="#ffffff" d="M14.8 19.3h-4.6v14.7h4.6V19.3zm-2.3-7.2c-1.5 0-2.4 1-2.4 2.3 0 1.2.9 2.3 2.4 2.3 1.5 0 2.4-1.1 2.4-2.3 0-1.3-.9-2.3-2.4-2.3zm14.5 7.2h-4.4v2h.1c.6-1.1 2-2.3 4.2-2.3 4.5 0 5.4 3 5.4 6.8v8.2h-4.6v-7.3c0-1.7 0-4-2.4-4-2.4 0-2.8 1.9-2.8 3.8v7.5h-4.6V19.3h4.4v2.1h.1z"/>
      </svg>
    `),
  },
  {
    id: 'x-twitter',
    name: 'X (Twitter)',
    category: 'Social',
    bgColor: '#000000',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <rect width="48" height="48" rx="10" fill="#000000"/>
        <path fill="#ffffff" d="M28.4 22.4L37.8 11.5H35.6L27.4 21.0L20.8 11.5H13.5L23.4 25.8L13.5 37.3H15.7L24.3 27.2L31.3 37.3H38.5L28.4 22.4ZM25.5 25.9L24.5 24.5L16.5 13.1H19.9L26.3 22.4L27.3 23.8L35.6 35.8H32.2L25.5 25.9Z"/>
      </svg>
    `),
  },
  {
    id: 'wifi',
    name: 'Wi-Fi',
    category: 'Utility',
    bgColor: '#3B82F6',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="24" fill="#3B82F6"/>
        <path fill="#ffffff" d="M12 18.2C15.3 14.9 19.5 13 24 13s8.7 1.9 12 5.2l-2.8 2.8C30.8 18.6 27.5 17 24 17s-6.8 1.6-9.2 4L12 18.2zm4.2 4.2C18.4 20.2 21.1 19 24 19s5.6 1.2 7.8 3.4l-2.8 2.8C27.5 23.7 25.8 23 24 23s-3.5.7-5 2.2l-2.8-2.8zm4.3 4.3C21.6 25.6 22.8 25 24 25s2.4.6 3.5 1.7l-3.5 3.6-3.5-3.6z"/>
      </svg>
    `),
  },
  {
    id: 'website',
    name: 'Website',
    category: 'Utility',
    bgColor: '#6366F1',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="24" fill="#6366F1"/>
        <circle cx="24" cy="24" r="14" fill="none" stroke="#ffffff" stroke-width="3"/>
        <ellipse cx="24" cy="24" rx="7" ry="14" fill="none" stroke="#ffffff" stroke-width="2.5"/>
        <line x1="10" y1="24" x2="38" y2="24" stroke="#ffffff" stroke-width="2.5"/>
      </svg>
    `),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Media',
    bgColor: '#1DB954',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="24" fill="#1DB954"/>
        <path fill="#ffffff" d="M33.2 29.8c-.4.6-1.1.8-1.7.4-4.8-2.9-10.8-3.6-17.9-2- .7.1-1.3-.3-1.4-1-.1-.7.3-1.3 1-1.4 7.8-1.8 14.5-1 19.8 2.2.6.4.8 1.1.4 1.8zm2.4-5.3c-.5.8-1.4 1-2.2.5-5.9-3.6-14.8-4.7-21.7-2.5-.8.3-1.8-.2-2-1-.3-.8.2-1.8 1-2 7.9-2.4 17.8-1.2 24.5 2.9.7.4 1 1.4.5 2.2zm.2-5.5C28.8 14.8 17.8 14.5 11.5 16.4c-1 .3-2.1-.3-2.4-1.3-.3-1 .3-2.1 1.3-2.4 7.2-2.2 19.3-1.8 26.6 2.5 1 .6 1.3 1.8.7 2.8-.5 1-1.8 1.3-2.7.7z"/>
      </svg>
    `),
  },
  {
    id: 'phone',
    name: 'Phone / Call',
    category: 'Utility',
    bgColor: '#10B981',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="24" fill="#10B981"/>
        <path fill="#ffffff" d="M32.8 28.5l-3.3-1.4c-.8-.3-1.7-.1-2.2.5l-1.4 1.7c-2.9-1.5-5.2-3.8-6.7-6.7l1.7-1.4c.6-.5.8-1.4.5-2.2l-1.4-3.3c-.4-.9-1.4-1.5-2.4-1.3l-3.4.6c-.9.2-1.6 1-1.6 1.9C12.6 27.5 20.5 35.4 30.5 35.4c1 0 1.7-.7 1.9-1.6l.6-3.4c.2-.9-.4-1.9-1.3-2.3z"/>
      </svg>
    `),
  },
  {
    id: 'email',
    name: 'Email',
    category: 'Utility',
    bgColor: '#EA4335',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="24" fill="#EA4335"/>
        <path fill="#ffffff" d="M34 16H14c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V18c0-1.1-.9-2-2-2zm-1 3.5L24 25.1 15 19.5V18l9 5.6 9-5.6v1.5z"/>
      </svg>
    `),
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Development',
    bgColor: '#24292E',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="24" fill="#24292E"/>
        <path fill="#ffffff" fill-rule="evenodd" d="M24 10C16.3 10 10 16.3 10 24c0 6.2 4 11.4 9.6 13.3.7.1 1-.3 1-.7v-2.4c-3.9.8-4.7-1.9-4.7-1.9-.6-1.6-1.5-2.1-1.5-2.1-1.3-.9.1-.9.1-.9 1.4.1 2.2 1.5 2.2 1.5 1.3 2.1 3.3 1.5 4.1 1.2.1-.9.5-1.5.9-1.9-3.1-.4-6.4-1.6-6.4-7 0-1.5.5-2.8 1.4-3.8-.1-.4-.6-1.8.1-3.7 0 0 1.2-.4 3.9 1.5 1.1-.3 2.3-.5 3.5-.5s2.4.2 3.5.5c2.7-1.9 3.9-1.5 3.9-1.5.7 1.9.2 3.3.1 3.7.9 1 1.4 2.3 1.4 3.8 0 5.4-3.3 6.6-6.4 7 .5.4 1 1.3 1 2.6v3.9c0 .4.3.8 1 .7 5.6-1.9 9.6-7.1 9.6-13.3 0-7.7-6.3-14-14-14z"/>
      </svg>
    `),
  },
  {
    id: 'lock',
    name: 'Encrypted / Secret',
    category: 'Security',
    bgColor: '#8B5CF6',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="24" fill="#8B5CF6"/>
        <path fill="#ffffff" d="M30 20h-1v-3c0-2.8-2.2-5-5-5s-5 2.2-5 5v3h-1c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V22c0-1.1-.9-2-2-2zm-9-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3h-6v-3zm4 10.7V30c0 .6-.4 1-1 1s-1-.4-1-1v-2.3c-.6-.4-1-1-1-1.7 0-1.1.9-2 2-2s2 .9 2 2c0 .7-.4 1.3-1 1.7z"/>
      </svg>
    `),
  },
];
