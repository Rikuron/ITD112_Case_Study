import { useState, useEffect } from 'react'
import { getAllAllDestinationData } from '../api/destinationService'

interface CountryData {
  country: string
  total: number
  category: string
  color: string
}

interface UseParseAllDestinationDataReturn {
  mapData: CountryData[]
  loading: boolean
  error: string | null
}

export const useParseAllDestinationData = (): UseParseAllDestinationDataReturn => {
  const [mapData, setMapData] = useState<CountryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFromFirebase()
  }, [])

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

      // Get all country names
      const allCountries = Object.keys(data[0]).filter(key => key !== 'Year')

      // Calculate totals for each country
      const countryTotals = allCountries.map(country => {
        let total = 0
        data.forEach(row => {
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
      console.log('Successfully loaded data from Firebase')
    } catch (err) {
      console.error('Error fetching all destination data from Firebase:', err)
      setError('Failed to load all destination data from Firebase')
      setLoading(false)
    }
  }

  return {
    mapData,
    loading,
    error
  }
}
