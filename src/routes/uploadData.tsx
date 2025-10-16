import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../context/authContext'
import UploadDataCard from '../components/uploadDataCard'
import { uploadConfigs, type DataType } from '../utils/uploadCardConfig'

export const Route = createFileRoute('/uploadData')({
  component: UploadData,
})

function UploadData() {
  const { userProfile, hasPermission } = useAuth()
  const [uploading, setUploading] = useState<DataType | null>(null)
  const [messages, setMessages] = useState<Record<DataType, { type: 'success' | 'error' | 'info'; text: string } | null>>({
    age: null,
    education: null,
    occupation: null,
    sex: null,
    civilStatus: null,
    majorDestination: null,
    allDestination: null,
    region: null,
    province: null
  })
  const [selectedFiles, setSelectedFiles] = useState<Record<DataType, File | null>>({
    age: null,
    education: null,
    occupation: null,
    sex: null,
    civilStatus: null,
    majorDestination: null,
    allDestination: null,
    region: null,
    province: null
  })
  
  const handleFileSelect = (type: DataType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [type]: file }))
      setMessages(prev => ({ ...prev, [type]: null }))
    }
  }

  const handleUpload = async (type: DataType) => {
    const selectedFile = selectedFiles[type]
    
    if (!selectedFile) {
      setMessages(prev => ({ ...prev, [type]: { type: 'error', text: 'Please select a file first' } }))
      return
    }

    setUploading(type)
    setMessages(prev => ({ ...prev, [type]: { type: 'info', text: 'Uploading and validating data...' } }))
    
    try {
      const uploadFunction = uploadConfigs[type].uploadFunction
      const result = await uploadFunction(selectedFile)
      
      setMessages(prev => ({ 
        ...prev, 
        [type]: { 
          type: 'success', 
          text: `${result.message}. You can now view the charts!` 
        }
      }))
      setSelectedFiles(prev => ({ ...prev, [type]: null }))
    } catch (error: any) {
      setMessages(prev => ({ 
        ...prev, 
        [type]: { 
          type: 'error', 
          text: error.message || 'Upload failed' 
        }
      }))
    } finally {
      setUploading(null)
    }
  }

  // Access control check
  if (!userProfile || !hasPermission('upload_data')) {
    return (
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-red-300 mb-6">
            You don't have permission to upload data. This page requires editor or admin access.
          </p>
          <p className="text-gray-400 text-sm">
            {!userProfile 
              ? 'Please sign in to access this page.' 
              : `Your role: ${userProfile.role.toUpperCase()}`
            }
          </p>
        </div>
      </div>
    )
  }

  // UI
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">Upload Data to Firebase</h1>
      <p className="text-gray-400 mb-8 text-center">Upload CSV files for different data types</p>

      {/* Grid Layout for Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(Object.keys(uploadConfigs) as DataType[]).map(type => (
          <UploadDataCard
            key={type}
            title={uploadConfigs[type].title}
            description={uploadConfigs[type].description}
            requirements={uploadConfigs[type].requirements}
            selectedFile={selectedFiles[type]}
            message={messages[type]}
            uploading={uploading === type}
            onFileSelect={(e) => handleFileSelect(type, e)}
            onUpload={() => handleUpload(type)}
            disabled={uploading !== null}
          />
        ))}
      </div>
    </div>
  )
}