export interface HanziItem {
  char: string
  simp: string
  trad: string
  yiti: string
  ordinal: number | null
  pinyin: string
  strokeCount: number
  radical: string
  freq: number
  ids: string
  group: string
  tags: string[]
}

export const safeValue = (value: any, defaultValue: string = "") => {
  return value || defaultValue
}

export const tagMapping: Record<string, string> = {
  "a1": "通用规范一级字（2013）",
  "a2": "通用规范二级字（2013）",
  "a3": "通用规范三级字（2013）",
  "b1": "常用字（1988）",
  "b2": "通用字（1988）",
  "b3": "简化字表一（1986）",
  "b4": "简化字表二（1986）",
  "b5": "简化字表三（1986）",
  "c1": "义务教育教学基本字（2022）",
  "c2": "义务教育常用字表一（2022）",
  "c3": "义务教育常用字表二（2022）",
  "d1": "汉语应用水平/HZC（2016）",
  "d2": "国际中文教育/HSK手写字（2021）",
  "d3": "国际中文教育/HSK（2021）",
  "e1": "GB2312",
  "e2": "GB12345",
  "e3": "Big5常用字",
  "e4": "Big5次常用字",
  "e5": "古籍印刷规范字（2021）",
  "f1": "台湾常用字",
  "f2": "香港常用字",
  "f3": "香港小学字表",
  "g1": "日本常用汉字（2010）",
  "g2": "韩国基础汉字（2000）",
  "g3": "中日韩共用字（2014）",
  "h1": "简化字",
  "h2": "繁体字",
  "h3": "异体字",
  "i1": "部首",
  "i2": "化学用字",
  "i3": "地名用字",
}


export const tagShortMapping: Record<string, string> = {
  "a1": "一级字",
  "a2": "二级字",
  "a3": "三级字",
  "d1": "HZC",
  "d4": "HSK",
  "e1": "GB2312",
  "e2": "GB12345",
  "e3": "Big5",
  "e4": "Big5",
  "f1": "台湾",
  "f2": "香港",
  "f3": "香港",
  "g1": "日本",
  "g2": "韩国",
}

// 中文语音
export const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.75;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    const voices = speechSynthesis.getVoices();
    const chineseVoice = voices.find(voice =>
      voice.lang.includes('zh') ||
      voice.name.toLowerCase().includes('chinese') ||
      voice.name.toLowerCase().includes('china') ||
      voice.name.toLowerCase().includes('mandarin')
    );

    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    speechSynthesis.speak(utterance);
  }
}
