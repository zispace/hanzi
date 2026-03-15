// 学习页面工具函数
import { HanziItem } from '@/lib/types'
import { LEARNING_MODES } from './constants'

/**
 * 获取汉字字符，根据学习模式返回对应的字符
 * 优先级：目标字段 -> 备用字段 -> 基础字符
 */
export const getCharacterByMode = (hanzi: HanziItem, mode: typeof LEARNING_MODES[keyof typeof LEARNING_MODES]) => {
  const targetField = mode === LEARNING_MODES.SIMPLIFIED ? hanzi.trad : hanzi.simp
  // const fallbackField = mode === LEARNING_MODES.SIMPLIFIED ? hanzi.simp : hanzi.trad
  return targetField || hanzi.char
}

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
 * 生成随机汉字数组
 */
export const generateRandomHanzi = (data: HanziItem[], count: number = 9): HanziItem[] => {
  return [...data].sort(() => 0.5 - Math.random()).slice(0, count)
}

/**
 * 检查答案是否正确
 */
export const validateAnswer = (userInput: string, targetChars: string[]): boolean => {
  const userChars = userInput.trim().split('')
  return userChars.length === targetChars.length && 
    userChars.every((char, index) => char === targetChars[index])
}
