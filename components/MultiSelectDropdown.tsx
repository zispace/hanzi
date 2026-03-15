'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { tagMapping } from '@/lib/types'

interface MultiSelectDropdownProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
}

export default function MultiSelectDropdown({ 
  selectedTags, 
  onTagsChange, 
  placeholder = "选择标签..." 
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const tagOptions = Object.entries(tagMapping).map(([code, description]) => ({
    code,
    description
  }))

  const filteredOptions = tagOptions.filter(option =>
    option.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggle = () => {
    setIsOpen(!isOpen)
    setSearchTerm('')
  }

  const handleSelectTag = (tagCode: string) => {
    if (selectedTags.includes(tagCode)) {
      onTagsChange(selectedTags.filter(tag => tag !== tagCode))
    } else {
      onTagsChange([...selectedTags, tagCode])
    }
  }

  const handleRemoveTag = (tagCode: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onTagsChange(selectedTags.filter(tag => tag !== tagCode))
  }

  const handleClearAll = () => {
    onTagsChange([])
    setSearchTerm('')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 触发按钮 */}
      <button
        onClick={handleToggle}
        className="w-full px-4 py-3 input border rounded-lg focus-accent text-left flex items-center justify-between bg-white"
      >
        <div className="flex-1 min-w-0">
          {selectedTags.length === 0 ? (
            <span className="text-muted">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedTags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary text-white rounded"
                >
                  <span className="font-mono text-xs bg-secondary px-1 rounded">
                    {tag}
                  </span>
                  <span
                    onClick={(e) => handleRemoveTag(tag, e)}
                    className="cursor-pointer hover:text-red-500 text-red-300"
                    title="移除标签"
                  >
                    ×
                  </span>
                </span>
              ))}
              {selectedTags.length > 3 && (
                <span className="text-xs text-muted">+{selectedTags.length - 3}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedTags.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                handleClearAll()
              }}
              className="text-xs text-muted hover:text-primary cursor-pointer"
            >
              清除
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* 下拉选项 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-primary rounded-lg shadow-lg max-h-64 overflow-hidden min-w-[320px]">
          {/* 搜索框 */}
          <div className="p-2 border-b border-primary">
            <input
              type="text"
              placeholder="搜索标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 input border rounded focus-accent text-sm"
            />
          </div>

          {/* 选项列表 */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-muted text-sm">
                没有找到匹配的标签
              </div>
            ) : (
              filteredOptions.map(option => (
                <label
                  key={option.code}
                  className="flex items-center gap-2 p-3 hover-bg cursor-pointer border-b border-primary last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(option.code)}
                    onChange={() => handleSelectTag(option.code)}
                    className="rounded border-primary focus-accent"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm truncate" title={option.description}>
                        {option.description}
                      </span>
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>

          {/* 底部操作 */}
          {selectedTags.length > 0 && (
            <div className="p-2 border-t border-primary bg-secondary">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">已选择 {selectedTags.length} 个标签</span>
                <button
                  onClick={handleClearAll}
                  className="text-primary hover:underline"
                >
                  清除所有
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
