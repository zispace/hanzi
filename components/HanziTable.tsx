'use client'

import { Volume2 } from 'lucide-react'
import { HanziItem, getLevelColor, safeValue, speakText } from '@/lib/types'

interface HanziTableProps {
  data: HanziItem[]
  showActions?: boolean
}

export default function HanziTable({ data, showActions = true }: HanziTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">汉字</th>
              <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">繁体</th>
              <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">简体</th>
              <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">拼音</th>
              <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">级别</th>
              <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">分组</th>
              {showActions && (
                <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">操作</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((hanzi) => (
              <tr key={hanzi.index} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                  <span className="text-xl font-bold text-red-600 dark:text-red-500">{safeValue(hanzi.char)}</span>
                </td>
                <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-serif text-gray-800 dark:text-gray-200">
                  {safeValue(hanzi.fanti)}
                </td>
                <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-serif text-gray-800 dark:text-gray-200">
                  {safeValue(hanzi.jianti)}
                </td>
                <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-blue-600 dark:text-blue-400">
                  {safeValue(hanzi.pinyin)}
                </td>
                <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(safeValue(hanzi.level))}`}>
                    {safeValue(hanzi.level)}
                  </span>
                </td>
                <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-500 dark:text-gray-400">
                  {safeValue(hanzi.group)}
                </td>
                {showActions && (
                  <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                    <button
                      onClick={() => speakText(safeValue(hanzi.char))}
                      className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Volume2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
