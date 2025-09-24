import validator from 'validator';

/**
 * Security utility functions for safe URL handling and input sanitization
 */
export class SecurityUtils {
  
  /**
   * Safely encode URL parameters to prevent XSS
   * @param param - The parameter to encode
   * @returns Encoded parameter safe for URL use
   */
  static encodeURLParam(param: string): string {
    if (!param) return '';
    return encodeURIComponent(param.toString());
  }

  /**
   * Validate and sanitize username for URL usage
   * @param username - Username to validate
   * @returns Sanitized username or empty string if invalid
   */
  static sanitizeUsername(username: string): string {
    if (!username) return '';
    
    // Remove any potential XSS characters
    const sanitized = username.replace(/[<>\"'&]/g, '');
    
    // Validate it only contains safe characters
    if (validator.isAlphanumeric(sanitized.replace(/[._-]/g, ''), 'en-US')) {
      return this.encodeURLParam(sanitized);
    }
    
    return '';
  }

  /**
   * Safe navigation to prevent XSS via window.location
   * @param url - The URL to navigate to
   * @param baseUrl - Base URL to validate against (optional)
   */
  static safeNavigate(url: string, baseUrl?: string): void {
    if (!url) return;

    // Validate URL format
    if (!validator.isURL(url, { 
      protocols: ['http', 'https'],
      require_protocol: true,
      require_host: true 
    })) {
      console.error('Invalid URL provided for navigation:', url);
      return;
    }

    // If baseUrl is provided, ensure we're navigating within the same origin
    if (baseUrl) {
      try {
        const targetUrl = new URL(url);
        const baseUrlObj = new URL(baseUrl);
        
        if (targetUrl.origin !== baseUrlObj.origin) {
          console.error('Cross-origin navigation blocked for security:', url);
          return;
        }
      } catch (e) {
        console.error('Error validating URL:', e);
        return;
      }
    }

    window.location.href = url;
  }

  /**
   * Build safe URL with parameters
   * @param basePath - Base path of the URL
   * @param params - Parameters to append
   * @returns Safe URL string
   */
  static buildSafeURL(basePath: string, ...params: string[]): string {
    if (!basePath) return '';
    
    const encodedParams = params
      .filter(param => param !== null && param !== undefined)
      .map(param => this.encodeURLParam(param.toString()));
    
    return basePath + '/' + encodedParams.join('/');
  }

  /**
   * Validate that a string doesn't contain potential XSS payloads
   * @param input - Input to validate
   * @returns True if safe, false if potentially dangerous
   */
  static isXSSSafe(input: string): boolean {
    if (!input) return true;
    
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /expression\s*\(/i,
      /vbscript:/i
    ];

    return !dangerousPatterns.some(pattern => pattern.test(input));
  }
}