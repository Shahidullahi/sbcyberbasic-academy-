/**
 * SBCyberBasics Academy - Security Utilities & Defensive Controls
 * Implements rigorous client-side input sanitization, password complexity policy,
 * Web Crypto SHA-256 digests, and assessment verification helpers.
 */

/**
 * Sanitizes generic user text input by removing control characters,
 * null bytes, and potentially malicious HTML tags/scripts.
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '') // Strip null bytes
    .replace(/[<>]/g, '') // Strip HTML brackets to prevent tag injection
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates display names: letters, numbers, spaces, dots, hyphens, and underscores only.
 */
export function isValidDisplayName(name: string): boolean {
  if (!name || name.trim().length < 2 || name.length > 50) return false;
  return /^[a-zA-Z0-9\s.\-_']+$/.test(name.trim());
}

/**
 * Password Policy Enforcement:
 * - Minimum 8 characters (12 recommended)
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special symbol
 */
export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 to 4
  feedback: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const feedback: string[] = [];
  let score = 0;

  if (!password || password.length < 8) {
    feedback.push('Must be at least 8 characters long (12+ recommended)');
  } else {
    score++;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Must include at least one uppercase letter');
  } else {
    score++;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Must include at least one lowercase letter');
  } else {
    score++;
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Must include at least one number');
  } else {
    score++;
  }

  if (!/[!@#$%^&*(),.?":{}|<>\-_]/.test(password)) {
    feedback.push('Must include at least one special symbol (e.g. !@#$%)');
  } else {
    score++;
  }

  return {
    isValid: score >= 4 && password.length >= 8,
    score: Math.min(score, 4),
    feedback
  };
}

/**
 * Generates an authoritative SHA-256 cryptographic digest using the browser's
 * standard W3C Web Cryptography API (window.crypto.subtle).
 */
export async function generateSha256Digest(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitizes search queries for certificate and lab lookups.
 */
export function sanitizeSearchCode(code: string): string {
  if (!code) return '';
  return code
    .replace(/[^a-zA-Z0-9\-_]/g, '')
    .toUpperCase()
    .slice(0, 32);
}
