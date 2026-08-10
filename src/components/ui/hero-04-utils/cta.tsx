import * as React from 'react'
import Link from 'next/link'

import { Button, type ButtonProps } from '@/components/ui/button'

export interface CtaProps {
  ctaEnabled?: boolean
  text: string
  link: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
}

/**
 * A call-to-action that renders a shadcn Button as a link.
 * Internal (relative) links use next/link; external links fall back to <a>.
 */
export function Cta({ cta }: Readonly<{ cta: CtaProps }>) {
  const { text, link, variant = 'default', size = 'default' } = cta
  const href = link && link.length > 0 ? link : '#'
  const isExternal = /^https?:\/\//i.test(href)

  return (
    <Button asChild variant={variant} size={size}>
      {isExternal ? (
        <a href={href} target="_blank" rel="noreferrer noopener">
          {text}
        </a>
      ) : (
        <Link href={href}>{text}</Link>
      )}
    </Button>
  )
}

export default Cta
