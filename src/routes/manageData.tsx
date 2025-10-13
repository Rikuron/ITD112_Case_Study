import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/authContext'
import LoadingScreen from '../components/loadingScreen'
import { COLUMN_ORDERS } from '../utils/columnOrders'
import { getAllAgeData, updateAgeData, deleteAgeData } from '../api/ageService'
import { getAllCivilStatusData, updateCivilStatusData, deleteCivilStatusData } from '../api/civilStatusService'
import { 
  getAllMajorDestinationData, updateMajorDestinationData, deleteMajorDestinationData, 
  getAllAllDestinationData, updateAllDestinationData, deleteAllDestinationData
} from '../api/destinationService'
import { getAllEducationData, updateEducationData, deleteEducationData } from '../api/educationService'
import { getAllOccupationData, updateOccupationData, deleteOccupationData } from '../api/occupationService'
import { getAllSexData, updateSexData, deleteSexData } from '../api/sexService'
import { 
  getAllRegionData, updateRegionData, deleteRegionData, 
  getAllProvinceData, updateProvinceData, deleteProvinceData
} from '../api/originService'

export const Route = createFileRoute('/manageData') ({
  component: ManageData
})

type DataType = 'age' | 'civilStatus' | 'majorDestination' | 'allDestination' | 'education' | 'occupation' | 'sex' | 'region' | 'province'

// Column order helper function
const getOrderedColumns = (dataType: DataType, data: any[]): string[] => {
  if (!data || data.length === 0) return []

  const order = COLUMN_ORDERS[dataType]

  if (order && order.length > 0) return order // For predefined column order

  // For dynamic column order, allDestination and province
  const keys = Object.keys(data[0]).filter(key => key !== 'Year')
  return keys.sort()
}

function ManageData() {
  const { userProfile, hasPermission } = useAuth()
  const [selectedDataType, setSelectedDataType] = useState<DataType>('age')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingYear, setEditingYear] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<any | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Check permissions
  const canEdit = hasPermission('write')
  const canDelete = hasPermission('delete')

  useEffect(() => {
    loadData()
  }, [selectedDataType])

  // function to load data from database
  const loadData = async () => {
    setLoading(true)
    setMessage(null)

    try {
      let result: any[]

      switch (selectedDataType) {
        case 'age':
          result = await getAllAgeData()
          break
        case 'civilStatus':
          result = await getAllCivilStatusData()
          break
        case 'majorDestination':
          result = await getAllMajorDestinationData()
          break
        case 'allDestination':
          result = await getAllAllDestinationData()
          break
        case 'education':
          result = await getAllEducationData()
          break
        case 'occupation':
          result = await getAllOccupationData()
          break
        case 'sex':
          result = await getAllSexData()
          break
        case 'region':
          result = await getAllRegionData()
          break
        case 'province':
          result = await getAllProvinceData()
          break
        default:
          result = []
      }

      setData(result)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load data' })
    } finally {
      setLoading(false)
    }
  }

  // function to edit data
  const handleEdit = (item: any) => {
    setEditingYear(item.Year)
    setEditFormData({ ...item })
  }

  const handleCancelEdit = () => {
    setEditingYear(null)
    setEditFormData(null)
  }

  // Submit edited data to DB
  const handleSaveEdit = async () => {
    if (!editFormData || editingYear === null) return

    setLoading(true)
    try {
      const { Year, ...updates } = editFormData

      switch (selectedDataType) {
        case 'age':
          await updateAgeData(editingYear, updates)
          break
        case 'civilStatus':
          await updateCivilStatusData(editingYear, updates)
          break
        case 'majorDestination':
          await updateMajorDestinationData(editingYear, updates)
          break
        case 'allDestination':
          await updateAllDestinationData(editingYear, updates)
          break
        case 'education':
          await updateEducationData(editingYear, updates)
          break
        case 'occupation':
          await updateOccupationData(editingYear, updates)
          break
        case 'sex':
          await updateSexData(editingYear, updates)
          break
        case 'region':
          await updateRegionData(editingYear, updates)
          break
        case 'province':
          await updateProvinceData(editingYear, updates)
          break
        default:
          break
      }

      setMessage({ type: 'success', text: 'Changes saved successfully' })
      handleCancelEdit()
      await loadData()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save changes' })
    } finally {
      setLoading(false)
    }
  }


  // Delete data
  const handleDelete = async (year: number) => {
    if (!confirm(`Are you sure you want to delete data for Year ${year}? This action cannot be undone.`)) return

    setLoading(true)
    try {
      switch (selectedDataType) {
        case 'age':
          await deleteAgeData(year)
          break
        case 'civilStatus':
          await deleteCivilStatusData(year)
          break
        case 'majorDestination':
          await deleteMajorDestinationData(year)
          break
        case 'allDestination':
          await deleteAllDestinationData(year)
          break
        case 'education':
          await deleteEducationData(year)
          break
        case 'occupation':
          await deleteOccupationData(year)
          break
        case 'sex':
          await deleteSexData(year)
          break
        case 'region':
          await deleteRegionData(year)
          break
        case 'province':
          await deleteProvinceData(year)
          break
        default:
          break
      }

      setMessage({ type: 'success', text: `Successfully deleted data of Year ${year}!` })
      await loadData()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete data' })
    } finally {
      setLoading(false)
    }
  }

  // Handle field changes in the edit form
  const handleFieldChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }


  // Check for edit/update/'write' permission
  if (!userProfile || !canEdit) {
    return (
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto bg-red-500/20 border border-red-500 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-red-300 mb-6">
            You don't have permission to manage data. This page requires editor or admin access.
          </p>
        </div>
      </div>      
    )
  }

  // UI
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-white mb-6">Manage Data</h1>

      {/* Data Type Selector */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-2">Select Data Type:</label>
        <select
          value={selectedDataType ?? ''}
          onChange={(e) => setSelectedDataType(e.target.value as DataType)}
          className="px-4 py-2 bg-secondary text-white border border-highlights rounded-lg"
        >
          <option value="age">Age Data</option>
          <option value="sex">Sex Data</option>
          <option value="civilStatus">Civil Status Data</option>
          <option value="education">Education Data</option>
          <option value="occupation">Occupation Data</option>
          <option value="majorDestination">Major Destination Data</option>
          <option value="allDestination">All Destination Data</option>
          <option value="region">Region Data</option>
          <option value="province">Province Data</option>
        </select>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/20 border-green-500 text-green-300' 
            : 'bg-red-500/20 border-red-500 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* Loading State */}
      {loading && ( <LoadingScreen /> )}

      {/* Data Table */}
      {!loading && data.length > 0 && (
        <div className="bg-secondary rounded-lg border border-highlights overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-highlights/20 border-b border-highlights">
                <tr>
                  <th className="px-4 py-3 text-left text-white font-semibold">Year</th>
                  {getOrderedColumns(selectedDataType, data).map(key => (
                    <th key={key} className="px-4 py-3 text-left text-white font-semibold">
                      {key}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.Year} className="border-b border-highlights/30 hover:bg-highlights/10">
                    <td className="px-4 py-3 text-white font-medium">{item.Year}</td>
                    {getOrderedColumns(selectedDataType, data).map(key => (
                      <td key={key} className="px-4 py-3 text-gray-300">
                        {editingYear === item.Year ? (
                          <input
                            type="number"
                            value={editFormData[key]}
                            onChange={(e) => handleFieldChange(key, e.target.value)}
                            className="w-full px-2 py-1 bg-primary border border-highlights rounded text-white text-sm"
                          />
                        ) : (
                          item[key]?.toLocaleString() || '0'
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        {editingYear === item.Year ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {canEdit && (
                              <button
                                onClick={() => handleEdit(item)}
                                disabled={loading}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm cursor-pointer"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(item.Year)}
                                disabled={loading}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm cursor-pointer"
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p>No data available for this type.</p>
        </div>
      )}
    </div>
  )
}