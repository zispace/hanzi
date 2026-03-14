'use client'

import { BookOpen } from 'lucide-react'
import { colors, typography, spacing, utils } from '@/lib/design-system'

interface HeaderProps {
  currentPage: 'home' | 'list' | 'learn'
  title: string
}

export default function Header({ currentPage, title }: HeaderProps) {
  const getNavClass = (page: 'home' | 'list' | 'learn') => {
    const baseClass = "px-4 py-2 transition-all duration-250 rounded-md"
    if (page === currentPage) {
      return `${baseClass} bg-[#DC143C] text-white font-medium`
    }
    return `${baseClass} text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#F5F2ED]`
  }

  return (
    <header className="bg-[#FAF9F6] border-b border-[#E8E2D5] shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#DC143C] rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 
              className="text-3xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: typography.fontFamily.serif.join(', ') }}
            >
              {title}
            </h1>
          </div>
          <nav className="flex gap-2 bg-[#F5F2ED] p-1 rounded-lg">
            <a href="/" className={getNavClass('home')}>首页</a>
            <a href="/learn" className={getNavClass('learn')}>学习</a>
            <a href="/list" className={getNavClass('list')}>列表</a>
          </nav>
        </div>
      </div>
    </header>
  )
}
