import QRLandingPage from '@/components/QRLandingPage';
export default function BusinessCardQRPage() {
  return (
    <QRLandingPage
      seoTitle="Business Card QR Code Generator"
      seoDesc="Create a digital business card QR code using the vCard format. Free, private, no sign-up."
      canonical="/qr/business-card"
      icon="💼"
      title="Business Card QR Code Generator"
      subtitle="Create a digital business card QR code using the vCard format."
      color="#1971C2"
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
