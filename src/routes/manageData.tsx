import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/authContext'
import LoadingScreen from '../components/loadingScreen'
import { COLUMN_ORDERS } from '../utils/columnOrders'
import { addNewAgeYear, getAllAgeData, getAgeDataByYear,updateAgeData, deleteAgeData, deleteAllAgeData } from '../api/ageService'
import { addNewCivilStatusYear, getAllCivilStatusData, getCivilStatusDataByYear, updateCivilStatusData, deleteCivilStatusData, deleteAllCivilStatusData } from '../api/civilStatusService'
import { 
  addNewMajorDestinationYear, getAllMajorDestinationData, getMajorDestinationDataByYear, updateMajorDestinationData, deleteMajorDestinationData, deleteAllMajorDestinationData, 
  addNewAllDestinationYear, getAllAllDestinationData, getAllDestinationCountries, getAllDestinationDataByYear, updateAllDestinationData, deleteAllDestinationData, deleteAllAllDestinationData
} from '../api/destinationService'
import { addNewEducationYear, getAllEducationData, getEducationDataByYear, updateEducationData, deleteEducationData, deleteAllEducationData } from '../api/educationService'
import { addNewOccupationYear, getAllOccupationData, getOccupationDataByYear, updateOccupationData, deleteOccupationData, deleteAllOccupationData } from '../api/occupationService'
import { addNewSexYear, getAllSexData, getSexDataByYear, updateSexData, deleteSexData, deleteAllSexData } from '../api/sexService'
import { 
  addNewRegionYear, getAllRegionData, getRegionDataByYear, updateRegionData, deleteRegionData, deleteAllProvinceData, 
  addNewProvinceYear, getAllProvinceData, getProvinceDataByYear, getProvinces, updateProvinceData, deleteProvinceData, deleteAllRegionData
} from '../api/originService'
import { FaPlus, FaTrash } from 'react-icons/fa'
import DataTypeTabs from '../components/dataTypeTabs'
import type { DataType } from '../components/dataTypeTabs'

export const Route = createFileRoute('/manageData') ({
  component: ManageData
})

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
  const [showAddModal, setShowAddModal] = useState(false)
  const [newYear, setNewYear] = useState<number | ''>('')
  const [newYearData, setNewYearData] = useState<Record<string, number>>({})
  const [availableColumns, setAvailableColumns] = useState<string[]>([])
  const [checkingYear, setCheckingYear] = useState(false)
  const [yearExists, setYearExists] = useState(false)
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

  // function to get available columns
  const loadAvailableColumns = async () => {
    try {
      let columns: string[] = []

      // Fixed columns (Mapped ones in COLUMN_ORDERS)
      const fixedOrder = COLUMN_ORDERS[selectedDataType]
      
      if (fixedOrder && fixedOrder.length > 0) {
        columns = fixedOrder
      } else {
        // Dynamic Columns (Unmapped Data Types)
        switch (selectedDataType) {
          case 'allDestination':
            columns = await getAllDestinationCountries()
            break
          case 'province':
            columns = await getProvinces()
            break
          default:
            columns = []
        }
      }

      setAvailableColumns(columns)

      // Initialize form data with 0
      const initialData: Record<string, number> = {}
      columns.forEach(col => {
        initialData[col] = 0
      })
      setNewYearData(initialData)
    } catch(error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to load columns' })
    }
  }

  // Load columns when data type changes
  useEffect(() => {
    if (showAddModal) loadAvailableColumns()
  }, [selectedDataType, showAddModal])

  // function to check if year exists
  const checkYearExists = async (year: number): Promise<boolean> => {
    try {
      let exists = false

      switch (selectedDataType) {
        case 'age':
          exists = (await getAgeDataByYear(year)) !== null
          break
        case 'civilStatus':
          exists = (await getCivilStatusDataByYear(year)) !== null
          break
        case 'majorDestination':
          exists = (await getMajorDestinationDataByYear(year)) !== null
          break
        case 'allDestination':
          exists = (await getAllDestinationDataByYear(year)) !== null
          break
        case 'education':
          exists = (await getEducationDataByYear(year)) !== null
          break
        case 'occupation':
          exists = (await getOccupationDataByYear(year)) !== null
          break
        case 'sex':
          exists = (await getSexDataByYear(year)) !== null
          break
        case 'region':
          exists = (await getRegionDataByYear(year)) !== null
          break
        case 'province':
          exists = (await getProvinceDataByYear(year)) !== null
          break
        default:
          exists = false
      }

      return exists
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to check year existence' })
      return false
    }
  }

  // Handle opening Add Modal
  const handleOpenAddModal = () => {
    setNewYear('')
    setShowAddModal(true)
    setMessage(null)
  }

  // Handle closing Add Modal
  const handleCloseAddModal = () => {
    setShowAddModal(false)
    setNewYear('')
    setNewYearData({})
    setMessage(null)
    setYearExists(false)
  }

  // Handle year input and check if it exists
  const handleYearChange = async (value: string) => {
    const year = parseInt(value)
    setNewYear(value === '' ? '' : year)

    if (!isNaN(year) && year > 0) {
      setCheckingYear(true)
      setYearExists(false)
      const exists = await checkYearExists(year)
      setCheckingYear(false)
      setYearExists(exists)

      if (exists) {
        setMessage({ type: 'error', text: `Year ${year} already exists! Please edit it in the table below instead.` })
      } else {
        setMessage(null)
      }
    } else {
      setYearExists(false)
      setMessage(null)
    }
  }

  // Handle field changes in the Add Form
  const handleNewFieldChange = (field: string, value: string) => {
    setNewYearData((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }))
  }

  // Submit new year data to DB
  const handleAddNewYear = async () => {
    if (!newYear) {
      setMessage({ type: 'error', text: 'Please enter a valid year' })
      return
    }

    const exists = await checkYearExists(newYear)
    if (exists) {
      setMessage({ type: 'error', text: `Year ${newYear} already exists! Please edit it in the table below instead.` })
      return
    }

    setLoading(true)
    try {
      switch (selectedDataType) {
        case 'age':
          await addNewAgeYear(newYear, newYearData as any)
          break
        case 'civilStatus':
          await addNewCivilStatusYear(newYear, newYearData as any)
          break
        case 'majorDestination':
          await addNewMajorDestinationYear(newYear, newYearData as any)
          break
        case 'allDestination':
          await addNewAllDestinationYear(newYear, availableColumns as any)
          break
        case 'education':
          await addNewEducationYear(newYear, newYearData as any)
          break
        case 'occupation':
          await addNewOccupationYear(newYear, newYearData as any)
          break
        case 'sex':
          await addNewSexYear(newYear, newYearData as any)
          break
        case 'region':
          await addNewRegionYear(newYear, newYearData as any)
          break
        case 'province':
          await addNewProvinceYear(newYear, availableColumns)
          break
        default:
          break
      }

      setMessage({ type: 'success', text: `Successfully added data for Year ${newYear}!` })
      handleCloseAddModal()
      await loadData()
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        setMessage({ type: 'error', text: `${error.message}. Please edit it in the table below instead.` })
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to add new year data' })
      }
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

  // Delete all data
  const handleDeleteAll = async () => {
    if (!confirm(`Final confirmation: Delete all ${data.length} records for ${selectedDataType}`)) return

    setLoading(true)
    try {
      switch (selectedDataType) {
        case 'age':
          await deleteAllAgeData()
          break
        case 'civilStatus':
          await deleteAllCivilStatusData()
          break
        case 'majorDestination':
          await deleteAllMajorDestinationData()
          break
        case 'allDestination':
          await deleteAllAllDestinationData()
          break
        case 'education':
          await deleteAllEducationData()
          break
        case 'occupation':
          await deleteAllOccupationData()
          break
        case 'sex':
          await deleteAllSexData()
          break
        case 'region':
          await deleteAllRegionData()
          break
        case 'province':
          await deleteAllProvinceData()
          break
        default:
          break
      }

      setMessage({ type: 'success', text: `Successfully deleted all ${data.length} records for ${selectedDataType}!` })
      await loadData()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete all data' })
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

      <div className="w-full md:w-auto md:flex-1">
        <label className="block text-white font-semibold mb-2">Select Data Type:</label>
        <DataTypeTabs
          selectedDataType={selectedDataType}
          onDataTypeChange={setSelectedDataType}
          dataTypes={[
            'age',
            'sex',
            'civilStatus',
            'education',
            'occupation',
            'majorDestination',
            'allDestination',
            'region',
            'province'
          ]}
        />
      </div>

      <div className="flex justify-between items-start flex-col md:flex-row gap-4 mb-6">
        {/* Add New Year Button */}
        {canEdit && (
          <div className="flex gap-2 justify-end w-full md:w-auto">
            <button
              onClick={handleOpenAddModal}
              disabled={loading}
              className="flex flex-row items-center gap-1 text-xs md:text-base px-1.5 py-2 md:px-6 md:py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 font-semibold border-2 border-green-500 transition-colors cursor-pointer"
            >
              <FaPlus className="text-sm md:text-base" /> 
              <span>Add New Year Data</span>
            </button>
            {/* Delete All Button (Admin Only) */}
            {canDelete && data.length > 0 && (
              <button
                onClick={handleDeleteAll}
                disabled={loading}
                className="flex flex-row items-center gap-1 text-xs md:text-base m-auto px-1.5 py-2 md:px-6 md:py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 font-semibold border-2 border-red-500 transition-colors cursor-pointer"
              >
                <FaTrash /> Delete All {selectedDataType.replace(/([A-Z])/g, ' $1').trim()} Data
              </button>
            )}
          </div>
        )}
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

      {/* Add New Year Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-highlights rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Add New Year - {selectedDataType.replace(/([A-Z])/g, ' $1').trim()}
            </h2>

            {/* Year Input */}
            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">Year:</label>
              <div className="relative">
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  placeholder="Enter year (e.g., 2024)"
                  className={`w-full px-4 py-2 bg-primary border-2 rounded text-white pr-10 ${
                    checkingYear 
                      ? 'border-yellow-500' 
                      : yearExists 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : newYear && !yearExists 
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                          : 'border-highlights focus:border-highlights'
                  }`}
                />
                {/* Icon indicator */}
                {!checkingYear && newYear && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl">
                    {yearExists ? (
                      <span className="text-red-500" title="Year already exists">❌</span>
                    ) : (
                      <span className="text-green-500" title="Year is available">✓</span>
                    )}
                  </span>
                )}
                {checkingYear && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-yellow-500 animate-pulse">⏳</span>
                  </span>
                )}
              </div>
              
              {/* Status messages */}
              {checkingYear && (
                <p className="text-yellow-400 text-sm mt-1 flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Checking if year exists...
                </p>
              )}
              {!checkingYear && yearExists && newYear && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-2">
                  <span>⚠️</span> Year {newYear} already exists! Please edit it in the table below instead.
                </p>
              )}
              {!checkingYear && newYear && !yearExists && (
                <p className="text-green-400 text-sm mt-1 flex items-center gap-2">
                  <span>✓</span> Year {newYear} is available for adding.
                </p>
              )}
            </div>

            {/* Data Fields */}
            {availableColumns.length > 0 && (
              <div className="mb-4">
                <label className="block text-white font-semibold mb-2">Data Values:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableColumns.map((column) => (
                    <div key={column}>
                      <label className="block text-gray-300 text-sm mb-1">{column}:</label>
                      <input
                        type="number"
                        value={newYearData[column] || 0}
                        onChange={(e) => handleNewFieldChange(column, e.target.value)}
                        min="0"
                        step="1"
                        className="w-full px-3 py-2 bg-primary border border-highlights rounded text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note for region/province */}
            {(selectedDataType === 'region' || selectedDataType === 'province') && (
              <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded text-blue-300 text-sm">
                Note: New records for {selectedDataType} will be initialized with 0 values. You can edit them after creation.
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={handleCloseAddModal}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewYear}
                disabled={loading || checkingYear || !newYear || yearExists}
                className={`px-4 py-2 rounded text-white transition-colors cursor-pointer ${
                  loading || checkingYear || !newYear || yearExists
                    ? 'bg-gray-600 hover:bg-gray-700 opacity-50 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Adding...' : yearExists ? 'Year Already Exists' : 'Add Year'}
              </button>
            </div>
          </div>
        </div>
      )}

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