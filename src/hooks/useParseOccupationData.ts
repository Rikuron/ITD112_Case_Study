import { useState, useEffect } from 'react'
import Papa from 'papaparse'

interface TransformedOccupationData {
  Year: number
  [occupation: string]: number
}

interface TreemapData {
  name: string
  value: number
}

interface UseParseOccupationDataReturn {
  chartData: TransformedOccupationData[]
  occupations: string[]
  treemapData: TreemapData[]
  loading: boolean
}

export const useParseOccupationData = (csvPath: string): UseParseOccupationDataReturn => {
  const [chartData, setChartData] = useState<TransformedOccupationData[]>([])
  const [occupations, setOccupations] = useState<string[]>([])
  const [treemapData, setTreemapData] = useState<TreemapData[]>([])
  const [loading, setLoading] = useState(true)

  // Hook to Parse Occupation Data
  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[]

        // If data is empty, return
        if (rawData.length === 0) return

        // Extract Occupations from first column
        const allOccupations = rawData.map((row) => row['Occupation']).filter(Boolean)
        setOccupations(allOccupations)

        // Get all year columns
        // Get all cells from first row except first cell
        const yearColumns = Object.keys(rawData[0]).filter(key => key !== 'Occupation')

        // Transform data into structured format
        const transformed = yearColumns.map((year) => {
          const yearData: TransformedOccupationData = { Year: parseInt(year, 10) }

          rawData.forEach(row => {
            const occupation = row.Occupation
            const value = parseInt(row[year], 10)
            if (occupation) yearData[occupation] = isNaN(value) ? 0 : value
          })

          return yearData
        })

        setChartData(transformed)

        // Calculate totals for treemap
        const totals: { [key: string]: number } = {}
        allOccupations.forEach(occupation => {
          totals[occupation] = 0
        })

        transformed.forEach(yearData => {
          allOccupations.forEach(occupation => {
            totals[occupation] += yearData[occupation]
          })
        })

        const treemap = allOccupations.map(occupation => ({
          name: occupation,
          value: totals[occupation]
        }))

        setTreemapData(treemap)
        setLoading(false)
      }
    })
  }, [csvPath])

  return {
    chartData,
    occupations,
    treemapData,
    loading
  }
}
