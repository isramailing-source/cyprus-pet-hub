import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Input validation and sanitization utilities
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: string;
}

// Common validation patterns
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{1,14}$/, // International phone format
  cyprusPhone: /^(\+357|00357)?\s?[0-9]{8}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  alphaNumeric: /^[a-zA-Z0-9\s-_.]+$/,
  price: /^\d+(\.\d{1,2})?$/,
  noScript: /<script[^>]*>.*?<\/script>/gi,
  noHTML: /<[^>]*>/g,
  sqlInjection: /('|(\-\-)|(;)|(\|)|(\*)|(%))/i,
  xssPatterns: /(javascript:|data:|vbscript:|on\w+\s*=)/i
};

// Sanitize HTML content to prevent XSS
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/&/g, '&amp;');
}

// Remove potentially dangerous characters for SQL injection prevention
export function sanitizeSql(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/'/g, "''")
    .replace(/"/g, '""')
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/\|/g, '');
}

// Validate and sanitize email
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }
  
  if (email.length > 254) {
    errors.push('Email is too long (max 254 characters)');
  }
  
  if (!PATTERNS.email.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (PATTERNS.xssPatterns.test(email)) {
    errors.push('Email contains invalid characters');
  }
  
  const sanitized = sanitizeHtml(email.toLowerCase().trim());
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

// Validate and sanitize phone number
export function validatePhone(phone: string, allowEmpty = true): ValidationResult {
  const errors: string[] = [];
  
  if (!phone) {
    if (!allowEmpty) {
      errors.push('Phone number is required');
    }
    return { isValid: allowEmpty, errors };
  }
  
  if (phone.length > 20) {
    errors.push('Phone number is too long');
  }
  
  // Remove common formatting characters for validation
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  
  if (!PATTERNS.phone.test(cleanPhone) && !PATTERNS.cyprusPhone.test(phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  if (PATTERNS.xssPatterns.test(phone)) {
    errors.push('Phone number contains invalid characters');
  }
  
  const sanitized = sanitizeHtml(phone.trim());
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

// Validate and sanitize text input
export function validateText(
  text: string, 
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    allowHtml?: boolean;
    pattern?: RegExp;
    fieldName?: string;
  } = {}
): ValidationResult {
  const {
    required = false,
    minLength = 0,
    maxLength = 1000,
    allowHtml = false,
    pattern,
    fieldName = 'Text'
  } = options;
  
  const errors: string[] = [];
  
  if (!text) {
    if (required) {
      errors.push(`${fieldName} is required`);
    }
    return { isValid: !required, errors };
  }
  
  if (text.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters`);
  }
  
  if (text.length > maxLength) {
    errors.push(`${fieldName} must be less than ${maxLength} characters`);
  }
  
  if (!allowHtml && PATTERNS.noHTML.test(text)) {
    errors.push(`${fieldName} cannot contain HTML tags`);
  }
  
  if (PATTERNS.sqlInjection.test(text)) {
    errors.push(`${fieldName} contains invalid characters`);
  }
  
  if (PATTERNS.xssPatterns.test(text)) {
    errors.push(`${fieldName} contains potentially dangerous content`);
  }
  
  if (pattern && !pattern.test(text)) {
    errors.push(`${fieldName} format is invalid`);
  }
  
  const sanitized = allowHtml ? text.trim() : sanitizeHtml(text.trim());
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

// Validate price
export function validatePrice(price: string, allowEmpty = true): ValidationResult {
  const errors: string[] = [];
  
  if (!price) {
    return { isValid: allowEmpty, errors: allowEmpty ? [] : ['Price is required'] };
  }
  
  if (!PATTERNS.price.test(price)) {
    errors.push('Please enter a valid price (e.g., 100.50)');
  }
  
  const numPrice = parseFloat(price);
  if (numPrice < 0) {
    errors.push('Price cannot be negative');
  }
  
  if (numPrice > 999999) {
    errors.push('Price is too high (max 999,999)');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: price.trim()
  };
}

// Validate URL
export function validateUrl(url: string, allowEmpty = true): ValidationResult {
  const errors: string[] = [];
  
  if (!url) {
    return { isValid: allowEmpty, errors: allowEmpty ? [] : ['URL is required'] };
  }
  
  if (!PATTERNS.url.test(url)) {
    errors.push('Please enter a valid URL starting with http:// or https://');
  }
  
  if (url.length > 2000) {
    errors.push('URL is too long (max 2000 characters)');
  }
  
  const sanitized = sanitizeHtml(url.trim());
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

// Comprehensive form validation
export function validateAdForm(data: {
  title: string;
  description: string;
  price?: string;
  location?: string;
  breed?: string;
  age?: string;
  gender?: string;
  phone?: string;
  email: string;
}): { isValid: boolean; errors: Record<string, string[]>; sanitized: Record<string, string> } {
  const errors: Record<string, string[]> = {};
  const sanitized: Record<string, string> = {};
  
  // Validate title
  const titleValidation = validateText(data.title, {
    required: true,
    minLength: 5,
    maxLength: 100,
    fieldName: 'Title'
  });
  if (!titleValidation.isValid) errors.title = titleValidation.errors;
  sanitized.title = titleValidation.sanitized || '';
  
  // Validate description
  const descValidation = validateText(data.description, {
    required: true,
    minLength: 20,
    maxLength: 2000,
    fieldName: 'Description'
  });
  if (!descValidation.isValid) errors.description = descValidation.errors;
  sanitized.description = descValidation.sanitized || '';
  
  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) errors.email = emailValidation.errors;
  sanitized.email = emailValidation.sanitized || '';
  
  // Validate optional fields
  if (data.price) {
    const priceValidation = validatePrice(data.price);
    if (!priceValidation.isValid) errors.price = priceValidation.errors;
    sanitized.price = priceValidation.sanitized || '';
  }
  
  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) errors.phone = phoneValidation.errors;
    sanitized.phone = phoneValidation.sanitized || '';
  }
  
  if (data.location) {
    const locationValidation = validateText(data.location, {
      maxLength: 100,
      fieldName: 'Location'
    });
    if (!locationValidation.isValid) errors.location = locationValidation.errors;
    sanitized.location = locationValidation.sanitized || '';
  }
  
  if (data.breed) {
    const breedValidation = validateText(data.breed, {
      maxLength: 50,
      pattern: PATTERNS.alphaNumeric,
      fieldName: 'Breed'
    });
    if (!breedValidation.isValid) errors.breed = breedValidation.errors;
    sanitized.breed = breedValidation.sanitized || '';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized
  };
}

// Search query validation
export function validateSearchQuery(query: string): ValidationResult {
  return validateText(query, {
    required: true,
    minLength: 1,
    maxLength: 100,
    fieldName: 'Search query'
  });
}

// Rate limiting helper
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    
    return true; // Request allowed
  };
}

// CSRF token validation helper
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validateCSRFToken(token: string, expected: string): boolean {
  if (!token || !expected) return false;
  return token === expected;
}
