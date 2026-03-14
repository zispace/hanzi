'use client'

import { Volume2 } from 'lucide-react'
import { HanziItem, safeValue, speakText } from '@/lib/types'

interface HanziNineGridProps {
  data: HanziItem[]
  showMode: 'fanti' | 'jianti'
  onSpeak?: (text: string) => void
}

export default function HanziNineGrid({ data, showMode, onSpeak }: HanziNineGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((hanzi, index) => (
        <div key={hanzi.index} className="relative group">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-serif text-gray-800 dark:text-gray-200 mb-2" style={{ fontFamily: 'KaiTi, STKaiti, serif' }}>
                {showMode === 'fanti' ? safeValue(hanzi.jianti) : safeValue(hanzi.fanti)}
              </div>
              
              <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">{safeValue(hanzi.pinyin)}</div>
              
              <button
                onClick={() => {
                  const text = safeValue(hanzi.char)
                  onSpeak ? onSpeak(text) : speakText(text)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white dark:bg-gray-600 rounded-full shadow-md mx-auto"
              >
                <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
          
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  )
}
