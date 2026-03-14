'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, BookOpen, Volume2, Eye, Grid3X3, Table, Shuffle } from 'lucide-react'

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

export default function IndexPage() {
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
        item.char.includes(char) ||
        item.fanti.includes(char) ||
        item.jianti.includes(char)
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

  if (!hanziData.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">汉字搜索</h1>
            </div>
            <nav className="flex gap-4">
              <a href="/" className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">首页</a>
              <a href="/learn" className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">学习</a>
              <a href="/list" className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">列表</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索区域 */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索汉字（支持多个字符）..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
          
          {/* 搜索结果 */}
          {searchResults.length > 0 && (
            <div className="mt-4 max-w-2xl mx-auto">
              <p className="text-sm text-gray-600 mb-2">找到 {searchResults.length} 个汉字</p>
              <div className="flex flex-wrap gap-2">
                {searchResults.map(hanzi => (
                  <button
                    key={hanzi.index}
                    onClick={() => handleHanziClick(hanzi)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                  >
                    <span className="text-lg font-bold text-red-600">{hanzi.char}</span>
                    <span className="ml-2 text-sm text-gray-500">{hanzi.pinyin}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 热门汉字 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">热门汉字</h2>
            <button
              onClick={() => {
                const randomPopular = [...hanziData].sort(() => 0.5 - Math.random()).slice(0, 10)
                setPopularHanzi(randomPopular)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shuffle className="h-4 w-4" />
              换一批
            </button>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
            {popularHanzi.map(hanzi => (
              <button
                key={hanzi.index}
                onClick={() => handleHanziClick(hanzi)}
                className="p-4 bg-white border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all hover:scale-105"
              >
                <div className="text-2xl font-bold text-red-600 text-center">{hanzi.char}</div>
                <div className="text-xs text-gray-500 text-center mt-1">{hanzi.pinyin}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 选中汉字详情 */}
        {selectedHanzi.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">汉字详情</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setDisplayMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    displayMode === 'grid' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setDisplayMode('table')}
                  className={`p-2 rounded-lg transition-colors ${
                    displayMode === 'table' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Table className="h-5 w-5" />
                </button>
              </div>
            </div>

            {displayMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {selectedHanzi.map(hanzi => (
                  <div key={hanzi.index} className="bg-gray-50 rounded-lg p-6 relative group">
                    <button
                      onClick={() => speakText(hanzi.char)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white rounded-full shadow-md"
                    >
                      <Volume2 className="h-4 w-4 text-gray-600" />
                    </button>
                    
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-600 mb-3">{hanzi.char}</div>
                      <div className="grid grid-cols-2 gap-2 mb-3 text-lg font-serif">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">繁体</div>
                          <div className="text-gray-800">{hanzi.fanti}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">简体</div>
                          <div className="text-gray-800">{hanzi.jianti}</div>
                        </div>
                      </div>
                      <div className="text-blue-600 mb-2">{hanzi.pinyin}</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(hanzi.level)}`}>
                          {hanzi.level}
                        </span>
                        <span className="text-xs text-gray-400">{hanzi.group}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">汉字</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">繁体</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">简体</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">拼音</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">级别</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">分组</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedHanzi.map(hanzi => (
                      <tr key={hanzi.index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">
                          <span className="text-xl font-bold text-red-600">{hanzi.char}</span>
                        </td>
                        <td className="border border-gray-200 px-4 py-2 font-serif">{hanzi.fanti}</td>
                        <td className="border border-gray-200 px-4 py-2 font-serif">{hanzi.jianti}</td>
                        <td className="border border-gray-200 px-4 py-2 text-blue-600">{hanzi.pinyin}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(hanzi.level)}`}>
                            {hanzi.level}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-2 text-gray-500">{hanzi.group}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <button
                            onClick={() => speakText(hanzi.char)}
                            className="p-1 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                          >
                            <Volume2 className="h-4 w-4 text-blue-600" />
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
