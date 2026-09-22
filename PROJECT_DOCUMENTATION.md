# QRHub — Ultimate QR Code SaaS Platform Documentation

> **Complete product specification, architecture, page catalog, tool documentation, UI elements, button reference, and operational guide for the QRHub QR Code Generator SaaS application.**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Live URLs & Local Access](#2-live-urls--local-access)
3. [Tech Stack & Architecture](#3-tech-stack--architecture)
4. [Project Directory Structure](#4-project-directory-structure)
5. [Complete Page-by-Page Breakdown](#5-complete-page-by-page-breakdown)
   - [Core Applications & Generators](#core-applications--generators)
   - [Marketing & Discovery Pages](#marketing--discovery-pages)
   - [SEO Landing Pages (17 Dedicated QR Types)](#seo-landing-pages-17-dedicated-qr-types)
   - [Legal & Compliance](#legal--compliance)
6. [Supported QR Code Types (17 Complete Schemas)](#6-supported-qr-code-types-17-complete-schemas)
7. [Advanced Tools & Special Functionalities](#7-advanced-tools--special-functionalities)
   - [📊 Bulk & CSV Batch QR Generator](#-bulk--csv-batch-qr-generator)
   - [🖨️ Print-Ready Layout Presets & Print Modal](#-print-ready-layout-presets--print-modal)
   - [📁 Browser Local History & Folder Organization](#-browser-local-history--folder-organization)
   - [📐 Tested Industry Templates Library](#-tested-industry-templates-library)
   - [👁️ Real-Time WCAG Contrast & Scannability Health Engine](#-real-time-wcag-contrast--scannability-health-engine)
   - [🔐 Encrypted Secret QR Code Engine (AES-GCM)](#-encrypted-secret-qr-code-engine-aes-gcm)
   - [📩 Direct Contact Delivery & Lead Management](#-direct-contact-delivery--lead-management)
8. [QR Customization Studio Engine](#8-qr-customization-studio-engine)
9. [Export & Download Manager](#9-export--download-manager)
10. [Design System, Aesthetics & Theme Switching](#10-design-system-aesthetics--theme-switching)
11. [SEO & Social Metadata Architecture](#11-seo--social-metadata-architecture)
12. [PWA (Progressive Web App) & Offline Reliability](#12-pwa-progressive-web-app--offline-reliability)
13. [Local Development & Running Instructions](#13-local-development--running-instructions)

---

## 1. Executive Summary

**QRHub** is an enterprise-grade, privacy-first, client-side QR Code Generator SaaS application. It empowers individuals, designers, agencies, and businesses to synthesize, stylize, test, and batch-produce print-ready QR codes across 17 distinct data protocols with zero server tracking, zero mandatory subscriptions, and 100% data sovereignty.

### Key Highlights:
* **100% Client-Side Privacy:** QR generation and matrix computation run in-memory inside the browser using HTML5 Canvas and SVG XML serializers. Sensitive data (Wi-Fi passwords, vCard contacts, encrypted secrets) never leaves the user's computer.
* **17 Specialized QR Schemas:** From standard URLs and Wi-Fi to AES-encrypted secret payloads, crypto wallet addresses, vCards, and geo-coordinates.
* **Batch / CSV Processing:** Convert CSV files or text lists of up to 100 entries into downloadable vector SVGs in seconds.
* **Native Print Engine:** One-click print presets with table tents for restaurants, 3.5" x 2" business cards, and 12-up sticker sheets with cut lines.
* **Automated Scannability Assurance:** Real-time WCAG 2.1 contrast ratio calculations alert users before they export low-contrast, unreadable codes.
* **Folderized Local History:** Browser-native storage with tagging, payload copying, search, and full JSON backup/restore.

---

## 2. Live URLs & Local Access

| Resource | URL / Path |
| :--- | :--- |
| **Local Development Web App** | `http://localhost:5173` |
| **Flagship QR Studio** | `http://localhost:5173/generator` |
| **Bulk CSV Generator** | `http://localhost:5173/bulk` |
| **QR Templates Library** | `http://localhost:5173/templates` |
| **Local History & Folders** | `http://localhost:5173/history` |
| **Platform Features** | `http://localhost:5173/features` |
| **Pricing** | `http://localhost:5173/pricing` |
| **About Project** | `http://localhost:5173/about` |
| **Contact & Inquiries** | `http://localhost:5173/contact` |
| **HTML Sitemap** | `http://localhost:5173/sitemap` |
| **Direct Contact API Endpoint** | `POST http://localhost:5173/api/contact` |

---

## 3. Tech Stack & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser Client                      │
│                                                             │
│   React 18 + React Router DOM v7 (SPA Client-Side Route)   │
│   Tailwind CSS 3.4 + Radix UI Primitives + Lucide React     │
│   qrcode.react (Dual-mode Canvas & SVG In-Memory Synthesis) │
│   Web Crypto API (SubtleCrypto AES-GCM Encrypted Payloads)  │
│   HTML5 Canvas Rasterizer (PNG / JPG / WebP / PDF)         │
│   Service Worker v1.1 + Cache Storage (Offline PWA)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
               Static Assets & │ API Route
               HTTP Requests   │ (/api/contact)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Node.js Native Server                       │
│                       (server.js)                           │
│                                                             │
│   • Zero-dependency native HTTP/HTTPS dispatcher            │
│   • SPA client-side route fallback to index.html            │
│   • Dynamic MIME-type resolution with UTF-8 encoding        │
│   • Inbound lead persistence into leads.json                │
│   • FormSubmit Email Gateway Relay (m.quddous7172@gmail.com)│
└─────────────────────────────────────────────────────────────┘
```

| Layer | Technologies |
| :--- | :--- |
| **Core Framework** | React 18 (`react`, `react-dom`) with Vite 7 |
| **Routing** | React Router DOM v7 (`react-router-dom`) with client-side SPA fallback |
| **Styling & Design System** | Tailwind CSS 3.4, PostCSS, Autoprefixer, `clsx`, `tailwind-merge` |
| **Component Primitives** | Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, `@radix-ui/react-popover`) |
| **QR Synthesis Engine** | `qrcode.react` (Canvas 2D API & SVG XML tree generation) |
| **Encryption Engine** | Native Web Crypto API (`window.crypto.subtle` AES-GCM 256-bit) |
| **Icons & Visuals** | `lucide-react` (50+ feather-style vector glyphs) |
| **Animations** | `framer-motion` (Fluid page transitions, collapsible panels, 3D card tilt) |
| **Notifications & Toasts** | `sonner` floating toast dispatchers |
| **Local Persistence** | `localStorage` JSON repository with automatic migration |
| **Backend / Static Server** | Node.js native `http` & `https` modules (Zero external npm runtime dependencies) |
| **Lead Dispatch** | FormSubmit direct HTTP relay + project `leads.json` ledger |

---

## 4. Project Directory Structure

```
qr-saas/
├── package.json                         # Monorepo root configuration & scripts
├── server.js                            # Native Node.js web server & email relay
├── leads.json                           # Local storage of contact form inquiries
├── PROJECT_DOCUMENTATION.md             # Complete project specification (this document)
├── dist/                                # Production-compiled bundle served by server.js
│   └── apps/
│       └── web/
│           ├── index.html               # Main SPA HTML shell
│           ├── favicon.svg              # Brand icon
│           ├── manifest.json            # PWA install specification
│           ├── sw.js                    # Service Worker v1.1 offline cache
│           └── assets/
│               ├── index-Xo8NFmsD.css   # Compiled CSS design system
│               └── index-BkbhT1tu.js   # Production React bundle
└── apps/
    └── web/
        ├── package.json                 # Web app scripts & dependencies
        ├── vite.config.js               # Vite bundler configuration (@/ path alias)
        ├── tailwind.config.js           # Palette, fonts, and dark mode configuration
        ├── public/
        │   ├── favicon.svg              # Scalable SVG logo
        │   ├── manifest.json            # Web App Manifest
        │   └── sw.js                    # Progressive Web App service worker
        └── src/
            ├── App.jsx                  # Main application routes & Layout shell
            ├── main.jsx                 # React root mount
            ├── index.css                # CSS variables, typography, and scrollbar rules
            ├── components/              # 16 primary feature components
            │   ├── ui/                  # 12 accessible Radix UI primitives
            │   ├── Card3D.jsx           # Interactive 3D hover effect container
            │   ├── CustomizationPanel.jsx # 4-tab QR styling & logo manager
            │   ├── DownloadManager.jsx  # Multi-format raster/vector export panel
            │   ├── Footer.jsx           # Categorized 4-column footer
            │   ├── Header.jsx           # Sticky navbar with theme switch & mobile drawer
            │   ├── PrintModal.jsx       # Physical print sheet configurator
            │   ├── QRCodeGenerator.jsx  # Interactive QR canvas and preview
            │   ├── ScrollReveal.jsx     # Viewport scroll animation container
            │   ├── SEO.jsx              # Dynamic head meta, OG, and Twitter tags
            │   └── ShinyAnimatedIconBox.jsx # Premium glassmorphism animated icons
            ├── hooks/
            │   ├── useQRCodeGenerator.js# QR generation state, schemas, and validators
            │   └── use-mobile.jsx       # Responsive screen width listener
            ├── lib/                     # Algorithmic and business logic
            │   ├── contrastChecker.js   # WCAG 2.1 luminance & contrast calculator
            │   ├── cryptoQR.js          # In-browser AES-GCM secret encryption
            │   ├── downloadQRCode.js    # PNG/JPG/SVG/WebP/PDF rasterizing pipeline
            │   ├── logoPresets.js       # Curated brand logos (WhatsApp, Wi-Fi, etc.)
            │   ├── qrDataFormatter.js   # 17 standard RFC & ISO payload formatters
            │   ├── qrHistory.js         # Browser local history, tagging & backup
            │   └── templatesData.js     # Pre-configured industry templates
            └── pages/                   # 30 application routes
                ├── HomePage.jsx         # High-converting landing page
                ├── GeneratorPage.jsx    # Flagship studio with 17 QR types
                ├── BulkGeneratorPage.jsx# CSV & batch processing tool
                ├── TemplatesPage.jsx    # Categorized templates gallery
                ├── TemplateDetailPage.jsx # Single template preview & customizer
                ├── HistoryPage.jsx      # Folderized local QR code history
                ├── FeaturesPage.jsx     # Technical capabilities showcase
                ├── AboutPage.jsx        # Project mission & privacy philosophy
                ├── ContactPage.jsx      # Inbound inquiry form with direct delivery
                ├── SitemapPage.jsx      # HTML hierarchical sitemap
                ├── PrivacyPage.jsx      # GDPR / CCPA privacy policy
                ├── TermsPage.jsx        # Terms of service
                ├── CookiesPage.jsx      # Zero-tracking cookie disclosure
                ├── NotFoundPage.jsx     # 404 recovery page
                └── [17 SEO QR Pages]    # Specialized landing pages for each type
```

---

## 5. Complete Page-by-Page Breakdown

### Core Applications & Generators

#### 1. Generator Studio (`/generator`)
The flagship interactive workshop.
* **Type Selector:** Horizontal category pills and search bar covering 17 QR types.
* **Real-time Live Canvas:** Renders dynamically as the user types without pressing submit.
* **Contrast Badge:** Real-time indicator displaying color contrast ratio and readability status.
* **Customization Studio:** 4 tabs (Design, Colors, Logo, Advanced) for full aesthetic control.
* **Export Hub:** Instant PNG, JPG, SVG, WebP, PDF export up to 4x (2048px).
* **Print Studio Trigger:** Launches the Print-Ready Layout Modal.
* **Copy Image Button:** One-click copy of the raw image blob directly to the system clipboard.

#### 2. Bulk & CSV Generator (`/bulk`)
Batch generation tool for production, logistics, and retail.
* **CSV File Upload:** Drag-and-drop or select `.csv` spreadsheets; automatically extracts the first column.
* **Multi-line Text Input:** Paste up to 100 links or strings (one per line).
* **Global Palette Control:** Assign uniform brand foreground and background colors to all generated codes.
* **Live Batch Grid:** Displays all generated QR codes with individual SVG download buttons.
* **Download All (Batch Export):** Sequentially saves every generated QR code as an SVG vector file.

#### 3. QR Templates Library (`/templates`)
Curated blueprints for instant real-world deployment.
* **Category Filters:** Filter by All, Hospitality, Office, Networking, Events, Crypto.
* **Interactive Cards:** Pre-filled with tested colors, high ECC, and recommended configurations.
* **One-Click "Use Template":** Instantly loads the blueprint directly into the Studio with all fields pre-populated.

#### 4. Template Detail Page (`/templates/:slug`)
Deep-dive page for individual templates.
* Displays high-res scannable preview, schema specifications, recommended real-world applications, and production tips.

#### 5. Local QR History & Folders (`/history`)
A private storage vault running entirely on `localStorage`.
* **Zero Cloud Sync:** QR history stays solely on the user's browser.
* **Folder Tags:** Organize saved codes into folders (General, Marketing, Operations, Personal, Event).
* **Search & Filter:** Search by payload string, title, or filter by QR schema.
* **Actions:** Open back in Studio, copy raw payload, delete single entry, or clear entire archive.
* **Backup & Restore:** Export complete archive as `.json` or import previously exported JSON backups.

---

### Marketing & Discovery Pages

#### 6. Home Page (`/`)
* Hero section with animated gradient headers, live interactive QR preview card, and instant type pills.
* "How It Works" 3-step visual guide (Choose Type → Customize Brand → Export Vector).
* Feature highlights with interactive 3D cards.
* Client-side privacy banner and FAQ accordion.

#### 7. Features Page (`/features`)
* Comprehensive matrix of platform capabilities: Vector exports, WCAG contrast checks, error correction levels, offline capabilities, and 100% data sovereignty.

#### 8. About Us (`/about`)
* QRHub’s founding philosophy: Eliminating predatory recurring subscriptions and URL redirection trackers common in other generators.

#### 9. Contact Page (`/contact`)
* Interactive inquiry form with real-time validation.
* Direct dual-dispatch via FormSubmit to `m.quddous7172@gmail.com` and `m.quddous7271@gmail.com`.
* In-server persistence into `leads.json` for offline auditability.

#### 10. HTML Sitemap (`/sitemap`)
* Categorized, crawlable directory of every page, generator tool, template, and legal agreement.

---

### SEO Landing Pages (17 Dedicated QR Types)

Each page is an optimized landing page equipped with tailored meta descriptions, FAQ schemas, and a pre-configured studio loader:

1. `/url-qr-code-generator` — Website & landing page links
2. `/wifi-qr-code-generator` — Passwordless Wi-Fi connection
3. `/vcard-qr-code-generator` — Digital contact cards
4. `/whatsapp-qr-code-generator` — Direct WhatsApp chat links
5. `/email-qr-code-generator` — Pre-filled email messages
6. `/sms-qr-code-generator` — Pre-filled text messages
7. `/phone-qr-code-generator` — Click-to-call phone numbers
8. `/text-qr-code-generator` — Plain text snippets & notes
9. `/event-qr-code-generator` — Calendar appointments (.ics)
10. `/location-qr-code-generator` — Geographic GPS coordinates
11. `/maps-qr-code-generator` — Google Maps navigation pins
12. `/social-media-qr-code-generator` — Multi-network profile links
13. `/pdf-qr-code-generator` — Menus, whitepapers & flyers
14. `/app-download-qr-code-generator` — App Store & Google Play links
15. `/business-card-qr-code-generator` — Professional corporate cards
16. `/crypto-qr-code-generator` — Bitcoin, Ethereum & Solana wallets
17. `/secret-qr-code-generator` — Password-protected encrypted messages

---

## 6. Supported QR Code Types (17 Complete Schemas)

| Type | Protocol / Format | Description & Supported Fields |
| :--- | :--- | :--- |
| **URL** | `https://...` | Website links, auto-normalizes protocols, UTM tracking parameters. |
| **Plain Text** | Raw string | Notes, instructions, or raw payloads with live character counter. |
| **Email** | `mailto:addr?subject=...&body=...` | Pre-addressed emails with customizable subject lines and default body text. |
| **Phone** | `tel:+1234567890` | Click-to-dial international phone numbers. |
| **SMS** | `SMSTO:num:message` | Pre-written text messages ready to send on scan. |
| **WhatsApp** | `https://wa.me/num?text=...` | Direct WhatsApp chat opener with pre-typed message. |
| **Wi-Fi** | `WIFI:T:WPA;S:ssid;P:pass;H:false;;` | Network SSID, password, security protocol (WPA/WPA2, WEP, None), and hidden SSID toggle. |
| **vCard** | `BEGIN:VCARD ... END:VCARD` | Full name, phone, email, company, job title, website, street address. |
| **Location** | `geo:lat,lng` | Exact latitude and longitude coordinates. |
| **Google Maps**| `https://maps.google.com/?q=...` | Location name or street address pinned on Google Maps. |
| **Event** | `BEGIN:VEVENT ... END:VEVENT` | iCalendar meeting with Title, Start Date/Time, End Date/Time, Location, Description. |
| **Social** | `https://linktr.ee/...` | Centralized profile links for Instagram, Twitter/X, LinkedIn, YouTube, TikTok. |
| **PDF** | `https://.../document.pdf` | Direct links to hosted PDF documents, menus, manuals, or catalogs. |
| **App Store** | Smart store URL | Universal app download links for Apple iOS and Google Android. |
| **Business Card**| Compact vCard 3.0 | Lightweight corporate identity payload for high scannability. |
| **Crypto** | `bitcoin:addr?amount=...` | Bitcoin (BTC), Ethereum (ETH), Solana (SOL), and USDT addresses with optional amounts. |
| **Secret (AES)**| `qrhub://secret?enc=...` | 256-bit AES-GCM encrypted payload, decryptable only with the matching password. |

---

## 7. Advanced Tools & Special Functionalities

### 📊 Bulk & CSV Batch QR Generator
* **Input Options:** Upload `.csv` spreadsheet or paste raw text lists up to 100 entries.
* **Customization:** Unified brand color pickers and Error Correction selector applied across all generated codes.
* **Batch Export:** Sequential automated download of every QR code as a lossless vector SVG (`qr-code-1.svg`, `qr-code-2.svg`, etc.).
* **100% In-Browser:** Processing runs purely on client memory; large lists are never transmitted to external APIs.

---

### 🖨️ Print-Ready Layout Presets & Print Modal
Accessible directly from the Studio via the **"Print Sheet"** button:
1. **Table Tent / Menu Stand:**
   - 2-sided foldable tent layout designed for restaurant tables, bar counters, and hotel check-in desks.
   - Customizable promotional headline (*"SCAN WITH CAMERA"*) and explanatory subtext.
2. **Business Card Preset:**
   - Standard 3.5" x 2" dimensions with centered high-contrast QR code and cardholder details.
3. **Sticker Grid (12-Up Sheet):**
   - Full A4 / US-Letter sheet containing 12 repeatable scannable labels with dashed cut lines for commercial printing.
4. **CSS Print Media Engine:**
   - Uses `@media print` stylesheets to eliminate browser chrome, headers, and footers, sending pure vector artwork to the printer.

---

### 📁 Browser Local History & Folder Organization
* **Automatic Storage:** Every time a user downloads or copies a QR code, it is saved into `localStorage`.
* **Folder Tags:** Categorize codes into folders (`General`, `Marketing`, `Operations`, `Personal`, `Event`).
* **Instant Recall:** One-click "Open Studio" button restores the complete payload and settings for editing.
* **JSON Portability:** Export your entire history as a JSON backup file or import existing backups across devices.

---

### 📐 Tested Industry Templates Library
Pre-configured, high-scannability configurations for real-world scenarios:
* **Restaurant Digital Menu:** Warm terracotta theme, High ECC (30%), table-tent scannability.
* **Guest Wi-Fi Access:** Deep indigo theme with embedded Wi-Fi glyph and WPA2 security.
* **Executive vCard:** Emerald green card with complete professional contact schema.
* **WhatsApp Support Desk:** WhatsApp green theme with automated inquiry greeting.
* **Crypto Donation Point:** Bitcoin amber theme with pre-filled Satoshi receiver address.
* **Event Pass Check-in:** Royal purple theme with iCalendar timestamp schema.

---

### 👁️ Real-Time WCAG Contrast & Scannability Health Engine
* Calculates relative luminance of foreground and background colors using the standard WCAG 2.1 algorithm:
  $$L = 0.2126 \cdot R + 0.7152 \cdot G + 0.0722 \cdot B$$
* **Contrast Levels:**
  - **Ratio ≥ 7:1:** `Optimal Scannability` (High contrast, guaranteed fast scanning across all cameras).
  - **Ratio 4.5:1 – 6.9:1:** `Standard Scannability` (Good for daylight scanning).
  - **Ratio < 4.5:1:** `Scannability Warning` (Alerts the user that mobile cameras may struggle to read the code).

---

### 🔐 Encrypted Secret QR Code Engine (AES-GCM)
* Allows users to encode private messages, passwords, or recovery seeds into a QR code.
* Uses the browser’s native `window.crypto.subtle` API to generate a cryptographic key using PBKDF2 with SHA-256 and encrypts the payload via **AES-GCM 256-bit**.
* Scanning or pasting the encrypted payload into QRHub prompts for the password to decrypt the secret in-memory.

---

### 📩 Direct Contact Delivery & Lead Management
* **Zero Third-Party Dependency:** Works without local SMTP configurations.
* **FormSubmit HTTP Gateway:** Direct dispatch to:
  - Primary: `m.quddous7172@gmail.com`
  - CC: `m.quddous7271@gmail.com`
* **Local Lead Vault:** Submissions are also saved to `leads.json` on the server disk for administrative audit and review.
* **One-Time Verification:** FormSubmit verifies the email address on first submission via an activation link, ensuring reliable spam-free delivery.

---

## 8. QR Customization Studio Engine

The Customization Studio provides 4 specialized tabs:

### 1. Design Tab
* **Canvas Sizing:** Slider from 128px to 1024px for live responsive preview.
* **Quiet Zone Margin:** Toggle quiet margin on/off, with customizable margin thickness slider (0 to 8 units).
* **Error Correction Level (ECC):**
  - **L (Low - 7%):** Highest data density; recommended for raw text without logos.
  - **M (Medium - 15%):** Default industry balance between density and scannability.
  - **Q (Quarter - 25%):** Recommended when using small center emblems.
  - **H (High - 30%):** Maximum recovery; auto-selected when uploading logos.

### 2. Colors Tab
* **Foreground & Background Color Pickers:** Native browser color swatch + manual Hex code input.
* **Curated Palette Presets:** 8 designer themes (Midnight Navy, Slate Minimal, Emerald Forest, Royal Indigo, Crimson Luxury, Sunset Amber, Cyber Neon, Clean White).
* **Contrast Status Badge:** Live scannability rating.

### 3. Logo Tab
* **Curated Preset Icons:** One-click integration of popular brand icons (WhatsApp, Wi-Fi, Instagram, Twitter/X, YouTube, LinkedIn, GitHub, Bitcoin, Ethereum).
* **Custom Logo Upload:** Upload PNG, JPG, or SVG logos from your computer.
* **Automatic ECC Upgrade:** Automatically shifts error correction to High (30%) upon adding a logo to guarantee camera decodability.
* **Logo Dimensions:** Slider to adjust emblem width and height (24px to 64px) with centered excavation.

### 4. Advanced Tab
* Custom file naming.
* Direct payload inspection and schema validation.

---

## 9. Export & Download Manager

| Format | Category | Resolution / Output | Recommended Use Case |
| :--- | :--- | :--- | :--- |
| **PNG** | Raster | 512px, 1024px, 2048px | Digital websites, presentations, mobile apps, social media. |
| **JPG** | Raster | 512px, 1024px, 2048px | Lightweight web graphics, email attachments. |
| **SVG** | Vector | Scalable XML | Commercial billboard printing, vehicle wraps, Illustrator/Figma vector editing. |
| **WebP** | Modern Raster | 512px, 1024px, 2048px | High-compression, lightweight modern web deployment. |
| **PDF** | Vector Document | High-DPI Vector Stream | Single-page print delivery for print shops, flyers, brochures. |

### Additional Export Features:
* **One-Click Copy:** Copies the PNG blob directly to the OS clipboard for pasting into Photoshop, Figma, or Word.
* **Web Share API:** Direct share sheet on supported mobile and tablet devices.
* **Resolution Multipliers:** Standard 1x (512px), High-Res 2x (1024px), and Ultra HD 4x (2048px).

---

## 10. Design System, Aesthetics & Theme Switching

* **Color System:** Dynamic CSS HSL color tokens supporting seamless Light Mode and Dark Mode.
* **Card3D Component:** Subtle mouse-tracking 3D tilt effect on interactive marketing cards.
* **ShinyAnimatedIconBox:** Animated glassmorphism icon containers with rotating gradient borders and radial glow.
* **Micro-Animations:** Powered by `framer-motion` for smooth drawer reveals, accordion expands, and button feedback.
* **Responsive Layout:** Grid layout that adapts gracefully from 320px mobile screens up to 4K ultra-wide monitors.

---

## 11. SEO & Social Metadata Architecture

Every page in QRHub automatically injects comprehensive metadata via the `SEO.jsx` component:
* **Canonical URLs:** Prevents duplicate content indexing.
* **Title & Meta Descriptions:** Tailored for keyword targets (e.g., *"Free Wi-Fi QR Code Generator"*, *"Batch QR Generator"*).
* **OpenGraph Tags:** `og:title`, `og:description`, `og:image`, `og:type` for link previews on WhatsApp, Twitter, Slack, and Facebook.
* **Structured Data (JSON-LD):** Schema.org `WebApplication` markup declaring name, category, operating system, and free access.
* **Crawlability:** Fully crawlable HTML Sitemap available at `/sitemap`.

---

## 12. PWA (Progressive Web App) & Offline Reliability

* **Web App Manifest (`manifest.json`):** Defines standalone app mode, start URL, theme colors, and icons for "Add to Home Screen" installation on iOS, Android, and Windows.
* **Service Worker (`sw.js` v1.1):**
  - Caches static CSS, JS, fonts, and icons for instant subsequent loads.
  - Safe error recovery returning valid fallback responses to prevent console errors.
  - Completely bypasses `/api/` requests so dynamic server functionality is never blocked.
  - Allows full QR generation and vector export even when the user is disconnected from the internet.

---

## 13. Local Development & Running Instructions

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Running Locally

1. Open your terminal in the project root:
   ```powershell
   cd c:\Users\mqudd\Downloads\qr-saas
   ```

2. Start the local server:
   ```powershell
   npm run dev
   ```

3. The server starts with the following banner:
   ```text
   ==================================================
     🚀 QR SaaS Application is running locally!
     👉 URL:  http://localhost:5173
   ==================================================
   ```

4. Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### Available Scripts:
* `npm run dev` — Starts the native local web server on port `5173`.
* `npm run start` — Alias for `npm run dev`.
* `npm run build` — Rebuilds the frontend bundle (`npm --prefix apps/web run build`).
* `npm run preview` — Previews the production build via `server.js`.
