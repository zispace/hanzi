'use client'

import { Filter } from 'lucide-react'
import { tagMapping } from '@/lib/types'

interface TagFilterProps {
  selectedTags: string[]
  onTagChange: (tags: string[]) => void
}

export default function TagFilter({ selectedTags, onTagChange }: TagFilterProps) {
  const handleTagChange = (tagCode: string) => {
    if (selectedTags.includes(tagCode)) {
      onTagChange(selectedTags.filter(tag => tag !== tagCode))
    } else {
      onTagChange([...selectedTags, tagCode])
    }
  }

  const clearAllTags = () => {
    onTagChange([])
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold text-primary">标签过滤</h3>
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            清除所有
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {Object.entries(tagMapping).map(([code, description]) => (
          <label
            key={code}
            className="flex items-center gap-2 p-2 rounded cursor-pointer hover-bg transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedTags.includes(code)}
              onChange={() => handleTagChange(code)}
              className="rounded border-primary focus-accent"
            />
            <span className="text-sm">
              <span className="font-mono text-xs bg-secondary px-1 rounded">{code}</span>
              <span className="ml-2">{description}</span>
            </span>
          </label>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="mt-4 p-2 bg-secondary rounded">
          <div className="text-sm text-muted mb-1">已选择的标签:</div>
          <div className="flex flex-wrap gap-1">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-primary text-white rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
