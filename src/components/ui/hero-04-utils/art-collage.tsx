import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ArtCollageProps {
  primaryImage: string
  secondaryImage: string
  primaryAlt?: string
  secondaryAlt?: string
  className?: string
}

/**
 * Two-image editorial collage: a large primary canvas with a smaller secondary
 * piece overlapping its lower corner. Gold hairline frames + soft shadows keep
 * it on-brand with the Lotus design system.
 */
export function ArtCollage({
  primaryImage,
  secondaryImage,
  primaryAlt = '',
  secondaryAlt = '',
  className,
}: Readonly<ArtCollageProps>) {
  return (
    <div className={cn('relative mx-auto aspect-square w-full max-w-lg', className)}>
      {/* Primary */}
      <div className="absolute inset-0 end-8 top-0 overflow-hidden rounded-2xl border border-gold/40 shadow-lift">
        <img
          src={primaryImage}
          alt={primaryAlt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Secondary — overlaps the lower/leading corner */}
      <div className="absolute bottom-0 start-0 aspect-[3/4] w-2/5 -translate-x-2 translate-y-6 overflow-hidden rounded-xl border border-gold/40 shadow-lift ring-1 ring-background">
        <img
          src={secondaryImage}
          alt={secondaryAlt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}

export default ArtCollage
