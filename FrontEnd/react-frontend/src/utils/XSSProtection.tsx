import DOMPurify from 'dompurify';
import { encode } from 'he';

/**
 * XSS Protection Utilities
 * This module provides functions to safely handle user-generated content
 * and prevent Cross-Site Scripting (XSS) attacks.
 */

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML content to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // Configure DOMPurify to be more restrictive
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SANITIZE_DOM: true,
    SAFE_FOR_TEMPLATES: true
  });
};

/**
 * Escapes HTML entities to prevent XSS
 * @param text - The text to escape
 * @returns HTML entity escaped string
 */
export const escapeHTML = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return encode(text, {
    useNamedReferences: true,
    decimal: false
  });
};

/**
 * Strips all HTML tags from content
 * @param html - The HTML content to strip
 * @returns Plain text without HTML tags
 */
export const stripHTML = (html: string): string => {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // First sanitize, then strip all tags
  const sanitized = DOMPurify.sanitize(html, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  return sanitized;
};

/**
 * Validates and sanitizes URL to prevent JavaScript URLs
 * @param url - The URL to validate
 * @returns Safe URL or empty string if invalid
 */
export const sanitizeURL = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  // Remove any potential javascript: or data: URLs
  const lowercaseUrl = url.toLowerCase().trim();
  
  if (lowercaseUrl.startsWith('javascript:') || 
      lowercaseUrl.startsWith('data:') ||
      lowercaseUrl.startsWith('vbscript:') ||
      lowercaseUrl.startsWith('about:')) {
    return '';
  }
  
  // Allow only http, https, and relative URLs
  if (lowercaseUrl.startsWith('http://') || 
      lowercaseUrl.startsWith('https://') ||
      lowercaseUrl.startsWith('/') ||
      lowercaseUrl.startsWith('./') ||
      lowercaseUrl.startsWith('../')) {
    return url;
  }
  
  // If it doesn't start with a protocol, treat as relative
  if (!lowercaseUrl.includes(':')) {
    return url;
  }
  
  return '';
};

/**
 * React component to safely render user-generated content
 * Uses DOMPurify to sanitize HTML content before rendering
 */
export const SafeHTML: React.FC<{
  html: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}> = ({ html, className, tag: Tag = 'div' }) => {
  const sanitizedHTML = sanitizeHTML(html);
  
  return (
    <Tag 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

/**
 * React component to safely render plain text (escapes HTML)
 */
export const SafeText: React.FC<{
  text: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}> = ({ text, className, tag: Tag = 'span' }) => {
  const escapedText = escapeHTML(text);
  
  return (
    <Tag 
      className={className}
      dangerouslySetInnerHTML={{ __html: escapedText }}
    />
  );
};

/**
 * Hook to safely handle form input values
 */
export const useSafeInput = () => {
  const sanitizeInput = (value: string, allowHTML: boolean = false): string => {
    if (!value || typeof value !== 'string') {
      return '';
    }
    
    if (allowHTML) {
      return sanitizeHTML(value);
    }
    
    return escapeHTML(value);
  };
  
  return { sanitizeInput };
};
