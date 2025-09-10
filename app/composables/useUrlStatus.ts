import { ref, reactive } from 'vue'

export interface UrlStatus {
  isAlive: boolean | null // null = checking, true = alive, false = dead
  hasContent: boolean | null // null = unknown, true = has content, false = empty/no content
  title: string | null // Page title if available
  lastChecked: string | null // ISO date string
  isLoading: boolean
  error?: string // Error message if check failed
}

export function useUrlStatus() {
  const urlStatuses = reactive<Map<string, UrlStatus>>(new Map())

  // Check if a URL is alive and has content using existing fetch-title API
  const checkUrlStatus = async (url: string): Promise<{ isAlive: boolean; hasContent: boolean; title: string | null }> => {
    if (!url) return { isAlive: false, hasContent: false, title: null }

    try {
      // Set loading state
      urlStatuses.set(url, {
        isAlive: null,
        hasContent: null,
        title: null,
        lastChecked: null,
        isLoading: true
      })

      // Format URL properly
      const formattedUrl = formatUrl(url)
      
      // Use the existing fetch-title API endpoint which already handles:
      // - URL validation
      // - Proper headers and timeouts
      // - Content fetching and title extraction
      // - Error handling
      const response = await fetch(`/api/fetch-title?url=${encodeURIComponent(formattedUrl)}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // If we get here, the URL is alive and has content
      const isAlive = true
      const hasContent = data.title && data.title !== 'Untitled'
      const title = data.title || null
      
      // Update status
      urlStatuses.set(url, {
        isAlive,
        hasContent,
        title,
        lastChecked: new Date().toISOString(),
        isLoading: false
      })

      return { isAlive, hasContent, title }
    } catch (error) {
      console.warn(`URL check failed for ${url}:`, error)
      
      // Update status as dead
      urlStatuses.set(url, {
        isAlive: false,
        hasContent: false,
        title: null,
        lastChecked: new Date().toISOString(),
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      return { isAlive: false, hasContent: false, title: null }
    }
  }

  // Format URL with proper protocol
  const formatUrl = (url: string): string => {
    if (!url) return ''

    const link = url.trim()

    // If link already has a protocol, return as is
    if (link.match(/^https?:\/\//)) {
      return link
    }

    // If link starts with www., add https://
    if (link.startsWith('www.')) {
      return `https://${link}`
    }

    // For other cases, add https://
    return `https://${link}`
  }

  // Get status for a URL
  const getUrlStatus = (url: string): UrlStatus => {
    return urlStatuses.get(url) || {
      isAlive: null,
      hasContent: null,
      title: null,
      lastChecked: null,
      isLoading: false
    }
  }

  // Refresh URL status
  const refreshUrlStatus = async (url: string): Promise<{ isAlive: boolean; hasContent: boolean; title: string | null }> => {
    return await checkUrlStatus(url)
  }

  // Check multiple URLs
  const checkMultipleUrls = async (urls: string[]): Promise<Map<string, { isAlive: boolean; hasContent: boolean; title: string | null }>> => {
    const results = new Map<string, { isAlive: boolean; hasContent: boolean; title: string | null }>()
    
    // Check URLs in parallel
    const promises = urls.map(async (url) => {
      const result = await checkUrlStatus(url)
      results.set(url, result)
      return { url, ...result }
    })

    await Promise.all(promises)
    return results
  }

  return {
    urlStatuses,
    checkUrlStatus,
    getUrlStatus,
    refreshUrlStatus,
    checkMultipleUrls,
    formatUrl
  }
}
