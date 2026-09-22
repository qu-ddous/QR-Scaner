import { Helmet } from 'react-helmet';

const SITE_NAME = 'QRHub';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://qr-scaner-nu.vercel.app').replace(/\/$/, '');
const DEFAULT_DESC = 'Free vector QR code generator & studio — create URL, WiFi, contacts, encrypted secrets, and bulk batch QR codes instantly. 100% private, client-side.';
const DEFAULT_IMG = `${SITE_URL}/og-image.png`;

export default function SEO({
  title,
  description = DEFAULT_DESC,
  canonical,
  image = DEFAULT_IMG,
  noIndex = false,
  type = 'website',
  schema,
}) {
  // Prevent redundant repetition like "QRHub — ... | QRHub"
  let fullTitle = SITE_NAME;
  if (title) {
    fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  }

  const canonicalUrl = canonical
    ? `${SITE_URL}${canonical.startsWith('/') ? canonical : '/' + canonical}`
    : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* OG */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

