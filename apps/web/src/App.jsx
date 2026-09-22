import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

// Core pages
import HomePage from '@/pages/HomePage';
import GeneratorPage from '@/pages/GeneratorPage';
import FeaturesPage from '@/pages/FeaturesPage';
import TemplatesPage from '@/pages/TemplatesPage';
import TemplateDetailPage from '@/pages/TemplateDetailPage';
import HistoryPage from '@/pages/HistoryPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import BulkGeneratorPage from '@/pages/BulkGeneratorPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import CookiesPage from '@/pages/CookiesPage';
import SitemapPage from '@/pages/SitemapPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ScannerPage from '@/pages/ScannerPage';
import NoteViewerPage from '@/pages/NoteViewerPage';
import SecretViewerPage from '@/pages/SecretViewerPage';

// QR type landing pages
import URLQRPage from '@/pages/URLQRPage';
import WiFiQRPage from '@/pages/WiFiQRPage';
import vCardQRPage from '@/pages/vCardQRPage';
import EmailQRPage from '@/pages/EmailQRPage';
import PhoneQRPage from '@/pages/PhoneQRPage';
import SMSQRPage from '@/pages/SMSQRPage';
import WhatsAppQRPage from '@/pages/WhatsAppQRPage';
import LocationQRPage from '@/pages/LocationQRPage';
import MapsQRPage from '@/pages/MapsQRPage';
import EventQRPage from '@/pages/EventQRPage';
import SocialMediaQRPage from '@/pages/SocialMediaQRPage';
import AppDownloadQRPage from '@/pages/AppDownloadQRPage';
import BusinessCardQRPage from '@/pages/BusinessCardQRPage';
import CryptoQRPage from '@/pages/CryptoQRPage';
import TextQRPage from '@/pages/TextQRPage';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="qrhub_theme">
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-blue-100 selection:text-blue-900 w-full max-w-full min-w-0 overflow-x-clip">
          <Header />
          <main className="flex-1 w-full max-w-full min-w-0 overflow-x-clip">
            <Routes>
              {/* Core Platform Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/generator" element={<GeneratorPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/bulk" element={<BulkGeneratorPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/templates/:slug" element={<TemplateDetailPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              {/* Public Note & Secret Message Viewers */}
              <Route path="/note" element={<NoteViewerPage />} />
              <Route path="/message" element={<NoteViewerPage />} />
              <Route path="/view" element={<NoteViewerPage />} />
              <Route path="/secret" element={<SecretViewerPage />} />
              <Route path="/lock" element={<SecretViewerPage />} />

              {/* Legal & Directory */}
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />

              {/* QR Specialized Landing Pages */}
              <Route path="/qr/url" element={<URLQRPage />} />
              <Route path="/qr/wifi" element={<WiFiQRPage />} />
              <Route path="/qr/vcard" element={<vCardQRPage />} />
              <Route path="/qr/email" element={<EmailQRPage />} />
              <Route path="/qr/phone" element={<PhoneQRPage />} />
              <Route path="/qr/sms" element={<SMSQRPage />} />
              <Route path="/qr/whatsapp" element={<WhatsAppQRPage />} />
              <Route path="/qr/location" element={<LocationQRPage />} />
              <Route path="/qr/maps" element={<MapsQRPage />} />
              <Route path="/qr/event" element={<EventQRPage />} />
              <Route path="/qr/social" element={<SocialMediaQRPage />} />
              <Route path="/qr/app-download" element={<AppDownloadQRPage />} />
              <Route path="/qr/business-card" element={<BusinessCardQRPage />} />
              <Route path="/qr/crypto" element={<CryptoQRPage />} />
              <Route path="/qr/text" element={<TextQRPage />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="bottom-right" richColors closeButton />
      </BrowserRouter>
    </ThemeProvider>
  );
}
