import QRLandingPage from '@/components/QRLandingPage';
export default function WiFiQRPage() {
  return (
    <QRLandingPage
      seoTitle="WiFi QR Code Generator — Let Guests Connect Instantly"
      seoDesc="Create a WiFi QR code that lets anyone connect to your network by scanning. Supports WPA/WPA2, WEP, and open networks. Private — passwords never leave your device."
      canonical="/qr/wifi"
      icon="📶"
      title="WiFi QR Code Generator"
      subtitle="Let guests connect to your WiFi instantly by scanning — no more reading out passwords. Supports WPA2, WEP, and open networks."
      color="#7048E8"
      whyItems={[
        { emoji: '🏨', title: 'Hotels & Airbnbs', desc: 'Post a WiFi QR code in your room so guests connect without asking for the password.' },
        { emoji: '☕', title: 'Cafes & restaurants', desc: 'Print it on a table tent or window sticker — instant guest WiFi access.' },
        { emoji: '🏢', title: 'Office meeting rooms', desc: 'Keep conference rooms productive — visitors connect without IT help.' },
        { emoji: '🔒', title: 'Password stays private', desc: 'The WiFi password is encoded locally in your browser. It is never transmitted to any server.' },
      ]}
      howItems={[
        { title: 'Open the Generator', desc: 'Navigate to the QR Generator page.' },
        { title: 'Select "WiFi" as the QR type', desc: 'From the left type selector.' },
        { title: 'Enter your SSID and password', desc: 'Select your encryption type (WPA2 is most common).' },
        { title: 'Download and print', desc: 'Export as PDF or PNG for printing, or use PNG for digital displays.' },
      ]}
      faqs={[
        { q: 'Is my WiFi password safe?', a: 'Yes. The password is processed entirely in your browser using JavaScript. It is never sent to any server or network.' },
        { q: 'What encryption type should I choose?', a: 'WPA / WPA2 is correct for virtually all modern home and business routers. Choose WEP only for very old routers, and "None" only for truly open networks.' },
        { q: 'Will this work on iPhone?', a: 'Yes. iOS 11+ and Android can scan WiFi QR codes natively from the camera app.' },
      ]}
    />
  );
}
