// GET /api/fetch-title - Fetch page title from URL

// Function to analyze if a page has meaningful content
function analyzeContentQuality(html, title, url) {
  // Check for generic/empty titles that indicate no meaningful content
  const genericTitles = [
    'untitled',
    'loading...',
    'please wait',
    'redirecting',
    'error',
    'not found',
    'access denied',
    'forbidden',
    'unauthorized',
  ]

  const lowerTitle = (title || '').toLowerCase().trim()

  // If title is generic, likely no meaningful content
  if (genericTitles.includes(lowerTitle)) {
    return false
  }

  // Check for Google Share links and similar redirect/loading pages
  // These are specific patterns that indicate redirect/loading pages
  if (lowerTitle === 'google') {
    // Google Share/redirect patterns that typically have no meaningful content
    if (
      url.includes('google.com/webhp') ||
      url.includes('google.com/url') ||
      url.includes('drive.google.com') ||
      url.includes('docs.google.com') ||
      url.includes('sheets.google.com') ||
      url.includes('slides.google.com')
    ) {
      return false
    }
    // Main Google homepage and other Google services should be considered as having content
  }

  // Check for minimal content indicators
  const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is)
  if (bodyMatch) {
    const bodyContent = bodyMatch[1]

    // Remove script and style tags to get actual content
    const textContent = bodyContent
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<style[^>]*>.*?<\/style>/gis, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // If very little text content, likely no meaningful content
    if (textContent.length < 50) {
      return false
    }

    // Check for common "no content" indicators
    const noContentIndicators = [
      'loading',
      'please wait',
      'redirecting',
      'javascript required',
      'enable javascript',
      'this page requires javascript',
      'content loading',
      'please enable javascript',
    ]

    const lowerContent = textContent.toLowerCase()
    for (const indicator of noContentIndicators) {
      if (lowerContent.includes(indicator)) {
        return false
      }
    }
  }

  // If we get here, assume the page has meaningful content
  return true
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const url = query.url

    if (!url) {
      throw createError({
        statusCode: 400,
        statusMessage: 'URL parameter is required',
      })
    }

    // Validate URL
    try {
      new URL(url)
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid URL format',
      })
    }

    // Fetch the page content
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobBoardBot/1.0)',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        Connection: 'keep-alive',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch page: ${response.statusText}`,
      })
    }

    const html = await response.text()

    // Extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : null

    // Clean up the title
    let cleanTitle = title
    if (cleanTitle) {
      // Remove common suffixes
      cleanTitle = cleanTitle
        .replace(
          /\s*-\s*(LinkedIn|Indeed|Glassdoor|Monster|ZipRecruiter|AngelList|RemoteOK|We Work Remotely).*$/i,
          ''
        )
        .replace(
          /\s*\|\s*(LinkedIn|Indeed|Glassdoor|Monster|ZipRecruiter|AngelList|RemoteOK|We Work Remotely).*$/i,
          ''
        )
        .replace(
          /\s*:\s*(LinkedIn|Indeed|Glassdoor|Monster|ZipRecruiter|AngelList|RemoteOK|We Work Remotely).*$/i,
          ''
        )
        .trim()
    }

    // Analyze content quality to determine if page has meaningful content
    const hasContent = analyzeContentQuality(html, cleanTitle, url)

    return {
      success: true,
      title: cleanTitle || 'Untitled',
      originalTitle: title,
      url: url,
      hasContent: hasContent,
    }
  } catch (error) {
    // Suppress verbose error logging - URL fetch failures are normal
    // Only log critical server errors in development
    if (process.env.NODE_ENV === 'development' && error.statusCode >= 500) {
      console.warn(
        'Server error fetching page title for:',
        url,
        '-',
        error.message
      )
    }

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch page title',
      data: {
        error: error.message,
      },
    })
  }
})
