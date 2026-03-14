'use client'

import { useState } from 'react'
import { Grid3X3, Table } from 'lucide-react'

interface DisplayModeToggleProps {
  displayMode: 'grid' | 'table'
  onModeChange: (mode: 'grid' | 'table') => void
}

export default function DisplayModeToggle({ displayMode, onModeChange }: DisplayModeToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onModeChange('grid')}
        className={`p-2 rounded-lg transition-colors ${
          displayMode === 'grid' 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        <Grid3X3 className="h-5 w-5" />
      </button>
      <button
        onClick={() => onModeChange('table')}
        className={`p-2 rounded-lg transition-colors ${
          displayMode === 'table' 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        <Table className="h-5 w-5" />
      </button>
    </div>
  )
}
