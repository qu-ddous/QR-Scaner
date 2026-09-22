import QRLandingPage from '@/components/QRLandingPage';
export default function CryptoQRPage() {
  return (
    <QRLandingPage
      seoTitle="Crypto Payment QR Code Generator"
      seoDesc="Generate a payment QR code for Bitcoin, Ethereum, Litecoin, Dogecoin, or Monero. Free, private, no sign-up."
      canonical="/qr/crypto"
      icon="₿"
      title="Crypto Payment QR Code Generator"
      subtitle="Generate a payment QR code for Bitcoin, Ethereum, Litecoin, Dogecoin, or Monero."
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
