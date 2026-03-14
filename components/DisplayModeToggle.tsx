'use client'

import { useState } from 'react'
import { Grid3X3, Table } from 'lucide-react'

interface DisplayModeToggleProps {
  displayMode: 'grid' | 'table'
  onModeChange: (mode: 'grid' | 'table') => void
}

export default function DisplayModeToggle({ displayMode, onModeChange }: DisplayModeToggleProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg">
      <button
        onClick={() => onModeChange('grid')}
        className={`p-2 rounded-md transition-all duration-250 ${
          displayMode === 'grid' 
            ? ' shadow-subtle' 
            : ' hover: hover:'
        }`}
      >
        <Grid3X3 className="h-5 w-5" />
      </button>
      <button
        onClick={() => onModeChange('table')}
        className={`p-2 rounded-md transition-all duration-250 ${
          displayMode === 'table' 
            ? ' shadow-subtle' 
            : ' hover: hover:'
        }`}
      >
        <Table className="h-5 w-5" />
      </button>
    </div>
  )
}
