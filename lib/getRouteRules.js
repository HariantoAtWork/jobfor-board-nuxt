/**
 * Generate Better Auth route rules based on environment configuration
 * @returns {Object} Route rules object or empty object if no proxy URL is configured
 */
function getBetterAuthRouteRules() {
  const proxyUrl = process.env.BETTER_AUTH_PROXY_URL

  if (!proxyUrl) {
    console.log(
      'BETTER_AUTH_PROXY_URL not defined, using default auth configuration'
    )
    return {}
  }

  console.log(`Using Better Auth proxy URL: ${proxyUrl}`)

  return {
    '/api/auth/**': {
      proxy: `${proxyUrl}/api/auth/**`,
    },
  }
}

const getRouteRules = () => ({
  routeRules: {
    ...getBetterAuthRouteRules(),
  },
})

export default getRouteRules
