import QRLandingPage from '@/components/QRLandingPage';
export default function EventQRPage() {
  return (
    <QRLandingPage
      seoTitle="Calendar Event QR Code Generator"
      seoDesc="Share a calendar event as a QR code. Scan to add to any calendar app. Free, private, no sign-up."
      canonical="/qr/event"
      icon="📅"
      title="Calendar Event QR Code Generator"
      subtitle="Share a calendar event as a QR code. Scan to add to any calendar app."
      color="#D6336C"
      whyItems={[]}
      howItems={[
        { title: 'Open the QR Generator' },
        { title: 'Select the matching QR type from the left panel' },
        { title: 'Fill in your details' },
        { title: 'Customize colors and download' },
      ]}
      faqs={[]}
    />
  );
}
