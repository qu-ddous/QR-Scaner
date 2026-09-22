import QRLandingPage from '@/components/QRLandingPage';
export default function WhatsAppQRPage() {
  return (
    <QRLandingPage
      seoTitle="WhatsApp QR Code Generator"
      seoDesc="Create a QR code that opens a WhatsApp conversation with your number. Free, private, no sign-up."
      canonical="/qr/whatsapp"
      icon="📱"
      title="WhatsApp QR Code Generator"
      subtitle="Create a QR code that opens a WhatsApp conversation with your number."
      color="#25D366"
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
