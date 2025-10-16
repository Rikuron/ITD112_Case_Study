import { useRef } from 'react'

interface UploadDataCardProps {
  title: string
  description: string
  requirements: string[]
  selectedFile: File | null
  message: { type: 'success' | 'error' | 'info'; text: string } | null
  uploading: boolean
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpload: () => void
  disabled?: boolean
}

export default function UploadDataCard({
  title,
  description,
  requirements,
  selectedFile,
  message,
  uploading,
  onFileSelect,
  onUpload,
  disabled = false
}: UploadDataCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-4 text-sm">{description}</p>

      {/* File Selection */}
      <div className="mb-4">
        <label className="block text-white font-semibold mb-2 text-sm">
          Select CSV File
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={onFileSelect}
          disabled={disabled}
          className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                    file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                    file:text-xs file:font-semibold file:bg-highlights file:text-white 
                    hover:file:opacity-90 disabled:opacity-50 cursor-pointer duration-300 ease-in-out"
        />
        {selectedFile && (
          <p className="mt-2 text-xs text-gray-300">
            Selected: <span className="text-highlights">{selectedFile.name}</span>
          </p>
        )}
      </div>

      {/* Requirements */}
      <div className="mb-4 p-3 bg-secondary rounded border border-highlights">
        <h3 className="text-white font-semibold mb-2 text-sm">📋 Requirements:</h3>
        <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
          {requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </div>

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={disabled || !selectedFile}
        className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                  hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-opacity cursor-pointer duration-300 ease-in-out"
      >
        {uploading ? '⏳ Uploading...' : '🚀 Upload'}
      </button>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg border text-xs ${
          message.type === 'success' 
            ? 'bg-green-500/20 border-green-500 text-green-300' 
            : message.type === 'error'
            ? 'bg-red-500/20 border-red-500 text-red-300'
            : 'bg-blue-500/20 border-blue-500 text-blue-300'
        }`}>
          <p className="font-semibold mb-1">
            {message.type === 'success' ? '✅ Success!' : 
              message.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
          </p>
          <p>{message.text}</p>
        </div>
      )}
    </div>
  )
}