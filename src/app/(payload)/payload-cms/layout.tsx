/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next'

import config from '@/payload.config'
import { RootLayout } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'

import { importMap } from './importMap'

type Args = {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Payload CMS - GestionMax',
  description: 'Administration Payload CMS',
  icons: '/favicon.ico',
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
