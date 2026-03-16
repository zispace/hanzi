'use client'

import { BookOpen } from 'lucide-react'
import nextConfig from '@/next.config'; 

interface HeaderProps {
  currentPage: 'home' | 'list' | 'learn'
  title?: string
}

export default function Header({ currentPage, title }: HeaderProps) {
  const getTitle = () => {
    if (title) return title
    switch (currentPage) {
      case 'home': return '汉字认读学习'
      case 'list': return '汉字列表速览'
      case 'learn': return '汉字繁简学习'
      default: return '汉字认读学习'
    }
  }
  const getNavClass = (page: 'home' | 'list' | 'learn') => {
    const baseClass = "px-4 py-2 transition-all duration-250 rounded-md"
    if (page === currentPage) {
      return `${baseClass}  font-medium`
    }
    return `${baseClass} hover: hover:`
  }

  return (
    <header className="border-b border-secondary shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg">
              <BookOpen className="h-6 w-6 " />
            </div>
            <h1 className="text-3xl font-bold text-primary">
              {getTitle()}
            </h1>
          </div>
          <nav className="flex gap-2 p-1 rounded-lg">
            <a href={`${nextConfig.basePath}/`} className={getNavClass('home')}>首页</a>
            <a href={`${nextConfig.basePath}/learn/`} className={getNavClass('learn')}>学习</a>
            <a href={`${nextConfig.basePath}/list/`} className={getNavClass('list')}>列表</a>
          </nav>
        </div>
      </div>
    </header>
  )
}
