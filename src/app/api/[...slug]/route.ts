/* THIS FILE WAS MODIFIED FOR VERCEL COMPATIBILITY */
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

import config from '@/payload.config'

// Note: Payload v3 with Next.js handles initialization automatically
// through the REST_* handlers. No manual initialization needed for Vercel.
// The handlers will connect to MongoDB on-demand when a request arrives.

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const DELETE = REST_DELETE(config)
export const OPTIONS = REST_OPTIONS(config)
