'use client'

import DisplayModeToggle from '@/components/DisplayModeToggle'
import HanziGrid from '@/components/HanziGrid'
import HanziTable from '@/components/HanziTable'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import { loadHanziData } from '@/lib/dataLoader'
import { HanziItem, safeValue } from '@/lib/types'
import { Search, Shuffle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export default function Home() {
  const [hanziData, setHanziData] = useState<HanziItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHanzi, setSelectedHanzi] = useState<HanziItem[]>([])
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('table')
  const [popularHanzi, setPopularHanzi] = useState<HanziItem[]>([])
  const displayCount = 10

  const getRandomPopularHanzi = (data: HanziItem[], count: number) => {
    const filteredData = data.filter(item => item.group === 'A1a' || item.group === 'A1b')
    return [...filteredData].sort(() => 0.5 - Math.random()).slice(0, count)
  }

  useEffect(() => {
    loadHanziData().then(data => {
      setHanziData(data)
      // 随机选择热门汉字
      const randomPopular = getRandomPopularHanzi(data, displayCount)
      setPopularHanzi(randomPopular)
    })
      .catch(error => {
        console.error('Error loading data:', error)
      })
  }, [])

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    
    const searchChars = searchTerm.split('').filter(char => char.trim())
    const matchedItems = hanziData.filter((item: HanziItem) => {
      return searchChars.some(char => 
        safeValue(item.char).includes(char) ||
        safeValue(item.trad).includes(char) ||
        safeValue(item.simp).includes(char)
      )
    })
    
    // 去重：使用 Map 来确保唯一性，以汉字字符为键
    const uniqueItems = new Map<string, HanziItem>()
    matchedItems.forEach(item => {
      const char = safeValue(item.char)
      if (!uniqueItems.has(char)) {
        uniqueItems.set(char, item)
      }
    })
    
    return Array.from(uniqueItems.values())
  }, [hanziData, searchTerm])

  const handleHanziClick = (hanzi: HanziItem) => {
    if (!selectedHanzi.find(h => h.char === hanzi.char)) {
      setSelectedHanzi([...selectedHanzi, hanzi])
    }
  }


  if (!hanziData.length) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen transition-all duration-500">
      <Header currentPage="home" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索区域 */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary pointer-events-none z-10" />
            <input
              type="text"
              placeholder="搜索汉字（支持多个字符）..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 input border rounded-xl focus-accent"
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          
          {/* 搜索结果 */}
          {searchResults.length > 0 && (
            <div className="mt-4 max-w-2xl mx-auto">
              <p className="text-sm mb-3">找到 {searchResults.length} 个汉字</p>
              <div className="flex flex-wrap gap-2">
                {searchResults.map((hanzi, index) => (
                  <button
                    key={`${hanzi.char}-${index}`}
                    onClick={() => handleHanziClick(hanzi)}
                    className="px-3 py-2 card hover-accent"
                  >
                    <span className="text-lg hanzi hanzi-primary">{safeValue(hanzi.char)}</span>
                    <span className="ml-2 text-sm text-muted">{safeValue(hanzi.pinyin)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 热门汉字 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary">基础汉字</h2>
            <button
              onClick={() => {
                const randomPopular = getRandomPopularHanzi(hanziData, displayCount)
                setPopularHanzi(randomPopular)
              }}
              className="flex items-center gap-2 px-4 py-2 button-secondary"
            >
              <Shuffle className="h-4 w-4" />
              换一批
            </button>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
            {popularHanzi.map(hanzi => (
              <div key={hanzi.char} className="p-4 card hover-accent cursor-pointer hanzi-font-kai"
                   onClick={() => handleHanziClick(hanzi)}>
                <div className="text-2xl hanzi hanzi-primary text-center">{safeValue(hanzi.char)}</div>
                <div className="text-xs text-muted text-center mt-1">{safeValue(hanzi.pinyin)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 选中汉字详情 */}
        {selectedHanzi.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">汉字详情</h2>
              <DisplayModeToggle displayMode={displayMode} onModeChange={setDisplayMode} />
            </div>

            {displayMode === 'grid' ? (
              <HanziGrid 
                data={selectedHanzi} 
                columns={4}
                onCardClick={(hanzi) => {
                  // Remove from selection when clicked in details
                  setSelectedHanzi(prev => prev.filter(h => h.char !== hanzi.char))
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
