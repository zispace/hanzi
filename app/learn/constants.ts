// 学习页面常量定义
export const LEARNING_MODES = {
  SIMPLIFIED: 'fanti' as const,
  TRADITIONAL: 'jianti' as const
} as const

export const UI_TEXTS = {
  [LEARNING_MODES.SIMPLIFIED]: {
    title: '简体字认读',
    instruction: '显示简体字，请输入对应的繁体字',
    button: '显示简体',
    placeholder: '输入对应的繁体字',
    hint: '观察九宫格中的汉字，输入对应的繁体字'
  },
  [LEARNING_MODES.TRADITIONAL]: {
    title: '繁体字认读',
    instruction: '显示繁体字，请输入对应的简体字',
    button: '显示繁体',
    placeholder: '输入对应的简体字',
    hint: '观察九宫格中的汉字，输入对应的简体字'
  }
} as const

export const FEEDBACK_MESSAGES = {
  CORRECT: '回答正确！',
  INCORRECT: '回答错误，请再试一次。'
} as const
