/**
 * QR Code download utilities.
 * Exports PNG, JPG, SVG, WebP, and PDF formats client-side.
 */

/** Find the QR canvas or SVG inside the preview container */
function getQRCanvas() {
  return document.querySelector('#qr-code-canvas canvas') ||
         document.querySelector('#qr-preview canvas') ||
         document.querySelector('canvas');
}
function getQRSvg() {
  return document.querySelector('#qr-code-canvas svg') ||
         document.querySelector('#qr-preview svg') ||
         document.querySelector('.qr-preview-container svg');
}

/** Convert SVG element to a data URL */
function svgToDataUrl(svg) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svg);
  const encoded = encodeURIComponent(svgStr);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

/** Draw QR to an offscreen canvas at target size, return canvas */
async function renderToCanvas(targetSize = 1024, bgColor = '#ffffff') {
  const canvas = getQRCanvas();
  const svg = getQRSvg();

  const offscreen = document.createElement('canvas');
  offscreen.width = targetSize;
  offscreen.height = targetSize;
  const ctx = offscreen.getContext('2d');

  // Fill background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, targetSize, targetSize);

  if (canvas) {
    ctx.drawImage(canvas, 0, 0, targetSize, targetSize);
    return offscreen;
  }

  if (svg) {
    const dataUrl = svgToDataUrl(svg);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, targetSize, targetSize);
        resolve(offscreen);
      };
      img.onerror = () => reject(new Error('Failed to render SVG'));
      img.src = dataUrl;
    });
  }

  throw new Error('No QR code found to export.');
}

/** Trigger browser download */
function triggerDownload(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Download as PNG */
export async function downloadPNG(filename = 'qrcode', size = 1024) {
  const canvas = await renderToCanvas(size);
  triggerDownload(canvas.toDataURL('image/png'), `${filename}.png`);
}

/** Download as JPG */
export async function downloadJPG(filename = 'qrcode', size = 1024, quality = 0.95) {
  const canvas = await renderToCanvas(size, '#ffffff');
  triggerDownload(canvas.toDataURL('image/jpeg', quality), `${filename}.jpg`);
}

/** Download as WebP */
export async function downloadWebP(filename = 'qrcode', size = 1024, quality = 0.95) {
  const canvas = await renderToCanvas(size);
  triggerDownload(canvas.toDataURL('image/webp', quality), `${filename}.webp`);
}

/** Download as SVG */
export function downloadSVG(filename = 'qrcode', bgColor) {
  const svg = getQRSvg();
  if (!svg) {
    throw new Error('SVG export requires SVG rendering mode. Try PNG instead.');
  }

  // Detect background color from container if not passed
  let resolvedBg = bgColor;
  if (!resolvedBg) {
    const parent = svg.parentElement;
    if (parent && parent.style && parent.style.background) {
      resolvedBg = parent.style.background;
    } else {
      resolvedBg = '#ffffff';
    }
  }

  // Clone SVG node to prevent modifying live DOM
  const clone = svg.cloneNode(true);
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  // Ensure explicit vector dimensions
  clone.setAttribute('width', '1024');
  clone.setAttribute('height', '1024');

  // Insert solid background rectangle so SVG is not transparent
  const existingRect = clone.querySelector('rect');
  if (!existingRect || existingRect.getAttribute('width') !== '100%') {
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', resolvedBg);
    clone.insertBefore(bgRect, clone.firstChild);
  }

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(clone);
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${filename}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Download as PDF (single page, A4) */
export async function downloadPDF(filename = 'qrcode', size = 1024) {
  const canvas = await renderToCanvas(size);
  const imgData = canvas.toDataURL('image/png');

  // Build minimal PDF manually (no jsPDF dependency needed)
  // A4 at 72dpi: 595 x 842 points
  const pageW = 595;
  const pageH = 842;
  const margin = 80;
  const qrSize = pageW - margin * 2;
  const qrX = margin;
  const qrY = (pageH - qrSize) / 2;

  // Embed as a Data URI in a hidden iframe and print
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>QR Code</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { size: A4; margin: 0; }
  body { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    min-height: 100vh;
    background: white;
  }
  img { 
    width: ${qrSize}pt; 
    height: ${qrSize}pt; 
    image-rendering: pixelated;
  }
</style>
</head>
<body>
  <img src="${imgData}" alt="QR Code" />
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
      URL.revokeObjectURL(url);
    }, 2000);
  };
}

/** Copy QR image to clipboard */
export async function copyToClipboard(size = 512) {
  if (!navigator.clipboard?.write) {
    throw new Error('Clipboard API not supported in this browser.');
  }
  const canvas = await renderToCanvas(size);
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        resolve();
      } catch (err) {
        reject(new Error('Failed to copy to clipboard: ' + err.message));
      }
    }, 'image/png');
  });
}

/**
 * Master download dispatcher.
 * @param {string} format - 'png' | 'jpg' | 'svg' | 'webp' | 'pdf'
 * @param {string} filename
 * @param {number} size
 */
export async function downloadQRCode(format = 'png', filename = 'qrcode', size = 1024) {
  switch (format) {
    case 'png':  return downloadPNG(filename, size);
    case 'jpg':  return downloadJPG(filename, size);
    case 'webp': return downloadWebP(filename, size);
    case 'svg':  return downloadSVG(filename);
    case 'pdf':  return downloadPDF(filename, size);
    default:     return downloadPNG(filename, size);
  }
}
