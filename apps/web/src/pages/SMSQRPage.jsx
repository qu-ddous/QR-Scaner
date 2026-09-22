import QRLandingPage from '@/components/QRLandingPage';
export default function SMSQRPage() {
  return (
    <QRLandingPage
      seoTitle="SMS QR Code Generator"
      seoDesc="Generate a QR code that opens a pre-filled SMS message on any phone. Free, private, no sign-up."
      canonical="/qr/sms"
      icon="💬"
      title="SMS QR Code Generator"
      subtitle="Generate a QR code that opens a pre-filled SMS message on any phone."
      color="#1098AD"
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
