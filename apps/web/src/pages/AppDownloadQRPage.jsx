import QRLandingPage from '@/components/QRLandingPage';
export default function AppDownloadQRPage() {
  return (
    <QRLandingPage
      seoTitle="App Download QR Code Generator"
      seoDesc="Create a QR code linking to your app on Google Play or the App Store. Free, private, no sign-up."
      canonical="/qr/app-download"
      icon="📲"
      title="App Download QR Code Generator"
      subtitle="Create a QR code linking to your app on Google Play or the App Store."
      color="#5C7CFA"
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
