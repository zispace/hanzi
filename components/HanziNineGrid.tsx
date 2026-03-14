'use client'

import { Volume2 } from 'lucide-react'
import { HanziItem, safeValue, speakText } from '@/lib/types'
import { typography, colors } from '@/lib/design-system'

interface HanziNineGridProps {
  data: HanziItem[]
  showMode: 'fanti' | 'jianti'
  onSpeak?: (text: string) => void
}

export default function HanziNineGrid({ data, showMode, onSpeak }: HanziNineGridProps) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {data.map((hanzi, index) => (
        <div key={hanzi.index} className="relative group">
          <div className="bg-gradient-to-br from-[#FAF9F6] to-[#F5F2ED] border-2 border-[#E8E2D5] rounded-xl p-8 flex items-center justify-center shadow-subtle hover:shadow-soft transition-all duration-250">
            <div className="text-center">
              <div 
                className="text-6xl text-[#1A1A1A] mb-3"
                style={{ 
                  fontFamily: typography.fontFamily.kai.join(', '),
                  fontWeight: '500'
                }}
              >
                {showMode === 'fanti' ? safeValue(hanzi.jianti) : safeValue(hanzi.fanti)}
              </div>
              
              <div className="text-sm text-[#3A3A3A] mb-3">{safeValue(hanzi.pinyin)}</div>
              
              <button
                onClick={() => {
                  const text = safeValue(hanzi.char)
                  onSpeak ? onSpeak(text) : speakText(text)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-250 p-2 bg-white rounded-full shadow-subtle hover:shadow-soft mx-auto"
              >
                <Volume2 className="h-4 w-4 text-[#5A5A5A]" />
              </button>
            </div>
          </div>
          
          <div className="absolute -top-2 -left-2 w-7 h-7 bg-[#DC143C] text-white rounded-full flex items-center justify-center text-sm font-medium shadow-subtle">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  )
}
