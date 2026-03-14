'use client'

import { useState, useMemo, useEffect } from 'react'
import { BookOpen, Volume2, Eye, EyeOff, Shuffle, CheckCircle, XCircle, Moon, Sun } from 'lucide-react'

interface HanziItem {
  index: number
  char: string
  fanti: string
  jianti: string
  group: string
  level: string
  ids: string
  pinyin: string
}

export default function LearnPage() {
  const [hanziData, setHanziData] = useState<HanziItem[]>([])
  const [currentHanzi, setCurrentHanzi] = useState<HanziItem[]>([])
  const [showFanti, setShowFanti] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [showMode, setShowMode] = useState<'fanti' | 'jianti'>('fanti')
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setHanziData(data)
        generateNewHanzi(data)
      })
      .catch(error => {
        console.error('Error loading data:', error)
      })
  }, [])

  const safeValue = (value: any) => {
    return value || ''
  }

  const generateNewHanzi = (data: HanziItem[]) => {
    const randomHanzi = [...data].sort(() => 0.5 - Math.random()).slice(0, 9)
    setCurrentHanzi(randomHanzi)
    setShowFanti(false)
    setUserInput('')
    setFeedback(null)
  }

  const checkAnswer = () => {
    if (!currentHanzi.length) return
    
    const userChars = userInput.trim().split('')
    const targetChars = currentHanzi.map(h => showMode === 'fanti' ? h.fanti : h.jianti)
    
    const isCorrect = userChars.length === targetChars.length && 
      userChars.every((char, index) => char === targetChars[index])
    
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }))
    
    setTimeout(() => {
      setFeedback(null)
    }, 2000)
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  if (!hanziData.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">加载数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-red-600 dark:text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">汉字学习</h1>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex gap-4">
                <a href="/" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">首页</a>
                <a href="/learn" className="px-4 py-2 text-red-600 dark:text-red-500 font-semibold transition-colors">学习</a>
                <a href="/list" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors">列表</a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 控制区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                {showMode === 'fanti' ? '繁体字练习' : '简体字练习'}
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                得分: <span className="font-bold text-green-600 dark:text-green-500">{score.correct}</span> / {score.total}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMode('fanti')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showMode === 'fanti' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                练习繁体
              </button>
              <button
                onClick={() => setShowMode('jianti')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showMode === 'jianti' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                练习简体
              </button>
              <button
                onClick={() => generateNewHanzi(hanziData)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Shuffle className="h-4 w-4" />
                换一批
              </button>
            </div>
          </div>
          
          {/* 九宫格汉字显示 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {currentHanzi.map((hanzi, index) => (
              <div key={hanzi.index} className="relative group">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center">
                    {/* 主要汉字显示 */}
                    <div className="text-6xl font-serif text-gray-800 mb-2" style={{ fontFamily: 'KaiTi, STKaiti, serif' }}>
                      {showMode === 'fanti' ? safeValue(hanzi.jianti) : safeValue(hanzi.fanti)}
                    </div>
                    
                    {/* 拼音 */}
                    <div className="text-sm text-blue-600 mb-2">{safeValue(hanzi.pinyin)}</div>
                    
                    {/* 语音按钮 */}
                    <button
                      onClick={() => speakText(safeValue(hanzi.char))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white rounded-full shadow-md mx-auto"
                    >
                      <Volume2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {/* 序号 */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* 答案区域 */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium">输入答案：</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`输入对应的${showMode === 'fanti' ? '繁体' : '简体'}字`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
              <button
                onClick={checkAnswer}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                检查答案
              </button>
              <button
                onClick={() => setShowFanti(!showFanti)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {showFanti ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showFanti ? '隐藏' : '显示'}答案
              </button>
            </div>

            {/* 反馈信息 */}
            {feedback && (
              <div className={`flex items-center gap-2 p-4 rounded-lg ${
                feedback === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {feedback === 'correct' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {feedback === 'correct' ? '回答正确！' : '回答错误，请再试一次。'}
                </span>
              </div>
            )}

            {/* 显示答案 */}
            {showFanti && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">正确答案：</div>
                <div className="text-2xl font-serif text-gray-800 space-x-2">
                  {currentHanzi.map((hanzi, index) => (
                    <span key={index}>{showMode === 'fanti' ? safeValue(hanzi.fanti) : safeValue(hanzi.jianti)}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 学习提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">学习提示</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 观察九宫格中的汉字，输入对应的{showMode === 'fanti' ? '繁体' : '简体'}字</li>
            <li>• 点击"显示答案"可以查看正确答案</li>
            <li>• 点击语音按钮可以听到标准发音</li>
            <li>• 点击"换一批"可以练习新的汉字</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
