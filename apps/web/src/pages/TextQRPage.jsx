import QRLandingPage from '@/components/QRLandingPage';
export default function TextQRPage() {
  return (
    <QRLandingPage
      seoTitle="Text QR Code Generator"
      seoDesc="Encode any plain text as a QR code. Notes, coupons, codes, or messages. Free, private, no sign-up."
      canonical="/qr/text"
      icon="📝"
      title="Text QR Code Generator"
      subtitle="Encode any plain text as a QR code. Notes, coupons, codes, or messages."
      color="#495057"
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
