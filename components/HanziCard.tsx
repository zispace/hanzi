'use client'

import { Volume2 } from 'lucide-react'
import { HanziItem, safeValue, speakText, tagMapping } from '@/lib/types'

interface HanziCardProps {
  hanzi: HanziItem
  showTags?: boolean
  showStrokeCount?: boolean
  showRadical?: boolean
  showLevel?: boolean
  showGroup?: boolean
  showPinyin?: boolean
  showBothForms?: boolean
  compact?: boolean
  onClick?: () => void
}

export default function HanziCard({
  hanzi,
  showTags = true,
  showStrokeCount = true,
  showRadical = true,
  showLevel = false,
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
      {!compact && (showLevel || showTags) && (
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {showTags && hanzi.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {hanzi.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="inline-block px-1 py-0.5 text-xs rounded bg-secondary text-muted border border-primary"
                  title={tagMapping[tag] || tag}
                >
                  {tag}
                </span>
              ))}
              {hanzi.tags.length > 2 && (
                <span className="text-xs text-muted">+{hanzi.tags.length - 2}</span>
              )}
            </div>
          )}
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
              <div className="">{safeValue(hanzi.trad)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs mb-1">简体</div>
              <div className="">{safeValue(hanzi.simp)}</div>
            </div>
          </div>
        )}
        
        {showPinyin && (
          <div className="mb-2">{safeValue(hanzi.pinyin)}</div>
        )}
        
        {(showStrokeCount || showRadical) && (
          <div className="flex justify-center gap-4 text-xs text-muted mb-2">
            {showStrokeCount && (
              <span>笔画: {hanzi.strokeCount}</span>
            )}
            {showRadical && hanzi.radical && (
              <span>部首: {hanzi.radical}</span>
            )}
          </div>
        )}
        
        {showGroup && (
          <div className="text-xs">{safeValue(hanzi.group)}</div>
        )}
        
        {showTags && hanzi.tags.length > 0 && !compact && (
          <div className="mt-2 flex flex-wrap gap-1 justify-center">
            {hanzi.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-block px-1 py-0.5 text-xs rounded bg-secondary text-muted border border-primary"
                title={tagMapping[tag] || tag}
              >
                {tag}
              </span>
            ))}
            {hanzi.tags.length > 3 && (
              <span className="text-xs text-muted">+{hanzi.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
