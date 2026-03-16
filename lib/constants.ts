// 学习页面常量定义
export const LEARNING_MODES = {
  SIMPLIFIED: 'jianti' as const,
  TRADITIONAL: 'fanti' as const
} as const

export type LearningMode = typeof LEARNING_MODES[keyof typeof LEARNING_MODES]

export const LIST_MODES = {
  TABLE: 'table' as const,
  GRID: 'grid' as const
} as const

export type ListMode = typeof LIST_MODES[keyof typeof LIST_MODES]

export const DISPLAY_MODES = {
  RANDOM: 'random' as const,
  SEQUENTIAL: 'sequential' as const
} as const

export type DisplayMode = typeof DISPLAY_MODES[keyof typeof DISPLAY_MODES]

export const OPTION_MODES = {
  TAG: 'tags' as const,
  GROUP: 'group' as const
} as const

export type OptionMode = typeof OPTION_MODES[keyof typeof OPTION_MODES]

export const TABLE_MODES = {
  DICT: 'dict' as const,
  STROKE: 'stroke' as const
} as const

export type TableMode = typeof TABLE_MODES[keyof typeof TABLE_MODES]

export const UI_TEXTS = {
  [LEARNING_MODES.SIMPLIFIED]: {
    title: '简化字认读',
    button: '简化字模式',
  },
  [LEARNING_MODES.TRADITIONAL]: {
    title: '繁（异）体字认读',
    button: '繁（异）体字模式',
  }
} as const

export const DISPLAY_MODE_TEXTS = {
  [DISPLAY_MODES.SEQUENTIAL]: {
    title: '顺序模式',
  },
  [DISPLAY_MODES.RANDOM]: {
    title: '随机模式',
  },
} as const

// 列表页面常量定义
export const UI_LABELS = {
  FILTER_GROUP: '按分组',
  FILTER_TAGS: '按标签',
  SEARCH_PLACEHOLDER: '搜索汉字、拼音...',
  TAGS_PLACEHOLDER: '选择标签...',
  // RESULTS_TEXT: '共找到 {count} 个汉字，当前显示第 {page} 页',
  CLEAR_ALL: '全部',
  ITEMS_PER_PAGE: [
    { value: 10, label: '10条/页' },
    { value: 20, label: '20条/页' },
    { value: 50, label: '50条/页' },
    { value: 100, label: '100条/页' }
  ] as const
} as const

export const PAGINATION = {
  FIRST_PAGE: '首页',
  LAST_PAGE: '末页',
  PREV_PAGE: '上一页',
  NEXT_PAGE: '下一页',
  MAX_VISIBLE_PAGES: 5
} as const
