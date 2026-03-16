// 列表页面工具函数
import { HanziItem } from '@/lib/types'
import { PAGINATION } from '@/lib/constants'

/**
 * 从数据中提取唯一分组列表
 */
export const extractUniqueGroups = (data: HanziItem[]): string[] => {
  const groups = new Set<string>()
  data.forEach(item => {
    if (item.group) groups.add(item.group)
  })
  return Array.from(groups).sort()
}

/**
 * 搜索过滤函数
 */
export const searchFilter = (item: HanziItem, searchTerm: string): boolean => {
  if (searchTerm === '') return true
  
  const searchLower = searchTerm.toLowerCase()
  return item.char.includes(searchTerm) ||
    item.trad?.includes(searchTerm) ||
    item.simp?.includes(searchTerm) ||
    item.pinyin?.toLowerCase().includes(searchLower)
}

/**
 * 分组过滤函数
 */
export const groupFilter = (item: HanziItem, selectedGroup: string): boolean => {
  return selectedGroup === 'all' || item.group === selectedGroup
}

/**
 * 标签过滤函数
 */
export const tagsFilter = (item: HanziItem, selectedTags: string[]): boolean => {
  if (selectedTags.length === 0) return true
  
  const hasMatchingTag = selectedTags.some(tag => 
    item.tags.includes(tag)
  )
  
  // Debug logging for first few items
  if (item.char === '一' || item.char === '乙') {
    console.log(`Tag filter for ${item.char}:`, {
      itemTags: item.tags,
      selectedTags,
      hasMatchingTag
    })
  }
  
  return hasMatchingTag
}

/**
 * 分页数据计算
 */
export const calculatePaginatedData = (
  data: HanziItem[], 
  currentPage: number, 
  itemsPerPage: number
): HanziItem[] => {
  const startIndex = (currentPage - 1) * itemsPerPage
  return data.slice(startIndex, startIndex + itemsPerPage)
}

/**
 * 生成分页页码数组
 */
export const generatePageNumbers = (
  currentPage: number, 
  totalPages: number
): number[] => {
  const maxVisible = PAGINATION.MAX_VISIBLE_PAGES
  let startPage = 1
  
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  
  if (currentPage <= 3) {
    startPage = 1
  } else if (currentPage >= totalPages - 2) {
    startPage = totalPages - 4
  } else {
    startPage = currentPage - 2
  }
  
  return Array.from({ length: Math.min(maxVisible, totalPages) }, (_, i) => startPage + i)
}
