import QRLandingPage from '@/components/QRLandingPage';
export default function LocationQRPage() {
  return (
    <QRLandingPage
      seoTitle="Location QR Code Generator"
      seoDesc="Share a precise GPS location as a scannable QR code. Free, private, no sign-up."
      canonical="/qr/location"
      icon="📍"
      title="Location QR Code Generator"
      subtitle="Share a precise GPS location as a scannable QR code."
      color="#1864AB"
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
