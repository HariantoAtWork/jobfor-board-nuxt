// GET /api/fetch-title - Fetch page title from URL
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

    return {
      success: true,
      title: cleanTitle || 'Untitled',
      originalTitle: title,
      url: url,
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
