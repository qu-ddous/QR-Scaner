/**
 * QRHub Message Crypto & Encoding Utilities
 * Provides zero-dependency, client-side AES-GCM encryption and URL-safe encoding.
 */

// Helper: Convert ArrayBuffer to URL-safe Base64
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Helper: Convert URL-safe Base64 to Uint8Array
function base64ToBuffer(base64) {
  let str = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Derive AES-GCM key from password and salt using PBKDF2
async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encodes a message payload (with optional password encryption).
 * @param {Object} payload - { text: string, title?: string, timestamp?: string }
 * @param {string} [password] - optional password
 * @returns {Promise<string>} URL-safe encoded string
 */
export async function encodeMessagePayload(payload, password = '') {
  const jsonStr = JSON.stringify({
    text: payload.text || '',
    title: payload.title || '',
    timestamp: payload.timestamp || new Date().toISOString(),
  });

  const enc = new TextEncoder();
  const plainBytes = enc.encode(jsonStr);

  if (password && password.trim()) {
    // Encrypted Mode: Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password.trim(), salt);

    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      plainBytes
    );

    const envelope = {
      v: 1,
      enc: true,
      s: bufferToBase64(salt),
      iv: bufferToBase64(iv),
      d: bufferToBase64(encryptedBuffer),
    };

    return bufferToBase64(enc.encode(JSON.stringify(envelope)));
  }

  // Unencrypted Mode: Simple base64url envelope
  const envelope = {
    v: 1,
    enc: false,
    d: bufferToBase64(plainBytes),
  };

  return bufferToBase64(enc.encode(JSON.stringify(envelope)));
}

/**
 * Inspects an encoded message string without decrypting.
 * @param {string} encodedStr
 * @returns {Object} { isEncrypted: boolean, envelope: Object }
 */
export function inspectMessagePayload(encodedStr) {
  try {
    const rawBytes = base64ToBuffer(encodedStr);
    const jsonStr = new TextDecoder().decode(rawBytes);
    const envelope = JSON.parse(jsonStr);
    return {
      isEncrypted: !!envelope.enc,
      envelope,
    };
  } catch (err) {
    throw new Error('Invalid or corrupted QRHub message link.');
  }
}

/**
 * Decodes and decrypts a message payload.
 * @param {string} encodedStr
 * @param {string} [password]
 * @returns {Promise<Object>} { text: string, title: string, timestamp: string, isEncrypted: boolean }
 */
export async function decodeMessagePayload(encodedStr, password = '') {
  const { isEncrypted, envelope } = inspectMessagePayload(encodedStr);

  if (!isEncrypted) {
    // Unencrypted
    const decryptedBytes = base64ToBuffer(envelope.d);
    const dataJson = new TextDecoder().decode(decryptedBytes);
    const data = JSON.parse(dataJson);
    return {
      text: data.text,
      title: data.title,
      timestamp: data.timestamp,
      isEncrypted: false,
    };
  }

  // Encrypted — password required
  if (!password) {
    throw new Error('PASSWORD_REQUIRED');
  }

  try {
    const salt = base64ToBuffer(envelope.s);
    const iv = base64ToBuffer(envelope.iv);
    const encryptedData = base64ToBuffer(envelope.d);

    const key = await deriveKey(password.trim(), salt);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedData
    );

    const dataJson = new TextDecoder().decode(decryptedBuffer);
    const data = JSON.parse(dataJson);
    return {
      text: data.text,
      title: data.title,
      timestamp: data.timestamp,
      isEncrypted: true,
    };
  } catch (err) {
    throw new Error('INCORRECT_PASSWORD');
  }
}
