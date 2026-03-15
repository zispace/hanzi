'use client'

import HanziNineGrid from '@/components/HanziNineGrid'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import { loadHanziData } from '@/lib/dataLoader'
import { HanziItem, safeValue, speakText } from '@/lib/types'
import { CheckCircle, Eye, EyeOff, Shuffle, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FEEDBACK_MESSAGES, LEARNING_MODES, UI_TEXTS } from './constants'
import { extractUniqueGroups, generateRandomHanzi, getCharacterByMode, validateAnswer } from './utils'

export default function LearnPage() {
  const [hanziData, setHanziData] = useState<HanziItem[]>([])
  const [currentHanzi, setCurrentHanzi] = useState<HanziItem[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [learningMode, setLearningMode] = useState<typeof LEARNING_MODES[keyof typeof LEARNING_MODES]>(LEARNING_MODES.SIMPLIFIED)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string>('all')

  useEffect(() => {
    loadHanziData().then(rawData => {
      const data = rawData.filter(item => item.trad || item.simp)
      setHanziData(data)
      startNewRound(data)
    })
      .catch(error => {
        console.error('Error loading data:', error)
      })
  }, [])

  const groupOptions = useMemo(() => {
    if (!hanziData.length) return ['all']
    const groups = extractUniqueGroups(hanziData)
    return ['all', ...groups]
  }, [hanziData])

  const filteredData = useMemo(() => {
    if (selectedGroup === 'all') return hanziData
    return hanziData.filter(item => item.group === selectedGroup)
  }, [hanziData, selectedGroup])

  const startNewRound = (data: HanziItem[]) => {
    const randomHanzi = generateRandomHanzi(data)
    setCurrentHanzi(randomHanzi)
    setShowAnswer(false)
    setUserInput('')
    setFeedback(null)
  }

  const checkAnswer = () => {
    if (!currentHanzi.length) return
    
    const targetChars = currentHanzi.map(h => getCharacterByMode(h, learningMode))
    const isCorrect = validateAnswer(userInput, targetChars)
    
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

        <div className="shadow-soft p-6 mb-8">
          <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">
                {UI_TEXTS[learningMode].title}
              </h2>
              <div className="text-sm text-muted">
                {UI_TEXTS[learningMode].instruction}
              </div>
              <div className="text-sm ">
                得分: <span className="font-bold ">{score.correct}</span> / {score.total}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLearningMode(LEARNING_MODES.SIMPLIFIED)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 transform ${
                  learningMode === LEARNING_MODES.SIMPLIFIED 
                    ? 'button-primary scale-105 shadow-subtle' 
                    : 'button-secondary hover:scale-105'
                }`}
              >
                {UI_TEXTS[LEARNING_MODES.SIMPLIFIED].button}
              </button>
              <button
                onClick={() => setLearningMode(LEARNING_MODES.TRADITIONAL)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 transform ${
                  learningMode === LEARNING_MODES.TRADITIONAL 
                    ? 'button-primary scale-105 shadow-subtle' 
                    : 'button-secondary hover:scale-105'
                }`}
              >
                {UI_TEXTS[LEARNING_MODES.TRADITIONAL].button}
              </button>
              <button
                onClick={() => startNewRound(filteredData)}
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
                const newGroup = e.target.value
                setSelectedGroup(newGroup)
                const newFilteredData = newGroup === 'all' ? hanziData : hanziData.filter(item => item.group === newGroup)
                startNewRound(newFilteredData)
              }}
              className="px-4 py-2 input border rounded-lg focus-accent"
            >
              {groupOptions.map(group => (
                <option key={group} value={group}>
                  {group === 'all' ? '全部' : group}
                </option>
              ))}
            </select>
            <span className="text-sm text-muted">
              (共 {filteredData.length} 字)
            </span>
          </div>
          </div>

          {/* 九宫格汉字显示 */}
          <div className="mt-6">
            <HanziNineGrid 
              data={currentHanzi} 
              showMode={learningMode}
              onSpeak={speakText}
            />
          </div>

          {/* 答案区域 */}
          <div className="space-y-4 hanzi-muted mt-8">
            <div className="flex items-center gap-4">
              <label className=" font-medium">输入答案：</label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={UI_TEXTS[learningMode].placeholder}
                className="flex-1 px-4 py-3 input border rounded-lg focus-accent text-primary placeholder-muted transition-all duration-250"
              />
              <button
                onClick={checkAnswer}
                className="px-6 py-3 border  rounded-lg hover: transition-all duration-250 shadow-subtle"
              >
                检查答案
              </button>
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex items-center gap-2 px-4 py-3 border rounded-lg hover: transition-all duration-250"
              >
                {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showAnswer ? '隐藏' : '显示'}答案
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
                  {feedback === 'correct' ? FEEDBACK_MESSAGES.CORRECT : FEEDBACK_MESSAGES.INCORRECT}
                </span>
              </div>
            )}

            {/* 显示答案 */}
            {showAnswer && (
              <div className="border rounded-lg p-4">
                <div className="text-sm mb-2">正确答案：</div>
                <div className="text-2xl space-x-2 hanzi-font-kai">
                  {currentHanzi.map((hanzi, index) => (
                    <span key={index}>{safeValue(getCharacterByMode(hanzi, learningMode))}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 学习提示 */}
        <div className="card border rounded-lg p-8">
          <h3 className="font-bold mb-2">学习提示</h3>
          <ul className="text-sm  space-y-1">
            <li>观察九宫格中的汉字，输入对应的{learningMode === LEARNING_MODES.SIMPLIFIED ? '繁体' : '简体'}字</li>
            <li>点击“显示答案”可以查看正确答案</li>
            <li>点击语音按钮可以听到发音</li>
            <li>点击“换一批”可以练习新的汉字</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
