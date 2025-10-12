import { getPayload } from 'payload'
import config from './payload.config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as unknown as { payload: { client: any; promise: any } }).payload

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as unknown as { payload: { client: any; promise: any } }).payload = { client: null, promise: null }
}

export const getPayloadClient = async () => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayload({ config })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}
