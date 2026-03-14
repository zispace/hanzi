'use client'

import { Volume2 } from 'lucide-react'
import { HanziItem, getLevelColor, safeValue, speakText } from '@/lib/types'

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
    ? "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-all hover:scale-105 p-3"
    : "bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 relative group"

  const charSize = compact ? "text-2xl" : "text-4xl"
  const formSize = compact ? "text-sm" : "text-lg"

  return (
    <div className={cardClass} onClick={onClick}>
      {!compact && showLevel && (
        <div className="absolute top-2 right-2">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getLevelColor(hanzi.level)}`}>
            {safeValue(hanzi.level)}
          </span>
        </div>
      )}
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          speakText(safeValue(hanzi.char))
        }}
        className={compact 
          ? "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white dark:bg-gray-600 rounded-full shadow-md"
          : "absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white dark:bg-gray-600 rounded-full shadow-md"
        }
      >
        <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </button>
      
      <div className="text-center">
        <div className={`${charSize} font-bold text-red-600 dark:text-red-500 mb-3`}>
          {safeValue(hanzi.char)}
        </div>
        
        {showBothForms && (
          <div className={`grid grid-cols-2 gap-2 mb-3 ${formSize} font-serif`}>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">繁体</div>
              <div className="text-gray-800 dark:text-gray-200">{safeValue(hanzi.fanti)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">简体</div>
              <div className="text-gray-800 dark:text-gray-200">{safeValue(hanzi.jianti)}</div>
            </div>
          </div>
        )}
        
        {showPinyin && (
          <div className="text-blue-600 dark:text-blue-400 mb-2">{safeValue(hanzi.pinyin)}</div>
        )}
        
        {showGroup && (
          <div className="text-xs text-gray-400 dark:text-gray-500">{safeValue(hanzi.group)}</div>
        )}
      </div>
    </div>
  )
}
