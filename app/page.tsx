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
    <div className="min-h-screen bg-[#FAF9F6] transition-all duration-500">
      <Header currentPage="home" title="汉字繁简学习" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索区域 */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9A9A9A]" />
            <input
              type="text"
              placeholder="搜索汉字（支持多个字符）..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-[#E8E2D5] rounded-xl focus:ring-2 focus:ring-[#DC143C] focus:border-transparent bg-white text-[#1A1A1A] placeholder-[#9A9A9A] shadow-subtle focus:shadow-soft transition-all duration-250"
            />
          </div>
          
          {/* 搜索结果 */}
          {searchResults.length > 0 && (
            <div className="mt-4 max-w-2xl mx-auto">
              <p className="text-sm text-[#5A5A5A] mb-3">找到 {searchResults.length} 个汉字</p>
              <div className="flex flex-wrap gap-2">
                {searchResults.map(hanzi => (
                  <button
                    key={hanzi.index}
                    onClick={() => handleHanziClick(hanzi)}
                    className="px-3 py-2 bg-white border border-[#E8E2D5] rounded-lg hover:border-[#DC143C] hover:bg-[#FFF5F5] transition-all duration-250 shadow-subtle"
                  >
                    <span className="text-lg font-bold text-[#DC143C]">{safeValue(hanzi.char)}</span>
                    <span className="ml-2 text-sm text-[#5A5A5A]">{safeValue(hanzi.pinyin)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 热门汉字 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">热门汉字</h2>
            <button
              onClick={() => {
                const randomPopular = [...hanziData].sort(() => 0.5 - Math.random()).slice(0, 10)
                setPopularHanzi(randomPopular)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E2D5] rounded-lg hover:bg-[#F5F2ED] transition-all duration-250 shadow-subtle"
            >
              <Shuffle className="h-4 w-4 text-[#5A5A5A]" />
              换一批
            </button>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
            {popularHanzi.map(hanzi => (
              <div key={hanzi.index} className="p-4 bg-white border border-[#E8E2D5] rounded-lg hover:border-[#DC143C] hover:bg-[#FFF5F5] transition-all duration-250 cursor-pointer shadow-subtle hover:shadow-soft"
                   onClick={() => handleHanziClick(hanzi)}>
                <div className="text-2xl font-bold text-[#DC143C] text-center">{safeValue(hanzi.char)}</div>
                <div className="text-xs text-[#5A5A5A] text-center mt-1">{safeValue(hanzi.pinyin)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 选中汉字详情 */}
        {selectedHanzi.length > 0 && (
          <div className="bg-white border border-[#E8E2D5] rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1A1A1A]">汉字详情</h2>
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
