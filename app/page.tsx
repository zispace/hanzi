'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Shuffle } from 'lucide-react'
import { HanziItem, safeValue } from '@/lib/types'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import HanziGrid from '@/components/HanziGrid'
import HanziTable from '@/components/HanziTable'
import DisplayModeToggle from '@/components/DisplayModeToggle'

export default function Home() {
  const [hanziData, setHanziData] = useState<HanziItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHanzi, setSelectedHanzi] = useState<HanziItem[]>([])
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid')
  const [popularHanzi, setPopularHanzi] = useState<HanziItem[]>([])

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setHanziData(data)
        // 随机选择10个热门汉字
        const randomPopular = [...data].sort(() => 0.5 - Math.random()).slice(0, 10)
        setPopularHanzi(randomPopular)
      })
      .catch(error => {
        console.error('Error loading data:', error)
      })
  }, [])

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    return hanziData.filter((item: HanziItem) => {
      const searchChars = searchTerm.split('').filter(char => char.trim())
      return searchChars.some(char => 
        safeValue(item.char).includes(char) ||
        safeValue(item.fanti).includes(char) ||
        safeValue(item.jianti).includes(char)
      )
    })
  }, [hanziData, searchTerm])

  const handleHanziClick = (hanzi: HanziItem) => {
    if (!selectedHanzi.find(h => h.index === hanzi.index)) {
      setSelectedHanzi([...selectedHanzi, hanzi])
    }
  }


  if (!hanziData.length) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header currentPage="home" title="汉字繁简学习" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索区域 */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="搜索汉字（支持多个字符）..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
          
          {/* 搜索结果 */}
          {searchResults.length > 0 && (
            <div className="mt-4 max-w-2xl mx-auto">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">找到 {searchResults.length} 个汉字</p>
              <div className="flex flex-wrap gap-2">
                {searchResults.map(hanzi => (
                  <button
                    key={hanzi.index}
                    onClick={() => handleHanziClick(hanzi)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-colors"
                  >
                    <span className="text-lg font-bold text-red-600 dark:text-red-500">{safeValue(hanzi.char)}</span>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">{safeValue(hanzi.pinyin)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 热门汉字 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors">热门汉字</h2>
            <button
              onClick={() => {
                const randomPopular = [...hanziData].sort(() => 0.5 - Math.random()).slice(0, 10)
                setPopularHanzi(randomPopular)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Shuffle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              换一批
            </button>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
            {popularHanzi.map(hanzi => (
              <div key={hanzi.index} className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-all hover:scale-105 cursor-pointer"
                   onClick={() => handleHanziClick(hanzi)}>
                <div className="text-2xl font-bold text-red-600 dark:text-red-500 text-center">{safeValue(hanzi.char)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{safeValue(hanzi.pinyin)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 选中汉字详情 */}
        {selectedHanzi.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors">汉字详情</h2>
              <DisplayModeToggle displayMode={displayMode} onModeChange={setDisplayMode} />
            </div>

            {displayMode === 'grid' ? (
              <HanziGrid 
                data={selectedHanzi} 
                columns={4}
                onCardClick={(hanzi) => {
                  // Remove from selection when clicked in details
                  setSelectedHanzi(prev => prev.filter(h => h.index !== hanzi.index))
                }}
              />
            ) : (
              <HanziTable data={selectedHanzi} />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
