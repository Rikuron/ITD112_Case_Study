import { useState, useEffect } from 'react'
import Papa from 'papaparse'

interface TransformedMajorDestinationData {
  YEAR: number
  USA: number
  CANADA: number
  JAPAN: number
  AUSTRALIA: number
  ITALY: number
  'NEW ZEALAND': number
  'UNITED KINGDOM': number
  GERMANY: number
  'SOUTH KOREA': number
  SPAIN: number
  OTHERS: number
}

interface UseParseMajorDestinationDataReturn {
  chartData: TransformedMajorDestinationData[]
  countries: string[]
  loading: boolean
}

export const useParseMajorDestinationData = (csvPath: string): UseParseMajorDestinationDataReturn => {
  const [chartData, setChartData] = useState<TransformedMajorDestinationData[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Hook to Parse Major Destination Data
  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[]

        // If data is empty, return
        if (rawData.length === 0) return

        // Extract Country names from first row except first cell
        const allCountries = Object.keys(rawData[0]).filter(key => key !== 'YEAR')
        setCountries(allCountries)

        // Transform data into structured format
        const transformed = rawData.map((row) => {
          const yearData: TransformedMajorDestinationData = { 
            YEAR: parseInt(row.YEAR, 10),
            USA: parseInt(row.USA, 10) || 0,
            CANADA: parseInt(row.CANADA, 10) || 0,
            JAPAN: parseInt(row.JAPAN, 10) || 0,
            AUSTRALIA: parseInt(row.AUSTRALIA, 10) || 0,
            ITALY: parseInt(row.ITALY, 10) || 0,
            'NEW ZEALAND': parseInt(row['NEW ZEALAND'], 10) || 0,
            'UNITED KINGDOM': parseInt(row['UNITED KINGDOM'], 10) || 0,
            GERMANY: parseInt(row.GERMANY, 10) || 0,
            'SOUTH KOREA': parseInt(row['SOUTH KOREA'], 10) || 0,
            SPAIN: parseInt(row.SPAIN, 10) || 0,
            OTHERS: parseInt(row.OTHERS, 10) || 0
          }

          return yearData
        })

        setChartData(transformed)
        setLoading(false) 
      }
    })

  }, [csvPath])

  return {
    chartData,
    countries,
    loading
  }
}