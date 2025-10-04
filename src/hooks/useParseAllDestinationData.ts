import { useState, useEffect } from 'react'
import Papa from 'papaparse'

interface CountryData {
  country: string
  total: number
  category: string
  color: string
}

interface UseParseAllDestinationDataReturn {
  mapData: CountryData[]
  loading: boolean
}

export const useParseAllDestinationData = (csvPath: string): UseParseAllDestinationDataReturn => {
  const [mapData, setMapData] = useState<CountryData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[]

        if (rawData.length === 0) return

        // Get all year columns (exclude COUNTRY column)
        const yearColumns = Object.keys(rawData[0]).filter(key => key !== 'COUNTRY')

        // Calculate totals for each country
        const countryTotals = rawData.map(row => {
          const country = row.COUNTRY
          let total = 0

          yearColumns.forEach(year => {
            total += parseInt(row[year], 10) || 0
          })

          return { country, total }
        })

        // Classify countries into categories
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

          return { country, total, category, color }
        })

        setMapData(categorizedData)
        setLoading(false)
      }
    })
  }, [csvPath])

  return {
    mapData,
    loading
  }
}
