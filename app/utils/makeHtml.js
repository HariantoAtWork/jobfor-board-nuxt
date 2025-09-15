import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked for markdown parsing
marked.setOptions({
  breaks: true,
  gfm: true,
  // Don't use marked's sanitize - we'll use DOMPurify instead
})

// Safe HTML generation with DOMPurify
const makeHtml = (text) => {
  if (!text) return ''

  // Parse markdown to HTML
  const html = marked.parse(text)

  // Sanitize with DOMPurify for better security
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'b',
      'i',
      's',
      'strike',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    ALLOWED_ATTR: [
      'href',
      'title',
      'target',
      'rel',
      'src',
      'alt',
      'width',
      'height',
      'class',
      'id',
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
  })
}

export default makeHtml
