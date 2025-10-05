import { useState, useEffect } from 'react'
import Papa from 'papaparse'

interface TransformedOriginData {
  YEAR: number
  [region: string]: number
}

interface BarChartData {
  region: string
  total: number
}

interface UseParseOriginDataReturn {
  chartData: TransformedOriginData[]
  barChartData: BarChartData[]
  regions: string[]
  loading: boolean
}

export const useParseOriginData = (csvPath: string): UseParseOriginDataReturn => {
  const [chartData, setChartData] = useState<TransformedOriginData[]>([])
  const [barChartData, setBarChartData] = useState<BarChartData[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Hook to Parse Origin Data
  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[]

        // If data is empty, return
        if (rawData.length === 0) return

        // Extract regions from first column
        const allRegions = rawData.map(row => row.REGION).filter(Boolean)
        setRegions(allRegions)

        // Extract year columns
        const years = Object.keys(rawData[0]).filter(key => key !== 'REGION')

        // Transform data into structured format
        const transformed: TransformedOriginData[] = years.map(year => {
          const yearData: TransformedOriginData = {
            YEAR: parseInt(year, 10)
          }

          rawData.forEach(row => {
            const regionName = row.REGION
            yearData[regionName] = parseInt(row[year], 10) || 0
          })

          return yearData
        })

        // Calculate totals for each region for bar chart
        const totals: { [key: string]: number } = {}
        allRegions.forEach(region => {
          totals[region] = 0
        })

        transformed.forEach(yearData => {
          allRegions.forEach(region => {
            totals[region] += yearData[region] as number
          })
        })

        // Convert totals to bar chart data and sort by total descendingly
        const barChartData = allRegions.map(region => ({
          region,
          total: totals[region]
        })).sort((a, b) => b.total - a.total)

        setChartData(transformed)
        setBarChartData(barChartData)
        setLoading(false)
      }
    })
  }, [csvPath])

  return {
    chartData,
    barChartData,
    regions,
    loading
  }
}