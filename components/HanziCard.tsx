'use client'

import { Volume2 } from 'lucide-react'
import { HanziItem, getLevelColor, safeValue, speakText } from '@/lib/types'
import { colors, typography, utils } from '@/lib/design-system'

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
    ? "bg-[#FAF9F6] border border-[#E8E2D5] rounded-lg hover:border-[#DC143C] hover:shadow-soft transition-all duration-250 p-3 cursor-pointer"
    : "bg-[#FAF9F6] border border-[#E8E2D5] rounded-lg shadow-subtle hover:shadow-soft transition-all duration-250 p-6 relative group cursor-pointer"

  const charSize = compact ? "text-2xl" : "text-4xl"
  const formSize = compact ? "text-sm" : "text-lg"

  return (
    <div className={cardClass} onClick={onClick}>
      {!compact && showLevel && (
        <div className="absolute top-3 right-3">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#F5F2ED] text-[#5A5A5A] border border-[#E8E2D5]">
            {safeValue(hanzi.level)}
          </span>
        </div>
      )}
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          speakText(safeValue(hanzi.char))
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-250 p-2 bg-white rounded-full shadow-subtle hover:shadow-soft"
      >
        <Volume2 className="h-4 w-4 text-[#5A5A5A]" />
      </button>
      
      <div className="text-center">
        <div 
          className={`${charSize} font-bold text-[#DC143C] mb-3`}
          style={{ fontFamily: typography.fontFamily.serif.join(', ') }}
        >
          {safeValue(hanzi.char)}
        </div>
        
        {showBothForms && (
          <div className={`grid grid-cols-2 gap-2 mb-3 ${formSize}`} 
               style={{ fontFamily: typography.fontFamily.serif.join(', ') }}>
            <div className="text-center">
              <div className="text-xs text-[#9A9A9A] mb-1">繁体</div>
              <div className="text-[#1A1A1A]">{safeValue(hanzi.fanti)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-[#9A9A9A] mb-1">简体</div>
              <div className="text-[#1A1A1A]">{safeValue(hanzi.jianti)}</div>
            </div>
          </div>
        )}
        
        {showPinyin && (
          <div className="text-[#3A3A3A] mb-2 text-sm">{safeValue(hanzi.pinyin)}</div>
        )}
        
        {showGroup && (
          <div className="text-xs text-[#9A9A9A]">{safeValue(hanzi.group)}</div>
        )}
      </div>
    </div>
  )
}
