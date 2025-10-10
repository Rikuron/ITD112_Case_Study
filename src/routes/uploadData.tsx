import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { uploadAgeCSVToFirebase } from '../utils/uploadAgeData'

export const Route = createFileRoute('/uploadData')({
  component: UploadData,
})

function UploadData() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setMessage(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select a file first' })
      return
    }

    setUploading(true)
    setMessage({ type: 'info', text: 'Uploading and validating data...' })
    
    try {
      const result = await uploadAgeCSVToFirebase(selectedFile)
      setMessage({ 
        type: 'success', 
        text: `${result.message}. You can now view the charts!` 
      })
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Upload failed' 
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-primary rounded-lg shadow-lg p-8 border-2 border-highlights">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Age Data</h1>
        <p className="text-gray-400 mb-6">Upload CSV file containing emigrant age data to Firebase</p>

        {/* File Selection */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-2">
            Select CSV File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={uploading}
            className="w-full p-3 bg-secondary text-white rounded border border-highlights 
                     file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 
                     file:text-sm file:font-semibold file:bg-highlights file:text-white 
                     hover:file:opacity-90 disabled:opacity-50"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-300">
              Selected: <span className="text-highlights">{selectedFile.name}</span>
            </p>
          )}
        </div>

        {/* Requirements */}
        <div className="mb-6 p-4 bg-secondary rounded border border-highlights">
          <h3 className="text-white font-semibold mb-2">📋 CSV Requirements:</h3>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Must have an "AGE_GROUP" column</li>
            <li>Must include all 14 age groups (14 - Below, 15 - 19, etc.)</li>
            <li>Year columns must be numeric (e.g., 1981, 1982, ...)</li>
            <li>All values must be numbers</li>
          </ul>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="w-full bg-highlights text-white py-3 rounded-lg font-semibold 
                   hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-opacity"
        >
          {uploading ? '⏳ Uploading...' : '🚀 Upload to Firebase'}
        </button>

        {/* Message Display */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg border ${
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
            <p className="text-sm">{message.text}</p>
          </div>
        )}
      </div>
    </div>
  )
}