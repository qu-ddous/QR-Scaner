import QRLandingPage from '@/components/QRLandingPage';
export default function vCardQRPage() {
  return (
    <QRLandingPage
      seoTitle="vCard QR Code Generator"
      seoDesc="Create a contact QR code that saves directly to the recipient's address book. Free, private, no sign-up."
      canonical="/qr/vcard"
      icon="👤"
      title="vCard QR Code Generator"
      subtitle="Create a contact QR code that saves directly to the recipient's address book."
      color="#E8590C"
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
