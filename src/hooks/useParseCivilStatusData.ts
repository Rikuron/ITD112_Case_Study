import { useState, useEffect } from 'react'
import Papa from 'papaparse'

interface TransformedCivilStatusData {
  YEAR: number
  Single: number
  Married: number
  Widowed: number
  Separated: number
  Divorced: number
  'Not Reported': number
}

interface GroupedCivilStatusData {
  Period: string
  Single: number
  Married: number
  Widowed: number
  Separated: number
  Divorced: number
  'Not Reported': number
}

interface UseParseCivilStatusDataReturn {
  chartData: TransformedCivilStatusData[]
  groupedChartData: GroupedCivilStatusData[]
  civilStatusCategories: string[]
  loading: boolean
}

export const useParseCivilStatusData = (csvPath: string): UseParseCivilStatusDataReturn => {
  const [chartData, setChartData] = useState<TransformedCivilStatusData[]>([])
  const [groupedChartData, setGroupedChartData] = useState<GroupedCivilStatusData[]>([])
  const [civilStatusCategories, setCivilStatusCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Hook to Parse Civil Status Data
  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[]

        // If data is empty, return
        if (rawData.length === 0) return

        // Extract Civil Status Categories (exclude YEAR)
        const allCategories = Object.keys(rawData[0]).filter(key => key !== 'YEAR')
        setCivilStatusCategories(allCategories)

        // Transform data into structured format
        const transformed = rawData.map((row) => {
          const yearData: TransformedCivilStatusData = { 
            YEAR: parseInt(row.YEAR, 10), 
            Single: parseInt(row.Single, 10) || 0,
            Married: parseInt(row.Married, 10) || 0,
            Widowed: parseInt(row.Widowed, 10) || 0,
            Separated: parseInt(row.Separated, 10) || 0,
            Divorced: parseInt(row.Divorced, 10) || 0,
            'Not Reported': parseInt(row['Not Reported'], 10) || 0
          }

          return yearData
        })

        // Group data into 3-year periods for Stacked Bar Chart
        const groupedData: GroupedCivilStatusData[] = []
        const startYear = 1988
        const endYear = 2020

        for (let year = startYear; year <= endYear; year += 3) {
          const periodEnd = Math.min(year + 2, endYear)
          const periodLabel = `${year} - ${periodEnd}`
          const periodData: GroupedCivilStatusData = { 
            Period: periodLabel,
            Single: 0,
            Married: 0,
            Widowed: 0,
            Separated: 0,
            Divorced: 0,
            'Not Reported': 0
          }

          // Sum up values for each civil status category in this period
          allCategories.forEach(category => {
            let sum = 0

            for (let y = year; y <= periodEnd; y++) {
              const yearData = transformed.find(c => c.YEAR === y)

              if (yearData && yearData[category as keyof TransformedCivilStatusData]) {
                sum += yearData[category as keyof TransformedCivilStatusData] as number
              }
            }

            (periodData as any)[category] = sum
          })

          groupedData.push(periodData)
        }

        setChartData(transformed)
        setGroupedChartData(groupedData)
        setLoading(false)
      }
    })
  }, [csvPath])

  return {
    chartData,
    groupedChartData,
    civilStatusCategories,
    loading
  }
}