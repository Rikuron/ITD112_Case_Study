import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { uploadAgeCSVToFirebase } from '../utils/uploadAgeData'
import { uploadEducationCSVToFirebase } from '../utils/uploadEducationData'
import { uploadOccupationCSVToFirebase } from '../utils/uploadOccupationData'
import { uploadSexCSVToFirebase } from '../utils/uploadSexData'
import { uploadCivilStatusCSVToFirebase } from '../utils/uploadCivilStatusData'
import { uploadMajorDestinationCSVToFirebase } from '../utils/uploadDestinationData'
import { uploadAllDestinationCSVToFirebase } from '../utils/uploadDestinationData'
import { uploadRegionCSVToFirebase } from '../utils/uploadOriginData'
import { uploadProvinceCSVToFirebase } from '../utils/uploadOriginData'

export const Route = createFileRoute('/uploadData')({
  component: UploadData,
})

type DataType = 'age' | 'education' | 'occupation' | 'sex' | 'civilStatus' | 'majorDestination' | 'allDestination' | 'region' | 'province'

function UploadData() {
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
  const fileInputRefs = {
    age: useRef<HTMLInputElement>(null),
    education: useRef<HTMLInputElement>(null),
    occupation: useRef<HTMLInputElement>(null),
    sex: useRef<HTMLInputElement>(null),
    civilStatus: useRef<HTMLInputElement>(null),
    majorDestination: useRef<HTMLInputElement>(null),
    allDestination: useRef<HTMLInputElement>(null),
    region: useRef<HTMLInputElement>(null),
    province: useRef<HTMLInputElement>(null)
  }

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
      let result
      if (type === 'age') {
        result = await uploadAgeCSVToFirebase(selectedFile)
      } else if (type === 'education') {
        result = await uploadEducationCSVToFirebase(selectedFile)
      } else if (type === 'occupation') {
        result = await uploadOccupationCSVToFirebase(selectedFile)
      } else if (type === 'sex') {
        result = await uploadSexCSVToFirebase(selectedFile)
      } else if (type === 'civilStatus') {
        result = await uploadCivilStatusCSVToFirebase(selectedFile)
      } else if (type === 'majorDestination') {
        result = await uploadMajorDestinationCSVToFirebase(selectedFile)
      } else if (type === 'allDestination') {
        result = await uploadAllDestinationCSVToFirebase(selectedFile)
      } else if (type === 'region') {
        result = await uploadRegionCSVToFirebase(selectedFile)
      } else if (type === 'province') {
        result = await uploadProvinceCSVToFirebase(selectedFile)
      }
      
      setMessages(prev => ({ 
        ...prev, 
        [type]: { 
          type: 'success', 
          text: `${result!.message}. You can now view the charts!` 
        }
      }))
      setSelectedFiles(prev => ({ ...prev, [type]: null }))
      if (fileInputRefs[type].current) fileInputRefs[type].current!.value = ''
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
              ref={fileInputRefs.age}
              type="file"
              accept=".csv"
              onChange={e => handleFileSelect('age', e)}
              disabled={uploading !== null}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                       file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                       file:text-xs file:font-semibold file:bg-highlights file:text-white 
                       hover:file:opacity-90 disabled:opacity-50"
            />
            {selectedFiles.age && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: <span className="text-highlights">{selectedFiles.age.name}</span>
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
            onClick={() => handleUpload('age')}
            disabled={uploading !== null || !selectedFiles.age}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                     hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-opacity"
          >
            {uploading === 'age' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>

          {/* Message Display */}
          {messages.age && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              messages.age.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : messages.age.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-blue-500/20 border-blue-500 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">
                {messages.age.type === 'success' ? '✅ Success!' : 
                 messages.age.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
              </p>
              <p>{messages.age.text}</p>
            </div>
          )}
        </div>

        {/* Civil Status Data Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
        <h2 className="text-2xl font-bold text-white mb-2">Civil Status Data</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload emigrant civil status data</p>

          {/* File Selection */}
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">
              Select CSV File
            </label>
            <input
              ref={fileInputRefs.civilStatus}
              type="file"
              accept=".csv"
              onChange={e => handleFileSelect('civilStatus', e)}
              disabled={uploading !== null}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                       file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                       file:text-xs file:font-semibold file:bg-highlights file:text-white 
                       hover:file:opacity-90 disabled:opacity-50"
            />
            {selectedFiles.civilStatus && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: <span className="text-highlights">{selectedFiles.civilStatus.name}</span>
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="mb-4 p-3 bg-secondary rounded border border-highlights">
            <h3 className="text-white font-semibold mb-2 text-sm">📋 Requirements:</h3>
            <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
              <li>Must have "YEAR" column</li>
              <li>7 civil status categories required</li>
              <li>Year columns must be numeric</li>
              <li>All values must be numbers</li>
            </ul>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => handleUpload('civilStatus')}
            disabled={uploading !== null || !selectedFiles.civilStatus}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                     hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-opacity"
          >
            {uploading === 'civilStatus' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>

          {/* Message Display */}
          {messages.civilStatus && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              messages.civilStatus.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : messages.civilStatus.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-blue-500/20 border-blue-500 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">
                {messages.civilStatus.type === 'success' ? '✅ Success!' : 
                 messages.civilStatus.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
              </p>
              <p>{messages.civilStatus.text}</p>
            </div>
          )}
        </div>

        {/* Major Destination Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
          <h2 className="text-2xl font-bold text-white mb-2">Major Destination</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload major destination data (1981-2020)</p>

          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">Select CSV File</label>
            <input
              ref={fileInputRefs.majorDestination}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelect('majorDestination', e)}
              disabled={uploading !== null}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                      file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                      file:text-xs file:font-semibold file:bg-highlights file:text-white 
                      hover:file:opacity-90 disabled:opacity-50"
            />
            {selectedFiles.majorDestination && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: <span className="text-highlights">{selectedFiles.majorDestination.name}</span>
              </p>
            )}
          </div>

          <div className="mb-4 p-3 bg-secondary rounded border border-highlights">
            <h3 className="text-white font-semibold mb-2 text-sm">📋 Requirements:</h3>
            <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
              <li>Must have YEAR column</li>
              <li>11 major country columns required</li>
              <li>Years from 1981-2020</li>
            </ul>
          </div>

          <button
            onClick={() => handleUpload('majorDestination')}
            disabled={uploading !== null || !selectedFiles.majorDestination}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {uploading === 'majorDestination' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>

          {messages.majorDestination && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              messages.majorDestination.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : messages.majorDestination.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-blue-500/20 border-blue-500 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">
                {messages.majorDestination.type === 'success' ? '✅ Success!' : 
                messages.majorDestination.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
              </p>
              <p>{messages.majorDestination.text}</p>
            </div>
          )}
        </div>

        {/* All Destination Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
          <h2 className="text-2xl font-bold text-white mb-2">All Destinations</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload all destination countries (1981-2020)</p>

          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">Select CSV File</label>
            <input
              ref={fileInputRefs.allDestination}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelect('allDestination', e)}
              disabled={uploading !== null}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                      file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                      file:text-xs file:font-semibold file:bg-highlights file:text-white 
                      hover:file:opacity-90 disabled:opacity-50"
            />
            {selectedFiles.allDestination && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: <span className="text-highlights">{selectedFiles.allDestination.name}</span>
              </p>
            )}
          </div>

          <div className="mb-4 p-3 bg-secondary rounded border border-highlights">
            <h3 className="text-white font-semibold mb-2 text-sm">📋 Requirements:</h3>
            <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
              <li>Must have COUNTRY column</li>
              <li>Year columns (1981-2020)</li>
              <li>~175 countries</li>
            </ul>
          </div>

          <button
            onClick={() => handleUpload('allDestination')}
            disabled={uploading !== null || !selectedFiles.allDestination}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {uploading === 'allDestination' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>

          {messages.allDestination && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              messages.allDestination.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : messages.allDestination.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-blue-500/20 border-blue-500 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">
                {messages.allDestination.type === 'success' ? '✅ Success!' : 
                messages.allDestination.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
              </p>
              <p>{messages.allDestination.text}</p>
            </div>
          )}
        </div>


        {/* Education Data Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
          <h2 className="text-2xl font-bold text-white mb-2">Education Data</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload emigrant education data</p>

          {/* File Selection */}
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">
              Select CSV File
            </label>
            <input
              ref={fileInputRefs.education}
              type="file"
              accept=".csv"
              onChange={e => handleFileSelect('education', e)}
              disabled={uploading !== null}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                       file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                       file:text-xs file:font-semibold file:bg-highlights file:text-white 
                       hover:file:opacity-90 disabled:opacity-50"
            />
            {selectedFiles.education && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: <span className="text-highlights">{selectedFiles.education.name}</span>
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="mb-4 p-3 bg-secondary rounded border border-highlights">
            <h3 className="text-white font-semibold mb-2 text-sm">📋 Requirements:</h3>
            <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
              <li>Must have "EDUCATIONAL ATTAINMENT" column</li>
              <li>14 education levels required</li>
              <li>Year columns must be numeric</li>
              <li>All values must be numbers</li>
            </ul>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => handleUpload('education')}
            disabled={uploading !== null || !selectedFiles.education}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                     hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-opacity"
          >
            {uploading === 'education' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>

          {/* Message Display */}
          {messages.education && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              messages.education.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : messages.education.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-blue-500/20 border-blue-500 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">
                {messages.education.type === 'success' ? '✅ Success!' : 
                 messages.education.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
              </p>
              <p>{messages.education.text}</p>
            </div>
          )}
        </div>

        {/* Occupation Data Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
          <h2 className="text-2xl font-bold text-white mb-2">Occupation Data</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload emigrant occupation data (1981-2020)</p>

          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">Select CSV File</label>
            <input
              ref={fileInputRefs.occupation}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelect('occupation', e)}
              disabled={uploading !== null}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                      file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                      file:text-xs file:font-semibold file:bg-highlights file:text-white 
                      hover:file:opacity-90 disabled:opacity-50"
            />
            {selectedFiles.occupation && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: <span className="text-highlights">{selectedFiles.occupation.name}</span>
              </p>
            )}
          </div>

          <div className="mb-4 p-3 bg-secondary rounded border border-highlights">
            <h3 className="text-white font-semibold mb-2 text-sm">📋 Requirements:</h3>
            <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
              <li>Must have "Occupation" column</li>
              <li>14 occupation types required</li>
              <li>Year columns (1981-2020)</li>
            </ul>
          </div>

          <button
            onClick={() => handleUpload('occupation')}
            disabled={uploading !== null || !selectedFiles.occupation}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {uploading === 'occupation' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>

          {messages.occupation && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              messages.occupation.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : messages.occupation.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-blue-500/20 border-blue-500 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">
                {messages.occupation.type === 'success' ? '✅ Success!' : 
                messages.occupation.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
              </p>
              <p>{messages.occupation.text}</p>
            </div>
          )}
        </div>


        {/* Sex Data Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
          <h2 className="text-2xl font-bold text-white mb-2">Sex Data</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload emigrant sex data (1981-2020)</p>

          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">Select CSV File</label>
            <input
              ref={fileInputRefs.sex}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelect('sex', e)}
              disabled={uploading !== null}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                      file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                      file:text-xs file:font-semibold file:bg-highlights file:text-white 
                      hover:file:opacity-90 disabled:opacity-50"
            />
            {selectedFiles.sex && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: <span className="text-highlights">{selectedFiles.sex.name}</span>
              </p>
            )}
          </div>

          <div className="mb-4 p-3 bg-secondary rounded border border-highlights">
            <h3 className="text-white font-semibold mb-2 text-sm">📋 Requirements:</h3>
            <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
              <li>Must have YEAR, MALE, FEMALE columns</li>
              <li>Years from 1981-2020</li>
              <li>All values must be numbers</li>
            </ul>
          </div>

          <button
            onClick={() => handleUpload('sex')}
            disabled={uploading !== null || !selectedFiles.sex}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {uploading === 'sex' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>

          {messages.sex && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              messages.sex.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : messages.sex.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-blue-500/20 border-blue-500 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">
                {messages.sex.type === 'success' ? '✅ Success!' : 
                messages.sex.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
              </p>
              <p>{messages.sex.text}</p>
            </div>
          )}
        </div>

        {/* Region Origin Data Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
          <h2 className="text-2xl font-bold text-white mb-2">Origin (Region)</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload emigrant origin data by region</p>

          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">Select CSV File</label>
            <input
              ref={fileInputRefs.region}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelect('region', e)}
              disabled={uploading !== null}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                      file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                      file:text-xs file:font-semibold file:bg-highlights file:text-white 
                      hover:file:opacity-90 disabled:opacity-50"
            />
            {selectedFiles.region && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: <span className="text-highlights">{selectedFiles.region.name}</span>
              </p>
            )}
          </div>

          <div className="mb-4 p-3 bg-secondary rounded border border-highlights">
            <h3 className="text-white font-semibold mb-2 text-sm">📋 Requirements:</h3>
            <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
              <li>Must have "REGION" column</li>
              <li>17 regions required</li>
              <li>Year columns (1988-2020)</li>
              <li>All values must be numbers</li>
            </ul>
          </div>

          <button
            onClick={() => handleUpload('region')}
            disabled={uploading !== null || !selectedFiles.region}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {uploading === 'region' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>

          {messages.region && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              messages.region.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : messages.region.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-blue-500/20 border-blue-500 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">
                {messages.region.type === 'success' ? '✅ Success!' : 
                messages.region.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
              </p>
              <p>{messages.region.text}</p>
            </div>
          )}
        </div>

        {/* Province Origin Data Upload Card */}
        <div className="bg-primary rounded-lg shadow-lg p-6 border-2 border-highlights">
          <h2 className="text-2xl font-bold text-white mb-2">Origin (Province)</h2>
          <p className="text-gray-400 mb-4 text-sm">Upload emigrant origin data by province</p>

          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm">Select CSV File</label>
            <input
              ref={fileInputRefs.province}
              type="file"
              accept=".csv"
              onChange={(e) => handleFileSelect('province', e)}
              disabled={uploading !== null}
              className="w-full p-2 bg-secondary text-white rounded border border-highlights text-sm
                      file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 
                      file:text-xs file:font-semibold file:bg-highlights file:text-white 
                      hover:file:opacity-90 disabled:opacity-50"
            />
            {selectedFiles.province && (
              <p className="mt-2 text-xs text-gray-300">
                Selected: <span className="text-highlights">{selectedFiles.province.name}</span>
              </p>
            )}
          </div>

          <div className="mb-4 p-3 bg-secondary rounded border border-highlights">
            <h3 className="text-white font-semibold mb-2 text-sm">📋 Requirements:</h3>
            <ul className="text-gray-300 text-xs space-y-1 list-disc list-inside">
              <li>Must have "PROVINCE" column</li>
              <li>82 provinces required</li>
              <li>Year columns (1988-2020)</li>
              <li>All values must be numbers</li>
            </ul>
          </div>

          <button
            onClick={() => handleUpload('province')}
            disabled={uploading !== null || !selectedFiles.province}
            className="w-full bg-highlights text-white py-2.5 rounded-lg font-semibold text-sm
                    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {uploading === 'province' ? '⏳ Uploading...' : '🚀 Upload'}
          </button>

          {messages.province && (
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              messages.province.type === 'success' 
                ? 'bg-green-500/20 border-green-500 text-green-300' 
                : messages.province.type === 'error'
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-blue-500/20 border-blue-500 text-blue-300'
            }`}>
              <p className="font-semibold mb-1">
                {messages.province.type === 'success' ? '✅ Success!' : 
                messages.province.type === 'error' ? '❌ Error' : 'ℹ️ Info'}
              </p>
              <p>{messages.province.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}