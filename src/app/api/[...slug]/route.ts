import { getPayload } from 'payload'
import config from '../../../payload.config'
import { NextRequest } from 'next/server'

export const GET = async (req: NextRequest) => {
  const payload = await getPayload({ config })
  return payload(req)
}

export const POST = async (req: NextRequest) => {
  const payload = await getPayload({ config })
  return payload(req)
}
