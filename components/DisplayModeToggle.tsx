'use client'

import { LIST_MODES, ListMode } from '@/lib/constants'
import { Grid3X3, Table } from 'lucide-react'

interface DisplayModeToggleProps {
  displayMode: ListMode
  onModeChange: (mode: ListMode) => void
}

export default function DisplayModeToggle({ displayMode, onModeChange }: DisplayModeToggleProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg">
      <button
        onClick={() => onModeChange(LIST_MODES.GRID)}
        className={`p-2 rounded-md transition-all duration-250 cursor-pointer ${displayMode === LIST_MODES.GRID
            ? ' shadow-subtle'
            : ' hover: hover:'
          }`}
      >
        <Grid3X3 className="h-5 w-5" />
      </button>
      <button
        onClick={() => onModeChange('table')}
        className={`p-2 rounded-md transition-all duration-250 cursor-pointer ${displayMode === 'table'
            ? ' shadow-subtle'
            : ' hover: hover:'
          }`}
      >
        <Table className="h-5 w-5" />
      </button>
    </div>
  )
}
