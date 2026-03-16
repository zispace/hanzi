'use client'

import { LearningMode } from '@/lib/constants';
import { getDisplayCharacter } from '@/app/learn/utils';
import { HanziItem, safeValue, speakText } from '@/lib/types';

interface HanziNineGridProps {
  data: HanziItem[]
  showMode: LearningMode
  showAnswer: boolean
  onSpeak?: (text: string) => void
}

export default function HanziNineGrid({ data, showMode, showAnswer, onSpeak }: HanziNineGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {data.map((hanzi, index) => {
        const displayChars = getDisplayCharacter(hanzi, showMode);

        return (
          <div key={`${hanzi.char}-${index}`} className="relative group">
            <div className="bg-gradient-to-br to-secondary border-2 rounded-xl p-8 flex items-center justify-center card">
              <div className="text-center">
                {(() => {
                  const isYiti = hanzi.simp && hanzi.trad ? "hanzi-yiti" : "";
                  return (
                    <div className={`text-8xl hanzi hanzi-primary hanzi-font-kai mb-3 calligraphy-grid rounded-lg p-4 ${isYiti}`}>
                      <span>{hanzi.char}</span>
                    </div>
                  );
                })()}

                {/* 显示答案区域 */}
                {showAnswer && (
                  <ul className="text-sm hanzi-muted mb-2">
                    {[
                      // { key: 'char', label: '〖字〗', format: (value: string) => value },
                      { key: 'simp', label: '〖简〗', format: (value: string) => value },
                      { key: 'trad', label: '〖繁〗', format: (value: string) => value },
                      { key: 'yiti', label: '〖异〗', format: (value: string) => value }
                    ].map(({ key, label, format }) => {
                      const value = hanzi[key as keyof HanziItem];
                      return safeValue(value) && (
                        <li key={key}>
                          {label}<span className="text-3xl hanzi-font-kai">{format(safeValue(value)!)}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="text-sm hanzi-muted mb-3">
                  {safeValue(hanzi.pinyin)}
                </div>
              </div>
            </div>

          </div>
        )
      })}
    </div>
  )
}
