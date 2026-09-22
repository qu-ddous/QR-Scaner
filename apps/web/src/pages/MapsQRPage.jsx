import QRLandingPage from '@/components/QRLandingPage';
export default function MapsQRPage() {
  return (
    <QRLandingPage
      seoTitle="Google Maps QR Code Generator"
      seoDesc="Create a QR code that opens a specific location or search in Google Maps. Free, private, no sign-up."
      canonical="/qr/maps"
      icon="🗺️"
      title="Google Maps QR Code Generator"
      subtitle="Create a QR code that opens a specific location or search in Google Maps."
      color="#F59F00"
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
