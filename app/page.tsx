'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, BookOpen, Volume2, Eye, Grid3X3, Table, Shuffle, Moon, Sun } from 'lucide-react'

interface HanziItem {
  index: number
  char: string
  fanti: string
  jianti: string
  group: string
  level: string
  ids: string
  pinyin: string
}

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

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      '一级': 'bg-green-100 text-green-800',
      '二级': 'bg-blue-100 text-blue-800',
      '三级': 'bg-yellow-100 text-yellow-800',
      '四级': 'bg-orange-100 text-orange-800',
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const safeValue = (value: any) => {
    return value || ''
  }

  if (!hanziData.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">加载数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-red-600 dark:text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">汉字繁简学习</h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex gap-4">
                <a href="/" className="px-4 py-2 text-red-600 dark:text-red-500 font-semibold transition-colors">首页</a>
                <a href="/learn" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">学习</a>
                <a href="/list" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">列表</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

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
              <button
                key={hanzi.index}
                onClick={() => handleHanziClick(hanzi)}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 transition-all hover:scale-105"
              >
                <div className="text-2xl font-bold text-red-600 dark:text-red-500 text-center">{safeValue(hanzi.char)}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">{safeValue(hanzi.pinyin)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 选中汉字详情 */}
        {selectedHanzi.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors">汉字详情</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setDisplayMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    displayMode === 'grid' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setDisplayMode('table')}
                  className={`p-2 rounded-lg transition-colors ${
                    displayMode === 'table' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Table className="h-5 w-5" />
                </button>
              </div>
            </div>

            {displayMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {selectedHanzi.map(hanzi => (
                  <div key={hanzi.index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 relative group transition-colors">
                    <button
                      onClick={() => speakText(safeValue(hanzi.char))}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white dark:bg-gray-600 rounded-full shadow-md"
                    >
                      <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-600 dark:text-red-500 mb-3">{safeValue(hanzi.char)}</div>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-lg font-serif">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">繁体</div>
                          <div className="text-gray-800 dark:text-gray-200">{safeValue(hanzi.fanti)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">简体</div>
                          <div className="text-gray-800 dark:text-gray-200">{safeValue(hanzi.jianti)}</div>
                        </div>
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 mb-2">{safeValue(hanzi.pinyin)}</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(safeValue(hanzi.level))}`}>
                          {safeValue(hanzi.level)}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{safeValue(hanzi.group)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                      <th className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedHanzi.map(hanzi => (
                      <tr key={hanzi.index} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                          <span className="text-xl font-bold text-red-600 dark:text-red-500">{safeValue(hanzi.char)}</span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-serif text-gray-800 dark:text-gray-200">{safeValue(hanzi.fanti)}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 font-serif text-gray-800 dark:text-gray-200">{safeValue(hanzi.jianti)}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-blue-600 dark:text-blue-400">{safeValue(hanzi.pinyin)}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(safeValue(hanzi.level))}`}>
                            {safeValue(hanzi.level)}
                          </span>
                        </td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2 text-gray-500 dark:text-gray-400">{safeValue(hanzi.group)}</td>
                        <td className="border border-gray-200 dark:border-gray-600 px-4 py-2">
                          <button
                            onClick={() => speakText(safeValue(hanzi.char))}
                            className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            <Volume2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
