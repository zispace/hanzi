'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Eye, EyeOff, Shuffle, CheckCircle, XCircle } from 'lucide-react'
import { HanziItem, safeValue, speakText } from '@/lib/types'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import HanziNineGrid from '@/components/HanziNineGrid'

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


  if (!hanziData.length) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header currentPage="learn" title="汉字学习" />

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
          <HanziNineGrid 
            data={currentHanzi} 
            showMode={showMode}
            onSpeak={speakText}
          />

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
