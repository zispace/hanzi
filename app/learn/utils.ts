// 学习页面工具函数
import { HanziItem } from '@/lib/types'
import { LEARNING_MODES, LearningMode } from '@/lib/constants'

/**
 * 获取候选数据：简化字模式时，候选为 hanzi.trad || hanzi.yiti
 * 繁体字模式时，候选为 hanzi.simp
 */
export const getCandidateData = (data: HanziItem[], mode: LearningMode): HanziItem[] => {
  return data.filter(item => {
    return mode === LEARNING_MODES.SIMPLIFIED ? item.trad || item.yiti : item.simp;
  })
}

/**
 * 获取显示字符：根据学习模式返回要显示的字符
 */
type CharArray = Array<{ value: string, type: number }>;

export const getDisplayCharacter = (hanzi: HanziItem, mode: LearningMode): CharArray => {
  const result: CharArray = []
  const item: HanziItem = hanzi;
  const processCharacters = (text: string, type: number) => {
    Array.from(text.replace("～", "")).forEach(char => {
      result.push({ value: char, type })
    })
  }

  if (mode === LEARNING_MODES.TRADITIONAL) {
    if (item.trad) processCharacters(item.trad, 2)
    if (item.yiti) processCharacters(item.yiti, 3)
  } else {
    if (item.simp) processCharacters(item.simp, 1)
  }
  return result
}

/**
 * 获取答案字符：根据学习模式返回对应的答案
 */
export const getAnswerCharacter = (hanzi: HanziItem, mode: LearningMode): string => {
  if (mode === LEARNING_MODES.SIMPLIFIED) {
    return hanzi.trad || hanzi.yiti || hanzi.char
  } else {
    return hanzi.simp || hanzi.char
  }
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
 * 生成顺序汉字数组
 */
export const generateSequentialHanzi = (data: HanziItem[], startIndex: number = 0, count: number = 9): HanziItem[] => {
  const actualStart = startIndex % data.length
  const result: HanziItem[] = []

  for (let i = 0; i < count; i++) {
    const index = (actualStart + i) % data.length
    result.push(data[index])
  }

  return result
}
