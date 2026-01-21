/**
 * Simple JWT implementation for Cloudflare Workers
 * Uses Web Crypto API for signing and verification
 */

/**
 * Create a JWT token
 * @param {object} payload - Data to include in token
 * @param {string} secret - Secret key for signing
 * @param {number} expiresIn - Expiration time in seconds (default: 24 hours)
 * @returns {Promise<string>} JWT token
 */
export async function createJWT(payload, secret, expiresIn = 86400) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresIn;

  const fullPayload = {
    ...payload,
    iat: now,
    exp: exp
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  // Create signature
  const signature = await sign(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @param {string} secret - Secret key for verification
 * @returns {Promise<object|null>} Decoded payload or null if invalid
 */
export async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // Verify signature
    const expectedSignature = await sign(`${encodedHeader}.${encodedPayload}`, secret);
    if (signature !== expectedSignature) {
      return null;
    }

    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Token expired
    }

    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Sign data using HMAC-SHA256
 * @param {string} data - Data to sign
 * @param {string} secret - Secret key
 * @returns {Promise<string>} Base64url encoded signature
 */
async function sign(data, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  return base64UrlEncode(signature);
}

/**
 * Base64url encode
 */
function base64UrlEncode(data) {
  let str;
  if (typeof data === 'string') {
    str = btoa(unescape(encodeURIComponent(data)));
  } else if (data instanceof ArrayBuffer) {
    str = btoa(String.fromCharCode(...new Uint8Array(data)));
  } else {
    throw new Error('Unsupported data type');
  }
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64url decode
 */
function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' to make length multiple of 4
  while (str.length % 4 !== 0) {
    str += '=';
  }
  return decodeURIComponent(escape(atob(str)));
}
