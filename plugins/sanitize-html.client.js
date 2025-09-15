import DOMPurify from 'dompurify'
import { marked } from 'marked'

export default defineNuxtPlugin((nuxtApp) => {
  // Configure marked for markdown parsing
  marked.setOptions({
    breaks: true,
    gfm: true,
  })

  // DOMPurify configuration (same as your makeHtml.js)
  const sanitizeConfig = {
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
  }

  // Helper function to sanitize content
  const sanitizeContent = (content) => {
    if (!content) return ''

    // Parse markdown to HTML
    const html = marked.parse(content)

    // Sanitize with DOMPurify
    return DOMPurify.sanitize(html, sanitizeConfig)
  }

  // Register the directive
  nuxtApp.vueApp.directive('sanitize-html', {
    mounted(el, binding) {
      const content = binding.value
      el.innerHTML = sanitizeContent(content)
    },
    updated(el, binding) {
      const content = binding.value
      el.innerHTML = sanitizeContent(content)
    },
  })
})
