// ============================================================================
// DOM ROCKFELLER & ROCKFELLER CARROS — SECURITY & HARDENING MODULE
// Implements enterprise-grade cryptography, RBAC, Rate Limiting, Sanitization
// ============================================================================

import crypto from 'crypto';

// Server Secret for HMAC Token Signing
const JWT_SECRET = process.env.SESSION_SECRET || 'domrockfeller-ultra-secure-key-2026-vix-floripa-secret-token';

// ==================== 1. PASSWORD CRYPTOGRAPHY ====================

/**
 * Derives a cryptographic hash using Node.js native scrypt with unique salt
 */
export function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Senha inválida para hashing.');
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

/**
 * Verifies a password against a stored scrypt hash or legacy plaintext.
 * Returns { valid: boolean, needsUpgrade: boolean }
 */
export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return { valid: false, needsUpgrade: false };

  // Check if hash follows scrypt standard
  if (storedHash.startsWith('scrypt$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 3) return { valid: false, needsUpgrade: false };
    const salt = parts[1];
    const originalHash = parts[2];
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const isValid = crypto.timingSafeEqual(
      Buffer.from(originalHash, 'hex'),
      Buffer.from(derivedKey.toString('hex'), 'hex')
    );
    return { valid: isValid, needsUpgrade: false };
  }

  // Legacy plaintext fallback verification (and flag for auto-upgrade)
  if (password === storedHash) {
    return { valid: true, needsUpgrade: true };
  }

  return { valid: false, needsUpgrade: false };
}

// ==================== 2. CRYPTOGRAPHIC SESSION TOKENS ====================

/**
 * Creates a cryptographically signed HMAC token
 */
export function createToken(user, expiresInDays = 7) {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role, // 'admin' | 'funcionario' | 'cliente'
    cityUnit: user.cityUnit,
    exp: Date.now() + expiresInDays * 24 * 60 * 60 * 1000
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies and decodes HMAC token. Returns user payload or null
 */
export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadB64)
    .digest('base64url');

  if (signature.length !== expectedSignature.length) return null;

  const isValidSig = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!isValidSig) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// ==================== 3. RATE LIMITING ENGINE ====================

class MemoryRateLimiter {
  constructor(windowMs, maxRequests, name = 'RateLimiter') {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.name = name;
    this.hits = new Map();

    // Periodic sweep to prevent memory leaks
    setInterval(() => {
      const now = Date.now();
      for (const [ip, data] of this.hits.entries()) {
        if (now - data.startTime > this.windowMs) {
          this.hits.delete(ip);
        }
      }
    }, Math.max(30000, windowMs));
  }

  isLimited(ip) {
    const now = Date.now();
    const client = this.hits.get(ip) || { count: 0, startTime: now };

    if (now - client.startTime > this.windowMs) {
      client.count = 1;
      client.startTime = now;
      this.hits.set(ip, client);
      return false;
    }

    client.count++;
    this.hits.set(ip, client);

    return client.count > this.maxRequests;
  }

  reset(ip) {
    this.hits.delete(ip);
  }
}

export const authRateLimiter = new MemoryRateLimiter(15 * 60 * 1000, 10, 'Auth');
export const registerRateLimiter = new MemoryRateLimiter(60 * 60 * 1000, 6, 'Register');
export const leadRateLimiter = new MemoryRateLimiter(10 * 60 * 1000, 15, 'Leads');
export const chatRateLimiter = new MemoryRateLimiter(60 * 1000, 30, 'Chat');
export const globalRateLimiter = new MemoryRateLimiter(60 * 1000, 150, 'Global');

// ==================== 4. INPUT SANITIZATION ====================

/**
 * Sanitizes input strings against HTML injection, script tags, and control characters
 */
export function sanitizeString(val) {
  if (typeof val !== 'string') return val;

  return val
    .replace(/\0/g, '') // Strip null bytes
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Strip style tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Strip iframes
    .replace(/javascript:[^"']*/gi, '') // Strip javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Strip inline event handlers like onclick=, onerror=
    .replace(/[<>]/g, c => (c === '<' ? '&lt;' : '&gt;')) // Encode brackets
    .trim();
}

/**
 * Recursively sanitizes object properties
 */
export function sanitizeDeep(obj) {
  if (!obj || typeof obj !== 'object') {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeDeep(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Avoid prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    sanitized[key] = sanitizeDeep(value);
  }
  return sanitized;
}

// ==================== 5. SECURITY MIDDLEWARES ====================

/**
 * Security Headers (Helmet alternative, zero external dependencies)
 */
export function securityHeadersMiddleware(req, res, next) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent Clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // XSS Protection for legacy browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; media-src 'self' data: https: blob:; connect-src 'self' https://graph.facebook.com; frame-ancestors 'self';"
  );

  // Remove Express identification banner
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * Global rate limiter middleware
 */
export function globalRateLimiterMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  if (globalRateLimiter.isLimited(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Muitas requisições. Por favor, aguarde alguns instantes antes de tentar novamente.'
    });
  }
  next();
}

/**
 * Body sanitization middleware
 */
export function sanitizeBodyMiddleware(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeDeep(req.body);
  }
  next();
}

/**
 * Authenticate Token Middleware
 * Populates req.user if valid token exists
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  const user = verifyToken(token);
  req.user = user;
  next();
}

/**
 * Require valid authentication
 */
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Acesso não autorizado. Faça login para continuar.'
    });
  }
  next();
}

/**
 * Require specific roles
 */
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autorizado. Faça login para continuar.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acesso negado. Esta ação requer permissão de: ${allowedRoles.join(' ou ')}.`
      });
    }

    next();
  };
}
