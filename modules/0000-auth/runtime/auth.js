import { auth } from '../lib/auth.server'

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event))
})
