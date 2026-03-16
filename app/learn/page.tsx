'use client'

import HanziNineGrid from '@/components/HanziNineGrid'
import Header from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import { DISPLAY_MODE_TEXTS, DISPLAY_MODES, DisplayMode, LEARNING_MODES, LearningMode, UI_TEXTS } from '@/lib/constants'
import { loadHanziData } from '@/lib/dataLoader'
import { HanziItem, speakText } from '@/lib/types'
import { ArrowLeft, ArrowRight, Eye, EyeOff, RotateCcw, Shuffle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { extractUniqueGroups, generateRandomHanzi, generateSequentialHanzi, getCandidateData } from './utils'

export default function LearnPage() {
  const groupAll = "all";
  const gridCount = 9;
  const [hanziData, setHanziData] = useState<HanziItem[]>([])
  const [currentHanzi, setCurrentHanzi] = useState<HanziItem[]>([])
  const [showAnswer, setShowAnswer] = useState(false)
  const [learningMode, setLearningMode] = useState<LearningMode>(LEARNING_MODES.SIMPLIFIED)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DISPLAY_MODES.SEQUENTIAL)
  const [selectedGroup, setSelectedGroup] = useState<string>(groupAll)
  const [sequentialIndex, setSequentialIndex] = useState(0)
  const [includeYiti, setIncludeYiti] = useState(false)

  useEffect(() => {
    loadHanziData().then(rawData => {
      const data = rawData.filter(item => item.trad || item.simp || item.yiti)
      setHanziData(data)
      startNewRound(data, true)
    })
      .catch(error => {
        console.error('Error loading data:', error)
      })
  }, [])

  const groupOptions = useMemo(() => {
    if (!hanziData.length) return [groupAll]
    const groups = extractUniqueGroups(hanziData)
    return [groupAll, ...groups]
  }, [hanziData])

  const filteredData = useMemo(() => {
    if (selectedGroup === groupAll) return hanziData
    return hanziData.filter(item => item.group === selectedGroup)
  }, [hanziData, selectedGroup])

  const candidateData = useMemo(() => {
    return getCandidateData(filteredData, learningMode, includeYiti)
  }, [filteredData, learningMode, displayMode, includeYiti])

  // 键盘快捷键翻页
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (displayMode === DISPLAY_MODES.SEQUENTIAL) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          handlePrevious()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          handleNext()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [displayMode, sequentialIndex, candidateData, includeYiti])

  // 当候选数据变化时，自动重新生成当前汉字
  useEffect(() => {
    if (candidateData.length === 0) {
      setCurrentHanzi([])
    } else {
      const newHanzi = displayMode === DISPLAY_MODES.RANDOM
        ? generateRandomHanzi(candidateData, gridCount)
        : generateSequentialHanzi(candidateData, sequentialIndex, gridCount)
      setCurrentHanzi(newHanzi)
    }
  }, [candidateData, sequentialIndex, displayMode])

  const handlePrevious = () => {
    if (candidateData.length === 0) {
      setCurrentHanzi([])
      return
    }
    const newIndex = Math.max(0, sequentialIndex - gridCount)
    setSequentialIndex(newIndex)
    const newHanzi = generateSequentialHanzi(candidateData, newIndex, gridCount)
    setCurrentHanzi(newHanzi)
  }

  const handleNext = () => {
    if (candidateData.length === 0) {
      setCurrentHanzi([])
      return
    }
    const newIndex = sequentialIndex + gridCount
    if (newIndex >= candidateData.length) return
    setSequentialIndex(newIndex)
    const newHanzi = generateSequentialHanzi(candidateData, newIndex, gridCount)
    setCurrentHanzi(newHanzi)
  }

  const startNewRound = (data: HanziItem[], reset: boolean = false, numOfChars: number = gridCount) => {
    const candidates = getCandidateData(data, learningMode, includeYiti)
    if (candidateData.length === 0) {
      setCurrentHanzi([])
      return
    }
    let currentIndex = sequentialIndex
    if (reset) {
      currentIndex = 0
      setSequentialIndex(0)
    }

    let newHanzi: HanziItem[] = []
    if (displayMode === DISPLAY_MODES.RANDOM) {
      newHanzi = generateRandomHanzi(candidates, numOfChars)
    } else {
      newHanzi = generateSequentialHanzi(candidates, currentIndex, numOfChars)
    }
    setCurrentHanzi(newHanzi)
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
          {/* 学习模式选择 */}
          <div className="card p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">学习模式</h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {Object.entries(LEARNING_MODES).map(([modeKey, modeValue]) => (
                <div key={modeValue} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`${modeKey.toLowerCase()}-mode`}
                    name="learning-mode"
                    checked={learningMode === modeValue}
                    onChange={() => {
                      setLearningMode(modeValue)
                      setSelectedGroup(groupAll)
                      setSequentialIndex(0)
                      const newFilteredData = hanziData // selectedGroup will be 'all'
                      startNewRound(newFilteredData, true)
                    }}
                    className="w-4 h-4 text-accent-primary rounded focus:ring-accent-primary"
                  />
                  <label htmlFor={`${modeKey.toLowerCase()}-mode`} className="text-sm font-medium">
                    {UI_TEXTS[modeValue].button}
                  </label>
                </div>
              ))}
            </div>

            {/* 显示模式选择 */}
            <h3 className="text-md font-semibold mb-3">显示模式</h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {Object.entries(DISPLAY_MODE_TEXTS).map(([mode, text]) => (
                <div key={mode} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`${mode}-mode`}
                    name="display-mode"
                    checked={displayMode === mode}
                    onChange={() => {
                      setDisplayMode(mode as DisplayMode)
                      startNewRound(filteredData, true)
                    }}
                    className="w-4 h-4 text-accent-primary rounded focus:ring-accent-primary"
                  />
                  <label htmlFor={`${mode}-mode`} className="text-sm font-medium">
                    {text.title}
                  </label>
                </div>
              ))}
            </div>

            {/* 分组选择器 */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium">选择分组：</label>
              <select
                value={selectedGroup}
                onChange={(e) => {
                  const newGroup = e.target.value
                  setSelectedGroup(newGroup)
                  const newFilteredData = newGroup === groupAll ? hanziData : hanziData.filter(item => item.group === newGroup)
                  startNewRound(newFilteredData, true)
                }}
                className="px-4 py-2 input border rounded-lg focus-accent"
              >
                {groupOptions.map(group => (
                  <option key={group} value={group}>
                    {group === groupAll ? '全部' : group}
                  </option>
                ))}
              </select>

              <span className="text-sm text-muted">
                (共 {candidateData.length} 字)
              </span>

              {/* 包含异体字选项 */}
              <input
                type="checkbox"
                id="include-yiti"
                checked={includeYiti}
                onChange={(e) => {
                  setIncludeYiti(e.target.checked)
                  // startNewRound(filteredData, true)
                }}
                className="w-4 h-4 text-accent-primary rounded focus:ring-accent-primary"
              />
              <label htmlFor="include-yiti" className="text-sm font-medium">
                包含异体字
              </label>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  startNewRound(filteredData, true)
                }}
                className="flex items-center gap-2 px-4 py-2 button-secondary hover:scale-105 transition-all duration-300 transform"
              >
                {displayMode === DISPLAY_MODES.RANDOM ? <><Shuffle className="h-4 w-4" />换一批</> : <><RotateCcw className="h-4 w-4" />重新开始</>}
              </button>

              {displayMode === DISPLAY_MODES.SEQUENTIAL && (
                <>
                  <button
                    onClick={handlePrevious}
                    disabled={sequentialIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 button-secondary hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    上一批
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={sequentialIndex + gridCount >= candidateData.length}
                    className="flex items-center gap-2 px-4 py-2 button-secondary hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一批
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-muted">
                    进度: {Math.floor(sequentialIndex / gridCount) + 1} / {Math.ceil(candidateData.length / gridCount)}
                  </span>
                </>
              )}

              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 transform ${showAnswer
                  ? 'button-accent hover:scale-105'
                  : 'button-secondary hover:scale-105'
                  }`}
              >
                {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showAnswer ? '隐藏答案' : '显示答案'}
              </button>
            </div>
          </div>

          {/* 九宫格汉字显示 */}
          <div className="mt-6">
            <HanziNineGrid
              data={currentHanzi}
              showMode={learningMode}
              showAnswer={showAnswer}
              onSpeak={speakText}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
