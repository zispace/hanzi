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
