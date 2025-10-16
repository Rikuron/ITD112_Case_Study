interface EmptyStateProps {
  title?: string
  message?: string
  icon?: string
  showUploadLink?: boolean
}
  
export default function EmptyState({ 
  title = "No Data Available",
  message = "No data registered. Please upload data to view charts.",
  icon = "📊",
  showUploadLink = true
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-yellow-500/20 border-2 border-yellow-500 text-yellow-300 rounded-lg p-12 text-center max-w-md">
        <div className="text-6xl mb-4">{icon}</div>
        <p className="font-bold text-2xl mb-3">{title}</p>
        <p className="text-lg mb-4">{message}</p>
        {showUploadLink && (
          <a 
            href="/uploadData" 
            className="inline-block bg-highlights hover:opacity-90 text-white font-semibold py-2 px-6 rounded-lg transition-opacity"
          >
            Go to Upload Page
          </a>
        )}
      </div>
    </div>
  )
}