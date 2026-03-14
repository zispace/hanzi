export interface HanziItem {
  index: number
  char: string
  fanti: string
  jianti: string
  group: string
  level: string
  ids: string
  pinyin: string
}

export const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    '一级': 'bg-green-100 text-green-800',
    '二级': 'bg-blue-100 text-blue-800',
    '三级': 'bg-yellow-100 text-yellow-800',
    '四级': 'bg-orange-100 text-orange-800',
  }
  return colors[level] || 'bg-gray-100 text-gray-800'
}

export const safeValue = (value: any) => {
  return value || ''
}

export const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }
}
