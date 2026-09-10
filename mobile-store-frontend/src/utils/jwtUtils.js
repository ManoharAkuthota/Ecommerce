/**
 * JWT Utilities
 * Module: utils/jwtUtils.js
 * 
 * Provides client-side decoding and validation for JSON Web Tokens.
 * NOTE: As per security specifications, cryptographic signature verification
 * is performed strictly on the Spring Boot backend; frontend only inspects
 * payload claims and expiration timestamps.
 */

/**
 * Decodes the payload segment of a JWT token string.
 * Uses URL-safe Base64 decoding with full Unicode character support.
 * 
 * @param {string} token - The raw JWT token string
 * @returns {Object|null} The parsed JSON payload or null if invalid
 */
export const decodeToken = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Support UTF-8 multi-byte characters decoded from Base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (err) {
    if (import.meta?.env?.DEV) {
      console.warn('Failed to decode JWT payload:', err);
    }
    return null;
  }
};

/**
 * Extracts the token expiration Date object.
 * 
 * @param {string} token - The raw JWT token
 * @returns {Date|null} Expiration Date or null if not found
 */
export const getTokenExpiration = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return null;
  }
  return new Date(payload.exp * 1000);
};

/**
 * Checks whether a given JWT token has expired or is invalid.
 * 
 * @param {string} token - The raw JWT token
 * @param {number} [bufferSeconds=0] - Optional buffer window in seconds
 * @returns {boolean} True if expired or invalid, false if currently valid
 */
export const isTokenExpired = (token, bufferSeconds = 0) => {
  if (!token) {
    return true;
  }

  const payload = decodeToken(token);
  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= payload.exp - bufferSeconds;
};

/**
 * Validates that a token exists, can be parsed, and is not expired.
 * 
 * @param {string} token
 * @returns {boolean}
 */
export const hasValidToken = (token) => {
  return Boolean(token && !isTokenExpired(token));
};

/**
 * Extracts the subject (username/email) claim from the token.
 * 
 * @param {string} token
 * @returns {string|null}
 */
export const extractUsername = (token) => {
  const payload = decodeToken(token);
  return payload?.sub || null;
};

/**
 * Returns all claims stored in the token payload.
 * 
 * @param {string} token
 * @returns {Object|null}
 */
export const extractTokenClaims = (token) => {
  return decodeToken(token);
};

export default {
  decodeToken,
  getTokenExpiration,
  isTokenExpired,
  hasValidToken,
  extractUsername,
  extractTokenClaims,
};
