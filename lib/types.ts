export interface HanziItem {
  char: string
  simp: string
  trad: string
  ordinal: number | null
  pinyin: string
  strokeCount: number
  radical: string
  freq: number
  ids: string
  group: string
  tags: string[]
}

export const safeValue = (value: any) => {
  return value || ''
}

export const tagMapping: Record<string, string> = {
  "a1": "通用规范一级字（2013）",
  "a2": "通用规范二级字（2013）",
  "a3": "通用规范三级字（2013）",
  "b1": "常用字（1988）",
  "b2": "通用字（1988）",
  "c1": "义务教育教学基本字（2022）",
  "c2": "义务教育常用字表一（2022）",
  "c3": "义务教育常用字表二（2022）",
  "d1": "汉语应用水平/HZC（2016）",
  "d2": "国际中文教育/HSK手写字（2021）",
  "d4": "国际中文教育/HSK（2021）",
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
  "i3": "地名生僻字/多音字"
}

export const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    // 取消当前正在播放的语音
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // 设置中文语言
    utterance.lang = 'zh-CN';

    // 尝试获取可用的中文语音
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

    // 优化语音参数以获得更自然的声音
    utterance.rate = 0.75; // 稍微慢一点
    utterance.pitch = 1.1; // 稍微提高音调
    utterance.volume = 0.8; // 适当音量

    speechSynthesis.speak(utterance);
  }
}
