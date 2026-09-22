import QRLandingPage from '@/components/QRLandingPage';
export default function EmailQRPage() {
  return (
    <QRLandingPage
      seoTitle="Email QR Code Generator"
      seoDesc="Generate a QR code that opens a pre-addressed email with optional subject and body. Free, private, no sign-up."
      canonical="/qr/email"
      icon="✉️"
      title="Email QR Code Generator"
      subtitle="Generate a QR code that opens a pre-addressed email with optional subject and body."
      color="#F03E3E"
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
