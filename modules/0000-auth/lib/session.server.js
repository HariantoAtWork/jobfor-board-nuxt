import { getServerSession as getProxiedSession } from './sessionForwarding.server.js'

// Re-export the enhanced session getter
export { getProxiedSession as getServerSession }
