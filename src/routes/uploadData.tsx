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
      <h1 className="text-4xl font-bold text-white mb-2 text-center">Upload Data to Firebase</h1>
      <p className="text-gray-400 mb-8 text-center">Upload CSV files for different data types</p>

      {/* Grid Layout for Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Age Data Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
          <h2 className="text-2xl font-bold text-white mb-2">Age Data</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload emigrant age data</p>

          {/* File Selection */}
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">
              Select CSV File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              disabled={uploading}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                       file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                       file:text-xs file:font-semibold file:bg-highlights file:text-white 
                       hover:file:opacity-90 disabled:opacity-50"
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
              <li>Must have "AGE_GROUP" column</li>
              <li>14 age groups required</li>
              <li>Year columns must be numeric</li>
              <li>All values must be numbers</li>
            </ul>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                     hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-opacity"
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

        {/* Placeholder for Sex Data Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights opacity-50">
          <h2 className="text-2xl font-bold text-white mb-2">Sex Data</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload emigrant sex data</p>
          <p className="text-gray-500 text-sm italic">Coming soon...</p>
        </div>

        {/* Placeholder for Occupation Data Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights opacity-50">
          <h2 className="text-2xl font-bold text-white mb-2">Occupation Data</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload emigrant occupation data</p>
          <p className="text-gray-500 text-sm italic">Coming soon...</p>
        </div>

      </div>
    </div>
  )
}