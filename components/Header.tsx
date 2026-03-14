'use client'

import { BookOpen } from 'lucide-react'

interface HeaderProps {
  currentPage: 'home' | 'list' | 'learn'
  title: string
}

export default function Header({ currentPage, title }: HeaderProps) {
  const getNavClass = (page: 'home' | 'list' | 'learn') => {
    const baseClass = "px-4 py-2 transition-colors"
    if (page === currentPage) {
      return `${baseClass} text-red-600 dark:text-red-500 font-semibold`
    }
    return `${baseClass} text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500`
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-red-600 dark:text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex gap-4">
              <a href="/" className={getNavClass('home')}>首页</a>
              <a href="/learn" className={getNavClass('learn')}>学习</a>
              <a href="/list" className={getNavClass('list')}>列表</a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
