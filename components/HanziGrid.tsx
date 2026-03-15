'use client'

import { HanziItem } from '@/lib/types'
import HanziCard from './HanziCard'

interface HanziGridProps {
  data: HanziItem[]
  columns?: number
  compact?: boolean
  showTags?: boolean
  showStrokeCount?: boolean
  showRadical?: boolean
  showLevel?: boolean
  showGroup?: boolean
  showPinyin?: boolean
  showBothForms?: boolean
  onCardClick?: (hanzi: HanziItem) => void
}

export default function HanziGrid({
  data,
  columns = 4,
  compact = false,
  showTags = true,
  showStrokeCount = true,
  showRadical = true,
  showLevel = false,
  showGroup = true,
  showPinyin = true,
  showBothForms = true,
  onCardClick
}: HanziGridProps) {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
  }

  return (
    <div className={`grid ${gridColsClass[columns as keyof typeof gridColsClass] || gridColsClass[4]} gap-6`}>
      {data.map((hanzi) => (
        <HanziCard
          key={hanzi.char}
          hanzi={hanzi}
          compact={compact}
          showTags={showTags}
          showStrokeCount={showStrokeCount}
          showRadical={showRadical}
          showLevel={showLevel}
          showGroup={showGroup}
          showPinyin={showPinyin}
          showBothForms={showBothForms}
          onClick={() => onCardClick?.(hanzi)}
        />
      ))}
    </div>
  )
}
