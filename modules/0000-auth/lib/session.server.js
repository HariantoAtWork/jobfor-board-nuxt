import { auth } from './auth.server.js'

export async function getServerSession(event) {
  try {
    const session = await auth.api.getSession({
      headers: getHeaders(event),
    })

    return session
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}
