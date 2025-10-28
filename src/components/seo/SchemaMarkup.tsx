'use client'

import Script from 'next/script'
import { Organization, LocalBusiness, Course, FAQPage, WithContext } from 'schema-dts'

interface SchemaMarkupProps {
  schema: WithContext<Organization | LocalBusiness | Course | FAQPage> | WithContext<Organization | LocalBusiness | Course | FAQPage>[]
}

/**
 * Composant pour injecter les Schema Markup JSON-LD dans le DOM
 * Compatible avec Next.js App Router
 */
export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {schemas.map((s, index) => (
        <Script
          key={index}
          id={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(s),
          }}
        />
      ))}
    </>
  )
}
