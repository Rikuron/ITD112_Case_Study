import { useState, useEffect, useMemo } from 'react'
import { getAllAllDestinationData } from '../api/destinationService'

interface CountryData {
  country: string
  total: number
  category: string
  color: string
}

interface UseParseAllDestinationDataReturn {
  mapData: CountryData[]
  years: number[]
  loading: boolean
  error: string | null
}

export const useParseAllDestinationData = (year: number | 'all' = 'all'): UseParseAllDestinationDataReturn => {
  const [mapData, setMapData] = useState<CountryData[]>([])
  const [allRows, setAllRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFromFirebase()
  }, [])

  useEffect(() => {
    if (allRows.length === 0) return

    const rows = year === 'all' ? allRows : allRows.filter((r: any) => r.Year === year)
  
    // Get all country names
    const allCountries = Object.keys(rows[0]).filter(key => key !== 'Year')

    // Calculate totals for each country
    const countryTotals = allCountries.map(country => {
      let total = 0
      rows.forEach(row => {
        total += row[country] || 0
      })

      return { country, total }
    })

    // Classify countries into categories for Choropleth Map
    const categorizedData = countryTotals.map(({ country, total }) => {
      let category = ''
      let color = ''

      if (total >= 1000000) {
        category = 'Extreme Concentration'
        color = '#5EEAD4'
      } else if (total >= 500000) {
        category = 'Significant Concentration'
        color = '#2DD4BF'
      } else if (total >= 100000) {
        category = 'Moderate Concentration'
        color = '#0D9488'
      } else if (total >= 10000) {
        category = 'Slight Concentration'
        color = '#155E75'
      } else {
        category = 'Nil Concentration'
        color = '#1E293B'
      }

      return { country, total, category, color}
    })

    setMapData(categorizedData)
    setLoading(false)
  }, [year, allRows])

  const years = useMemo(() => {
    return Array.from(new Set(allRows.map(r => r.Year))).sort((a, b) => b - a)
  }, [allRows])

  const fetchFromFirebase = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching all destination data from Firebase...')
      const data = await getAllAllDestinationData()

      if (data.length === 0) {
        setError('No all destination data found in Firebase. Please upload data first.')
        setLoading(false)
        return
      }

      setAllRows(data)
      setLoading(false)
      console.log('Successfully loaded data from Firebase')
    } catch (err) {
      console.error('Error fetching all destination data from Firebase:', err)
      setError('Failed to load all destination data from Firebase')
      setLoading(false)
    }
  }

  return {
    mapData,
    years,
    loading,
    error
  }
}
