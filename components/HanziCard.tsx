'use client'

import { HanziItem, safeValue, speakText, tagMapping, tagShortMapping } from '@/lib/types'
import { Volume2, Trash } from 'lucide-react'

interface HanziCardProps {
  hanzi: HanziItem
  showTags?: boolean
  showStrokeCount?: boolean
  showRadical?: boolean
  showIDS?: boolean
  showGroup?: boolean
  showPinyin?: boolean
  showBothForms?: boolean
  compact?: boolean
  showDelete?: boolean
  onClick?: () => void
  onDelete?: () => void
}

export default function HanziCard({
  hanzi,
  showTags = true,
  showStrokeCount = true,
  showRadical = true,
  showIDS = false,
  showGroup = true,
  showPinyin = true,
  showBothForms = true,
  compact = false,
  showDelete = false,
  onClick,
  onDelete
}: HanziCardProps) {
  const cardClass = compact
    ? "card p-3 relative group"
    : "card p-6 relative group"

  const charSize = compact ? "text-2xl" : "text-4xl"
  const formSize = compact ? "text-sm" : "text-lg"

  return (
    <div className={cardClass}>
      {showDelete && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-250 p-2 text-white rounded-full"
        >
          <Trash className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          speakText(safeValue(hanzi.char))
        }}
        className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-250 p-2 bg-white rounded-full"
      >
        <Volume2 className="h-4 w-4" />
      </button>

      <div className="text-center">
        <div
          className={`${charSize} hanzi hanzi-primary hanzi-font-kai mb-3`}
        >
          {safeValue(hanzi.char)}
        </div>

        {showBothForms && (
          <div className={`grid grid-cols-2 gap-2 mb-3 ${formSize}`}>
            <div className="text-center">
              {hanzi.simp ? (
                <>
                  <div className="text-xs mb-1">〖简体〗</div>
                  <div className="hanzi-font-kai">{safeValue(hanzi.simp)}</div>
                </>
              ) : ""}
            </div>
            <div className="text-center">
              {hanzi.trad ? (
                <>
                  <div className="text-xs mb-1">〖繁体〗</div>
                  <div className="hanzi-font-kai">{safeValue(hanzi.trad)}</div>
                </>
              ) : ""}
            </div>
            <div className="text-center">
              {hanzi.simp ? (
                <>
                  <div className="text-xs mb-1">〖异体〗</div>
                  <div className="hanzi-font-kai">{safeValue(hanzi.yiti)}</div>
                </>
              ) : ""}
            </div>
          </div>
        )}

        {showPinyin && (
          <div className="mb-2"><code>{safeValue(hanzi.pinyin)}</code></div>
        )}

        {(showStrokeCount || showRadical) && (
          <div className="flex justify-center gap-4 text-xs text-muted mb-2">
            {showStrokeCount && (
              <span>【笔画】{hanzi.strokeCount}</span>
            )}
            {showRadical && hanzi.radical && (
              <span>【部首】{hanzi.radical}</span>
            )}
          </div>
        )}

        {showIDS && (
          <div className="text-xs">{safeValue(hanzi.ids)}</div>
        )}

        {showTags && hanzi.tags.length > 0 && !compact && (() => {
          const filteredTags = hanzi.tags.filter(tag => tagShortMapping[tag]);
          return filteredTags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {filteredTags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="inline-block px-1 py-0.5 text-xs rounded bg-secondary text-muted border border-primary"
                  title={tagMapping[tag]}
                >
                  {tagShortMapping[tag]}
                </span>
              ))}
              {filteredTags.length > 3 && (
                <span className="text-xs text-muted">+{filteredTags.length - 3}</span>
              )}
            </div>
          ) : null;
        })()}
      </div>
    </div>
  )
}
