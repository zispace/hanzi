'use client'

import { HanziItem, safeValue, speakText, tagMapping, tagShortMapping } from '@/lib/types'
import { Volume2 } from 'lucide-react'

interface HanziTableProps {
  data: HanziItem[]
  showActions?: boolean
  showTags?: boolean
  showStrokeCount?: boolean
  showRadical?: boolean
  showStrokeSequence?: boolean
  showDict?: boolean
}

const STROKE_REPO = "https://raw.githubusercontent.com/zispace/data-strokes/refs/heads/main/data"
const DICT_REPO = "https://raw.githubusercontent.com/dictkit/zibiao/refs/heads/main/archives"

export default function HanziTable({
  data,
  showActions = true,
  showTags = true,
  showStrokeCount = true,
  showRadical = true,
  showStrokeSequence = false,
  showDict = false,
}: HanziTableProps) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border border-primary">
              <th className="px-4 py-3 font-semibold text-primary">汉字</th>
              <th className="px-4 py-3 font-semibold text-primary">简体</th>
              <th className="px-4 py-3 font-semibold text-primary">繁体</th>
              <th className="px-4 py-3 font-semibold text-primary">异体</th>
              <th className="px-4 py-3 font-semibold text-primary">拼音</th>
              {showStrokeCount && <th className="px-4 py-3 font-semibold text-primary">笔画</th>}
              {showRadical && <th className="px-4 py-3 font-semibold text-primary">部首</th>}
              {showTags && <th className="px-4 py-3 font-semibold text-primary">标签</th>}
              {showActions && (<th className="px-4 py-3 font-semibold text-primary">读音</th>)}
              {showStrokeSequence && (<th className="px-4 py-3 font-semibold text-primary">笔顺</th>)}
              {showDict && (<th className="px-4 py-3 font-semibold text-primary">释义</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((hanzi) => (
              <tr
                key={`${hanzi.char}`}
                className="border-b border-border-secondary hover-bg transition-colors duration-250 last:border-b-0"
              >
                <td className="px-4 py-3">
                  <span className="text-3xl hanzi hanzi-primary hanzi-font-kai">
                    {safeValue(hanzi.char)}
                  </span>
                </td>
                <td className="px-4 py-3 hanzi-font-kai">
                  {safeValue(hanzi.simp)}
                </td>
                <td className="px-4 py-3 hanzi-font-kai">
                  {safeValue(hanzi.trad)}
                </td>
                <td className="px-4 py-3 hanzi-font-kai">
                  {safeValue(hanzi.yiti)}
                </td>
                <td className="px-4 py-3 hanzi-muted text-sm"><code>{safeValue(hanzi.pinyin)}</code></td>
                {showStrokeCount && (
                  <td className="px-4 py-3 text-center">{hanzi.strokeCount}</td>
                )}
                {showRadical && (
                  <td className="px-4 py-3 text-sm"><code>{safeValue(hanzi.radical)}</code></td>
                )}
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
                {showStrokeSequence && (
                  <td className="px-4 py-3 flex items-center justify-center min-h-[60px]">
                    {hanzi.ordinal ? (
                      <img
                        src={`${STROKE_REPO}/${hanzi.ordinal.toString().padStart(4, '0')}.svg`}
                        alt={safeValue(hanzi.char)}
                        className="stroke"
                        loading='lazy'
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {!hanzi.ordinal && (
                      <span className="text-muted">-</span>
                    )}
                    <span className="hidden">{safeValue(hanzi.ordinal)}</span>
                  </td>
                )}
                {showDict && (
                  <td className="px-4 py-3 flex items-center justify-center">
                    {hanzi.ordinal ? (
                      <img
                        src={`${DICT_REPO}/${hanzi.ordinal.toString().padStart(4, '0')}.png`}
                        alt={safeValue(hanzi.char)}
                        className="meaning"
                        loading='lazy'
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
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
