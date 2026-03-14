export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-accent-primary mx-auto mb-4"></div>
        <p className="">加载数据中...</p>
      </div>
    </div>
  )
}
