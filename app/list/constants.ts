// 列表页面常量定义
// export const FILTER_TYPES = {
//   GROUP: 'group' as const,
//   TAGS: 'tags' as const
// } as const

// export const DISPLAY_MODES = {
//   GRID: 'grid' as const,
//   TABLE: 'table' as const
// } as const

export const UI_LABELS = {
  FILTER_GROUP: '按分组',
  FILTER_TAGS: '按标签',
  SEARCH_PLACEHOLDER: '搜索汉字、拼音...',
  TAGS_PLACEHOLDER: '选择标签...',
  RESULTS_TEXT: '共找到 {count} 个汉字，当前显示第 {page} 页',
  CLEAR_ALL: '全部',
  ITEMS_PER_PAGE: [
    { value: 10, label: '10条/页' },
    { value: 20, label: '20条/页' },
    { value: 50, label: '50条/页' },
    { value: 100, label: '100条/页' }
  ] as const
} as const

export const PAGINATION = {
  PREV_PAGE: '上一页',
  NEXT_PAGE: '下一页',
  MAX_VISIBLE_PAGES: 5
} as const
