import { ref, reactive } from 'vue'

export interface UrlStatus {
  isAlive: boolean | null // null = checking, true = alive, false = dead
  lastChecked: string | null // ISO date string
  isLoading: boolean
}

export function useUrlStatus() {
  const urlStatuses = reactive<Map<string, UrlStatus>>(new Map())

  // Check if a URL is alive
  const checkUrlStatus = async (url: string): Promise<boolean> => {
    if (!url) return false

    try {
      // Set loading state
      urlStatuses.set(url, {
        isAlive: null,
        lastChecked: null,
        isLoading: true
      })

      // Format URL properly
      const formattedUrl = formatUrl(url)
      
      // Use fetch with HEAD request to check if URL is accessible
      const response = await fetch(formattedUrl, {
        method: 'HEAD',
        mode: 'no-cors', // This allows checking cross-origin URLs
        cache: 'no-cache'
      })

      // For no-cors requests, we can't read the response status
      // If we get here without an error, the URL is likely alive
      const isAlive = true
      
      // Update status
      urlStatuses.set(url, {
        isAlive,
        lastChecked: new Date().toISOString(),
        isLoading: false
      })

      return isAlive
    } catch (error) {
      console.warn(`URL check failed for ${url}:`, error)
      
      // Update status as dead
      urlStatuses.set(url, {
        isAlive: false,
        lastChecked: new Date().toISOString(),
        isLoading: false
      })

      return false
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
      lastChecked: null,
      isLoading: false
    }
  }

  // Refresh URL status
  const refreshUrlStatus = async (url: string): Promise<boolean> => {
    return await checkUrlStatus(url)
  }

  // Check multiple URLs
  const checkMultipleUrls = async (urls: string[]): Promise<Map<string, boolean>> => {
    const results = new Map<string, boolean>()
    
    // Check URLs in parallel
    const promises = urls.map(async (url) => {
      const isAlive = await checkUrlStatus(url)
      results.set(url, isAlive)
      return { url, isAlive }
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
