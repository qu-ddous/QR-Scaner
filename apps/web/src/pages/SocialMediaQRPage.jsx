import QRLandingPage from '@/components/QRLandingPage';
export default function SocialMediaQRPage() {
  return (
    <QRLandingPage
      seoTitle="Social Media QR Code Generator"
      seoDesc="Create a QR code linking to your social media profile. Free, private, no sign-up."
      canonical="/qr/social"
      icon="🌐"
      title="Social Media QR Code Generator"
      subtitle="Create a QR code linking to your social media profile."
      color="#0CA678"
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
