import QRLandingPage from '@/components/QRLandingPage';
export default function URLQRPage() {
  return (
    <QRLandingPage
      seoTitle="URL QR Code Generator — Link Any Website"
      seoDesc="Create a QR code for any URL or website. Free, instant, no sign-up. The URL is normalized to HTTPS automatically."
      canonical="/qr/url"
      icon="🔗"
      title="URL QR Code Generator"
      subtitle="Turn any website address into a scannable QR code. Supports http, https, and auto-normalizes bare domains to https://."
      color="#4263EB"
      whyItems={[
        { emoji: '📱', title: 'Instant mobile access', desc: 'Let anyone open your website by scanning instead of typing a URL on mobile.' },
        { emoji: '🖨️', title: 'Print marketing', desc: 'Add QR codes to business cards, flyers, menus, posters, and packaging.' },
        { emoji: '🔒', title: 'HTTPS enforced', desc: 'Bare domains like "example.com" are automatically upgraded to "https://example.com" for security.' },
        { emoji: '⚡', title: 'Instant generation', desc: 'No server roundtrip — your QR updates live as you type.' },
      ]}
      howItems={[
        { title: 'Open the QR Generator', desc: 'Click the button above or navigate to the Generator page.' },
        { title: 'Select "URL / Website" type', desc: 'It is selected by default.' },
        { title: 'Enter your URL', desc: 'Type or paste your website address. No need to include https://.' },
        { title: 'Customize and download', desc: 'Adjust colors, size, and format, then download.' },
      ]}
      faqs={[
        { q: 'Does the URL need to include https://?', a: 'No. QRHub automatically adds https:// if you enter a bare domain like "example.com".' },
        { q: 'Can I link to http:// instead of https://?', a: 'Yes — if you explicitly type http:// it will be preserved as-is.' },
        { q: 'Are URL QR codes permanent?', a: 'Static URL QR codes are permanent. The QR code will always point to the exact URL you entered at generation time.' },
      ]}
    />
  );
}
