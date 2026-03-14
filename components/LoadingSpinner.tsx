export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#E8E2D5] border-t-[#DC143C] mx-auto mb-4"></div>
        <p className="text-[#5A5A5A]">加载数据中...</p>
      </div>
    </div>
  )
}
