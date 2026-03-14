'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, BookOpen, Volume2, Grid3X3, Table, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react'

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

export default function ListPage() {
  const [hanziData, setHanziData] = useState<HanziItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [displayMode, setDisplayMode] = useState<'grid' | 'table'>('grid')
  const [filterType, setFilterType] = useState<'level' | 'group'>('level')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setHanziData(data)
      })
      .catch(error => {
        console.error('Error loading data:', error)
      })
  }, [])

  const safeValue = (value: any) => {
    return value || ''
  }

  const filterOptions = useMemo(() => {
    if (!hanziData.length) return []
    
    const options = new Set<string>()
    hanziData.forEach(item => {
      if (filterType === 'level') {
        options.add(item.level)
      } else {
        options.add(item.group)
      }
    })
    
    return Array.from(options).filter(Boolean).sort()
  }, [hanziData, filterType])

  const filteredData = useMemo(() => {
    if (!hanziData.length) return []
    
    return hanziData.filter((item: HanziItem) => {
      const matchesSearch = searchTerm === '' || 
        safeValue(item.char).includes(searchTerm) ||
        safeValue(item.fanti).includes(searchTerm) ||
        safeValue(item.jianti).includes(searchTerm) ||
        safeValue(item.pinyin).includes(searchTerm)
      
      const matchesFilter = selectedFilter === 'all' || 
        (filterType === 'level' ? item.level === selectedFilter : item.group === selectedFilter)
      
      return matchesSearch && matchesFilter
    })
  }, [hanziData, searchTerm, selectedFilter, filterType])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredData.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">汉字列表</h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex gap-4">
                <a href="/" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">首页</a>
                <a href="/learn" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">学习</a>
                <a href="/list" className="px-4 py-2 text-red-600 dark:text-red-500 font-semibold transition-colors">列表</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和筛选区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="搜索汉字、拼音..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
            </div>
            
            {/* 筛选选项 */}
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as 'level' | 'group')
                  setSelectedFilter('all')
                  setCurrentPage(1)
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="level">按级别</option>
                <option value="group">按分组</option>
              </select>
              
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent min-w-[120px]"
              >
                <option value="all">全部</option>
                {filterOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value={10}>10条/页</option>
                <option value={20}>20条/页</option>
                <option value={50}>50条/页</option>
                <option value={100}>100条/页</option>
              </select>
            </div>
          </div>

          {/* 显示模式切换 */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              共找到 {filteredData.length} 个汉字，当前显示第 {currentPage} 页
            </p>
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
        </div>

        {/* 数据展示区域 */}
        {displayMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
            {paginatedData.map((hanzi: HanziItem) => (
              <div key={hanzi.index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 relative group">
                <div className="absolute top-2 right-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getLevelColor(hanzi.level)}`}>
                    {hanzi.level}
                  </span>
                </div>
                
                <button
                  onClick={() => speakText(hanzi.char)}
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white rounded-full shadow-md"
                >
                  <Volume2 className="h-4 w-4 text-gray-600" />
                </button>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-center mb-3 text-red-600">
                    {hanzi.char}
                  </div>
                  
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
                  
                  <div className="text-blue-600 mb-2 text-sm">{hanzi.pinyin}</div>
                  <div className="text-xs text-gray-400">{hanzi.group}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">汉字</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">繁体</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">简体</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">拼音</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">级别</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">分组</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((hanzi: HanziItem) => (
                    <tr key={hanzi.index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">
                        <span className="text-xl font-bold text-red-600">{hanzi.char}</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 font-serif">{hanzi.fanti}</td>
                      <td className="border border-gray-200 px-4 py-3 font-serif">{hanzi.jianti}</td>
                      <td className="border border-gray-200 px-4 py-3 text-blue-600">{hanzi.pinyin}</td>
                      <td className="border border-gray-200 px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(hanzi.level)}`}>
                          {hanzi.level}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-500">{hanzi.group}</td>
                      <td className="border border-gray-200 px-4 py-3">
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
          </div>
        )}

        {/* 分页控件 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
