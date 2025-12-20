/**
 * HTML Sanitization Utility
 * Sanitizes HTML content from AI analysis to prevent XSS attacks
 */
import DOMPurify from 'dompurify'

/**
 * Sanitize HTML content for safe rendering
 * Only allows safe HTML tags: p, strong, ul, li
 *
 * @param html - Raw HTML string from API
 * @returns Sanitized HTML safe for rendering with dangerouslySetInnerHTML
 */
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'ul', 'li'],
    ALLOWED_ATTR: [],
  })
}
