'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { HanziItem, safeValue } from '@/lib/types'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import HanziGrid from '@/components/HanziGrid'
import HanziTable from '@/components/HanziTable'
import DisplayModeToggle from '@/components/DisplayModeToggle'

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


  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (!hanziData.length) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header currentPage="list" title="汉字列表" />

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
            <p className="text-gray-600 dark:text-gray-400">
              共找到 {filteredData.length} 个汉字，当前显示第 {currentPage} 页
            </p>
            <DisplayModeToggle displayMode={displayMode} onModeChange={setDisplayMode} />
          </div>
        </div>

        {/* 数据展示区域 */}
        {displayMode === 'grid' ? (
          <HanziGrid 
            data={paginatedData} 
            columns={5}
            showLevel={true}
            showGroup={true}
            showPinyin={true}
            showBothForms={true}
          />
        ) : (
          <HanziTable data={paginatedData} />
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
