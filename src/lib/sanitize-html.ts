import DOMPurify from 'dompurify'

export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'strong', 'ul', 'li'],
    ALLOWED_ATTR: [],
  })
}
