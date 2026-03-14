'use client'

import { useState, useEffect, useMemo } from 'react'
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
  const [selectedGroup, setSelectedGroup] = useState<string>('all')

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


  const groupOptions = useMemo(() => {
    if (!hanziData.length) return ['all']
    const groups = new Set<string>()
    hanziData.forEach(item => {
      const group = safeValue(item.group)
      if (group) groups.add(group)
    })
    return ['all', ...Array.from(groups).sort()]
  }, [hanziData])

  const filteredData = useMemo(() => {
    if (selectedGroup === 'all') return hanziData
    return hanziData.filter(item => safeValue(item.group) === selectedGroup)
  }, [hanziData, selectedGroup])

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
    <div className="min-h-screen transition-all duration-500">
      <Header currentPage="learn" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 控制区域 */}
        <div className="bg-white border rounded-xl shadow-soft p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {showMode === 'fanti' ? '简体字练习（学习繁体）' : '繁体字练习（学习简体）'}
              </h2>
              <div className="text-sm text-muted">
                {showMode === 'fanti' 
                  ? '显示简体字，请输入对应的繁体字' 
                  : '显示繁体字，请输入对应的简体字'
                }
              </div>
              <div className="text-sm ">
                得分: <span className="font-bold ">{score.correct}</span> / {score.total}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMode('fanti')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 transform ${
                  showMode === 'fanti' 
                    ? 'button-primary scale-105 shadow-subtle' 
                    : 'button-secondary hover:scale-105'
                }`}
              >
                显示简体
              </button>
              <button
                onClick={() => setShowMode('jianti')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 transform ${
                  showMode === 'jianti' 
                    ? 'button-primary scale-105 shadow-subtle' 
                    : 'button-secondary hover:scale-105'
                }`}
              >
                显示繁体
              </button>
              <button
                onClick={() => generateNewHanzi(filteredData)}
                className="flex items-center gap-2 px-4 py-2 button-secondary hover:scale-105 transition-all duration-300 transform"
              >
                <Shuffle className="h-4 w-4" />
                换一批
              </button>
            </div>
          </div>
          
          {/* 分组选择器 */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">选择分组：</label>
            <select
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value)
                generateNewHanzi(filteredData)
              }}
              className="px-4 py-2 input border rounded-lg focus-accent"
            >
              {groupOptions.map(group => (
                <option key={group} value={group}>
                  {group === 'all' ? '全部' : group}
                </option>
              ))}
            </select>
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
              <label className=" font-medium">输入答案：</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`输入对应的${showMode === 'fanti' ? '繁体' : '简体'}字`}
                className="flex-1 px-4 py-3 input border rounded-lg focus-accent bg-white text-primary placeholder-muted transition-all duration-250"
              />
              <button
                onClick={checkAnswer}
                className="px-6 py-3  rounded-lg hover: transition-all duration-250 shadow-subtle"
              >
                检查答案
              </button>
              <button
                onClick={() => setShowFanti(!showFanti)}
                className="flex items-center gap-2 px-4 py-3 bg-white border  rounded-lg hover: transition-all duration-250"
              >
                {showFanti ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showFanti ? '隐藏' : '显示'}答案
              </button>
            </div>

            {/* 反馈信息 */}
            {feedback && (
              <div className={`flex items-center gap-2 p-4 rounded-lg ${
                feedback === 'correct' ? 'bg-green-50  border border-green-200' : 'bg-red-50  border border-red-200'
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
              <div className=" border rounded-lg p-4">
                <div className="text-sm mb-2">正确答案：</div>
                <div 
                  className="text-2xl space-x-2"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
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
          <h3 className="font-semibold  mb-2">学习提示</h3>
          <ul className="text-sm  space-y-1">
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
