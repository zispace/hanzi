'use client'

import { HanziItem, safeValue, speakText } from '@/lib/types';
import { Volume2 } from 'lucide-react';

function getChar(hanzi: HanziItem, showMode: 'fanti' | 'jianti') {
  const targetField = showMode === 'fanti' ? hanzi.simp : hanzi.trad;
  return targetField || hanzi.char;
}

interface HanziNineGridProps {
  data: HanziItem[]
  showMode: 'fanti' | 'jianti'
  onSpeak?: (text: string) => void
}

export default function HanziNineGrid({ data, showMode, onSpeak }: HanziNineGridProps) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {data.map((hanzi, index) => (
        <div key={hanzi.char} className="relative group">
          <div className="bg-gradient-to-br to-secondary border-2 rounded-xl p-8 flex items-center justify-center card">
            <div className="text-center">
              <div className="text-6xl hanzi hanzi-primary hanzi-font-kai mb-3 calligraphy-grid rounded-lg p-4">
                {safeValue(getChar(hanzi, showMode))}
              </div>
              
              <div className="text-sm hanzi-muted mb-3">{safeValue(hanzi.pinyin)}</div>
              
              <button
                onClick={() => {
                  const text = safeValue(hanzi.char)
                  onSpeak ? onSpeak(text) : speakText(text)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-250 p-2 bg-white rounded-full mx-auto"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* <div className="absolute -top-2 -left-2 w-7 h-7 bg-accent-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div> */}
        </div>
      ))}
    </div>
  )
}
