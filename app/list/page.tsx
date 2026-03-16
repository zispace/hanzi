'use client'

import DisplayModeToggle from '@/components/DisplayModeToggle'
import HanziGrid from '@/components/HanziGrid'
import HanziTable from '@/components/HanziTable'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import MultiSelectDropdown from '@/components/MultiSelectDropdown'
import { LIST_MODES, ListMode, OPTION_MODES, OptionMode, PAGINATION, TABLE_MODES, TableMode, UI_LABELS } from '@/lib/constants'
import { loadHanziData } from '@/lib/dataLoader'
import { HanziItem, tagMapping } from '@/lib/types'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { calculatePaginatedData, extractUniqueGroups, generatePageNumbers, groupFilter, searchFilter, tagsFilter } from './utils'

export default function ListPage() {
  const [hanziData, setHanziData] = useState<HanziItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [displayMode, setDisplayMode] = useState<ListMode>(LIST_MODES.GRID)
  const [filterMode, setFilterMode] = useState<OptionMode>(OPTION_MODES.GROUP)
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [tableDisplayMode, setTableDisplayMode] = useState<TableMode>(TABLE_MODES.STROKE)

  useEffect(() => {
    loadHanziData().then(data => {
      setHanziData(data)
    })
      .catch(error => {
        console.error('Error loading data:', error)
      })
  }, [])

  const filterOptions = useMemo(() => {
    if (!hanziData.length) return []
    if (filterMode === OPTION_MODES.GROUP) {
      return extractUniqueGroups(hanziData)
    } else {
      return Object.keys(tagMapping)
    }
  }, [hanziData, filterMode])

  const filteredData = useMemo(() => {
    if (!hanziData.length) return []

    const result = hanziData.filter((item: HanziItem) => {
      const matchesSearch = searchFilter(item, searchQuery)

      let matchesFilter = true
      if (filterMode === OPTION_MODES.GROUP) {
        matchesFilter = groupFilter(item, selectedGroup)
      } else if (filterMode === OPTION_MODES.TAG) {
        matchesFilter = tagsFilter(item, selectedTags)
      }

      return matchesSearch && matchesFilter
    })
    return result
  }, [hanziData, searchQuery, selectedGroup, selectedTags, filterMode])

  const paginatedData = useMemo(() => {
    return calculatePaginatedData(filteredData, currentPage, itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // 键盘快捷键翻页
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (displayMode === LIST_MODES.TABLE) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          handlePageChange(currentPage - 1)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          handlePageChange(currentPage + 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [displayMode, filterOptions, filteredData, paginatedData, totalPages])


  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (!hanziData.length) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen transition-all duration-500">
      <Header currentPage="list" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索和筛选区域 */}
        <div className="card p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary pointer-events-none z-10" />
              <input
                type="text"
                placeholder="搜索汉字、拼音..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="flex-1 pl-12 pr-4 py-3 input border rounded-lg focus-accent"
                style={{ paddingLeft: '3rem' }}
              />
            </div>

            {/* 筛选选项 */}
            <div className="flex gap-2">
              <select
                value={filterMode}
                onChange={(e) => {
                  setFilterMode(e.target.value as OptionMode)
                  setSelectedGroup('all')
                  setSelectedTags([])
                  setCurrentPage(1)
                }}
                className="px-4 py-3 input border rounded-lg focus-accent"
              >
                <option value={OPTION_MODES.GROUP}>{UI_LABELS.FILTER_GROUP}</option>
                <option value={OPTION_MODES.TAG}>{UI_LABELS.FILTER_TAGS}</option>
              </select>

              {filterMode === OPTION_MODES.GROUP ? (
                <select
                  value={selectedGroup}
                  onChange={(e) => {
                    setSelectedGroup(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-3 input border rounded-lg focus-accent min-w-[120px]"
                >
                  <option value="all">{UI_LABELS.CLEAR_ALL}</option>
                  {filterOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <div className="min-w-[320px]">
                  <MultiSelectDropdown
                    selectedTags={selectedTags}
                    onTagsChange={(tags) => {
                      setSelectedTags(tags)
                      setCurrentPage(1)
                    }}
                    placeholder={UI_LABELS.TAGS_PLACEHOLDER}
                  />
                </div>
              )}

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-4 py-3 input border rounded-lg focus-accent"
              >
                {UI_LABELS.ITEMS_PER_PAGE.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 显示模式切换 */}
          <div className="flex items-center justify-between">
            <p className="text-sm">
              共找到 {filteredData.length} 个汉字，当前显示第 {currentPage} / {totalPages} 页
            </p>
            <div className="flex items-center gap-4">
              {displayMode === LIST_MODES.TABLE && (
                <select
                  value={tableDisplayMode}
                  onChange={(e) => setTableDisplayMode(e.target.value as TableMode)}
                  className="px-3 py-2 input border rounded-lg focus-accent text-sm"
                >
                  <option value={TABLE_MODES.DICT}>释义</option>
                  <option value={TABLE_MODES.STROKE}>笔顺</option>
                </select>
              )}
              <DisplayModeToggle displayMode={displayMode} onModeChange={(mode) => setDisplayMode(mode as ListMode)} />
            </div>
          </div>
        </div>

        {/* 数据展示区域 */}
        {displayMode === LIST_MODES.GRID ? (
          <HanziGrid
            data={paginatedData}
            columns={5}
            showTags={true}
            showStrokeCount={true}
            showRadical={true}
            showGroup={true}
            showPinyin={true}
            showBothForms={true}
          />
        ) : (
          <HanziTable
            data={paginatedData}
            showTags={false}
            showStrokeCount={false}
            showRadical={true}
            showActions={false}
            showStrokeSequence={tableDisplayMode === TABLE_MODES.STROKE}
            showDict={tableDisplayMode === TABLE_MODES.DICT}
          />
        )}

        {/* 分页控件 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover: disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 shadow-subtle"
            >
              <ChevronsLeft className="h-4 w-4 -mr-2" />
              {PAGINATION.FIRST_PAGE}
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover: disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 shadow-subtle"
            >
              <ChevronLeft className="h-4 w-4" />
              {PAGINATION.PREV_PAGE}
            </button>

            <div className="flex gap-1">
              {generatePageNumbers(currentPage, totalPages).map((pageNum, index) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg transition-all duration-250 ${currentPage === pageNum
                    ? ' shadow-subtle'
                    : 'bg-white border  hover:'
                    }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover: disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 shadow-subtle"
            >
              {PAGINATION.NEXT_PAGE}
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover: disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-250 shadow-subtle"
            >
              {PAGINATION.LAST_PAGE}
              <ChevronsRight className="h-4 w-4 -ml-2" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
