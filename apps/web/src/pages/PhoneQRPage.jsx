import QRLandingPage from '@/components/QRLandingPage';
export default function PhoneQRPage() {
  return (
    <QRLandingPage
      seoTitle="Phone QR Code Generator"
      seoDesc="Create a QR code that dials a phone number instantly when scanned. Free, private, no sign-up."
      canonical="/qr/phone"
      icon="📞"
      title="Phone QR Code Generator"
      subtitle="Create a QR code that dials a phone number instantly when scanned."
      color="#2F9E44"
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
