import { useState, useEffect } from 'react'
import Papa from 'papaparse'

interface TransformedAgeData {
  Year: number
  [ageGroup: string]: number
}

interface GroupedAgeData {
  Period: string
  [ageGroup: string]: number | string
}

interface UseParseAgeDataReturn {
  chartData: TransformedAgeData[]
  groupedChartData: GroupedAgeData[]
  ageGroups: string[]
  loading: boolean
}

export const useParseAgeData = (csvPath: string): UseParseAgeDataReturn => {
  const [chartData, setChartData] = useState<TransformedAgeData[]>([])
  const [groupedChartData, setGroupedChartData] = useState<GroupedAgeData[]>([])
  const [ageGroups, setAgeGroups] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Hook to Parse Age Data
  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[]
        
        // If data is empty, return
        if (rawData.length === 0) return

        // Extract Age Groups from first column
        const allAgeGroups = rawData.map((row) => row['AGE_GROUP']).filter(Boolean)
        setAgeGroups(allAgeGroups)

        // Get all year columns
        const yearColumns = Object.keys(rawData[0]).filter(key => key !== 'AGE_GROUP')

        // Transform data into structured format
        const transformed = yearColumns.map((year) => {
          const yearData: TransformedAgeData = { Year: parseInt(year, 10) }
          
          rawData.forEach(row => {
            const ageGroup = row.AGE_GROUP
            const value = parseInt(row[year], 10)
            if (ageGroup) yearData[ageGroup] = isNaN(value) ? 0 : value
          })

          return yearData
        })


        // Group data into 5-year periods for Stacked Bar Chart
        const groupedData: GroupedAgeData[] = []
        const startYear = 1981
        const endYear = 2020

        for (let year = startYear; year <= endYear; year += 5) {
          const periodEnd = Math.min(year + 4, endYear)
          const periodLabel = `${year} - ${periodEnd}`
          const periodData: GroupedAgeData = { Period: periodLabel }

          // Sum up values for each age group in this period
          allAgeGroups.forEach(ageGroup => {
            let sum = 0

            for (let y = year; y <= periodEnd; y++) {
              const yearData = transformed.find(t => t.Year === y)
              if (yearData && yearData[ageGroup]) {
                sum += yearData[ageGroup] as number
              }
            }

            periodData[ageGroup] = sum
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
    ageGroups,
    loading
  }
}