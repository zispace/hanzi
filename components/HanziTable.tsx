'use client'

import { Volume2 } from 'lucide-react'
import { HanziItem, safeValue, speakText } from '@/lib/types'

interface HanziTableProps {
  data: HanziItem[]
  showActions?: boolean
}

export default function HanziTable({ data, showActions = true }: HanziTableProps) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className=" border-b border-primary">
              <th className="px-4 py-3 font-semibold text-primary">汉字</th>
              <th className="px-4 py-3 font-semibold text-primary">繁体</th>
              <th className="px-4 py-3 font-semibold text-primary">简体</th>
              <th className="px-4 py-3 font-semibold text-primary">拼音</th>
              <th className="px-4 py-3 font-semibold text-primary">级别</th>
              <th className="px-4 py-3 font-semibold text-primary">分组</th>
              {showActions && (
                <th className="px-4 py-3 font-semibold text-primary">操作</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((hanzi) => (
              <tr 
                key={`${hanzi.index}-${hanzi.char}`} 
                className="border-b hover-bg transition-colors duration-250 last:border-b-0"
              >
                <td className="px-4 py-3">
                  <span 
                    className="text-xl hanzi hanzi-primary"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {safeValue(hanzi.char)}
                  </span>
                </td>
                <td 
                  className="px-4 py-3 "
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {safeValue(hanzi.fanti)}
                </td>
                <td 
                  className="px-4 py-3 "
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {safeValue(hanzi.jianti)}
                </td>
                <td className="px-4 py-3 hanzi-muted">{safeValue(hanzi.pinyin)}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-muted border border-primary">
                    {safeValue(hanzi.level)}
                  </span>
                </td>
                <td className="px-4 py-3 text-secondary">{safeValue(hanzi.group)}</td>
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
