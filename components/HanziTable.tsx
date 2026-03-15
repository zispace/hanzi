'use client'

import { HanziItem, safeValue, speakText, tagMapping, tagShortMapping } from '@/lib/types'
import { Volume2 } from 'lucide-react'

interface HanziTableProps {
  data: HanziItem[]
  showActions?: boolean
  showTags?: boolean
  showStrokeCount?: boolean
  showRadical?: boolean
}

export default function HanziTable({ 
  data, 
  showActions = true,
  showTags = true,
  showStrokeCount = true,
  showRadical = true
}: HanziTableProps) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border border-primary">
              <th className="px-4 py-3 font-semibold text-primary">汉字</th>
              <th className="px-4 py-3 font-semibold text-primary">繁体</th>
              <th className="px-4 py-3 font-semibold text-primary">简体</th>
              <th className="px-4 py-3 font-semibold text-primary">拼音</th>
              {showStrokeCount && <th className="px-4 py-3 font-semibold text-primary">笔画</th>}
              {showRadical && <th className="px-4 py-3 font-semibold text-primary">部首</th>}
              {showTags && <th className="px-4 py-3 font-semibold text-primary">标签</th>}
              {showActions && (<th className="px-4 py-3 font-semibold text-primary">读音</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((hanzi) => (
              <tr 
                key={`${hanzi.char}`} 
                className="border-b border-border-secondary hover-bg transition-colors duration-250 last:border-b-0"
              >
                <td className="px-4 py-3">
                  <span className="text-xl hanzi hanzi-primary hanzi-font-kai">
                    {safeValue(hanzi.char)}
                  </span>
                </td>
                <td className="px-4 py-3 hanzi-font-kai">
                  {safeValue(hanzi.trad)}
                </td>
                <td className="px-4 py-3 hanzi-font-kai">
                  {safeValue(hanzi.simp)}
                </td>
                <td className="px-4 py-3 hanzi-muted">{safeValue(hanzi.pinyin)}</td>
                {showStrokeCount && (
                  <td className="px-4 py-3 text-center">{hanzi.strokeCount}</td>
                )}
                {showRadical && (
                  <td className="px-4 py-3">{safeValue(hanzi.radical)}</td>
                )}
                {/* <td className="px-4 py-3 text-secondary">{safeValue(hanzi.group)}</td> */}
                {showTags && (() => {
                  const filteredTags = hanzi.tags.filter(tag => tagShortMapping[tag]);
                  return (
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {filteredTags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="inline-block px-1 py-0.5 text-xs rounded bg-secondary text-muted border border-primary"
                            title={tagShortMapping[tag] || ""}
                          >
                            {tagShortMapping[tag]}
                          </span>
                        ))}
                        {filteredTags.length > 3 && (
                          <span className="text-xs text-muted">+{filteredTags.length - 3}</span>
                        )}
                      </div>
                    </td>
                  );
                })()}
                {showActions && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => speakText(safeValue(hanzi.char))}
                      className="p-2 bg-white rounded-full"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
