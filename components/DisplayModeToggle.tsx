'use client'

import { useState } from 'react'
import { Grid3X3, Table } from 'lucide-react'
import { colors } from '@/lib/design-system'

interface DisplayModeToggleProps {
  displayMode: 'grid' | 'table'
  onModeChange: (mode: 'grid' | 'table') => void
}

export default function DisplayModeToggle({ displayMode, onModeChange }: DisplayModeToggleProps) {
  return (
    <div className="flex gap-1 bg-[#F5F2ED] p-1 rounded-lg">
      <button
        onClick={() => onModeChange('grid')}
        className={`p-2 rounded-md transition-all duration-250 ${
          displayMode === 'grid' 
            ? 'bg-[#FAF9F6] text-[#DC143C] shadow-subtle' 
            : 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#E8E2D5]'
        }`}
      >
        <Grid3X3 className="h-5 w-5" />
      </button>
      <button
        onClick={() => onModeChange('table')}
        className={`p-2 rounded-md transition-all duration-250 ${
          displayMode === 'table' 
            ? 'bg-[#FAF9F6] text-[#DC143C] shadow-subtle' 
            : 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#E8E2D5]'
        }`}
      >
        <Table className="h-5 w-5" />
      </button>
    </div>
  )
}
