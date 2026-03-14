'use client'

import { Volume2 } from 'lucide-react'
import { HanziItem, safeValue, speakText } from '@/lib/types'
import { typography, colors } from '@/lib/design-system'

interface HanziTableProps {
  data: HanziItem[]
  showActions?: boolean
}

export default function HanziTable({ data, showActions = true }: HanziTableProps) {
  return (
    <div className="bg-[#FAF9F6] border border-[#E8E2D5] rounded-lg shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F5F2ED] border-b border-[#E8E2D5]">
              <th className="px-4 py-3 text-left font-semibold text-[#1A1A1A]">汉字</th>
              <th className="px-4 py-3 text-left font-semibold text-[#1A1A1A]">繁体</th>
              <th className="px-4 py-3 text-left font-semibold text-[#1A1A1A]">简体</th>
              <th className="px-4 py-3 text-left font-semibold text-[#1A1A1A]">拼音</th>
              <th className="px-4 py-3 text-left font-semibold text-[#1A1A1A]">级别</th>
              <th className="px-4 py-3 text-left font-semibold text-[#1A1A1A]">分组</th>
              {showActions && (
                <th className="px-4 py-3 text-left font-semibold text-[#1A1A1A]">操作</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((hanzi) => (
              <tr 
                key={hanzi.index} 
                className="border-b border-[#E8E2D5] hover:bg-[#F5F2ED] transition-colors duration-250 last:border-b-0"
              >
                <td className="px-4 py-3">
                  <span 
                    className="text-xl font-bold text-[#DC143C]"
                    style={{ fontFamily: typography.fontFamily.serif.join(', ') }}
                  >
                    {safeValue(hanzi.char)}
                  </span>
                </td>
                <td 
                  className="px-4 py-3 text-[#1A1A1A]"
                  style={{ fontFamily: typography.fontFamily.serif.join(', ') }}
                >
                  {safeValue(hanzi.fanti)}
                </td>
                <td 
                  className="px-4 py-3 text-[#1A1A1A]"
                  style={{ fontFamily: typography.fontFamily.serif.join(', ') }}
                >
                  {safeValue(hanzi.jianti)}
                </td>
                <td className="px-4 py-3 text-[#3A3A3A]">{safeValue(hanzi.pinyin)}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 text-xs rounded-full bg-[#F5F2ED] text-[#5A5A5A] border border-[#E8E2D5]">
                    {safeValue(hanzi.level)}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#5A5A5A]">{safeValue(hanzi.group)}</td>
                {showActions && (
                  <td className="px-4 py-3">
                    <button
                      onClick={() => speakText(safeValue(hanzi.char))}
                      className="p-2 bg-white rounded-full shadow-subtle hover:shadow-soft transition-all duration-250 hover:bg-[#F5F2ED]"
                    >
                      <Volume2 className="h-4 w-4 text-[#5A5A5A]" />
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
