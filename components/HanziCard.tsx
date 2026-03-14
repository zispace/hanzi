'use client'

import { Volume2 } from 'lucide-react'
import { HanziItem, safeValue, speakText } from '@/lib/types'

interface HanziCardProps {
  hanzi: HanziItem
  showLevel?: boolean
  showGroup?: boolean
  showPinyin?: boolean
  showBothForms?: boolean
  compact?: boolean
  onClick?: () => void
}

export default function HanziCard({
  hanzi,
  showLevel = true,
  showGroup = true,
  showPinyin = true,
  showBothForms = true,
  compact = false,
  onClick
}: HanziCardProps) {
  const cardClass = compact 
    ? "card p-3 cursor-pointer"
    : "card p-6 relative group cursor-pointer"

  const charSize = compact ? "text-2xl" : "text-4xl"
  const formSize = compact ? "text-sm" : "text-lg"

  return (
    <div className={cardClass} onClick={onClick}>
      {!compact && showLevel && (
        <div className="absolute top-3 right-3">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-muted border border-primary">
            {safeValue(hanzi.level)}
          </span>
        </div>
      )}
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          speakText(safeValue(hanzi.char))
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-250 p-2 bg-white rounded-full"
      >
        <Volume2 className="h-4 w-4" />
      </button>
      
      <div className="text-center">
        <div 
          className={`${charSize} hanzi hanzi-primary mb-3`}
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {safeValue(hanzi.char)}
        </div>
        
        {showBothForms && (
          <div className={`grid grid-cols-2 gap-2 mb-3 ${formSize}`} 
               style={{ fontFamily: 'var(--font-serif)' }}>
            <div className="text-center">
              <div className="text-xs mb-1">繁体</div>
              <div className="">{safeValue(hanzi.fanti)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs mb-1">简体</div>
              <div className="">{safeValue(hanzi.jianti)}</div>
            </div>
          </div>
        )}
        
        {showPinyin && (
          <div className=" mb-2 ">{safeValue(hanzi.pinyin)}</div>
        )}
        
        {showGroup && (
          <div className="text-xs">{safeValue(hanzi.group)}</div>
        )}
      </div>
    </div>
  )
}
