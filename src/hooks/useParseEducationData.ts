import { useState, useEffect } from 'react'
import Papa from 'papaparse'

interface TransformedEducationData {
  Year: number
  [educationLevel: string]: number 
}

interface GroupedEducationData {
  Period: string
  [educationLevel: string]: number | string
}

interface UseParseEducationDataReturn {
  chartData: TransformedEducationData[]
  groupedChartData: GroupedEducationData[]
  educationLevels: string[]
  loading: boolean
}

// Mappings for combining education levels
const educationLevelMappings: Record<string, string[]> = {
  "Non-Formal Education": ["No Formal Education", "Non-Formal Education "],
  "Elementary": ["Elementary Level", "Elementary Graduate"],
  "High School": ["High School Level", "High School Graduate"],
  "Vocational": ["Vocational Level", "Vocational Graduate"],
  "College": ["College Level", "College Graduate"],
  "Post Graduate": ["Post Graduate Level", "Post Graduate"]
}

// Education Levels not merged
const unmappedLevels = [
  "Not of Schooling Age",
  "Not Reported / No Response"
]

export const useParseEducationData = (csvPath: string): UseParseEducationDataReturn => {
  const [chartData, setChartData] = useState<TransformedEducationData[]>([])
  const [groupedChartData, setGroupedChartData] = useState<GroupedEducationData[]>([])
  const [educationLevels, setEducationLevels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Hook to Parse Education Data
  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[]

        // If data is empty, return
        if (rawData.length === 0) return

        // Extract Education Levels from first column
        const allEducationLevels = rawData.map((row) => row['EDUCATIONAL ATTAINMENT']).filter(Boolean)
        setEducationLevels(allEducationLevels)

        // Get all year columns
        // Get all cells from first row except first
        const yearColumns = Object.keys(rawData[0]).filter(key => key !== 'EDUCATIONAL ATTAINMENT')
      
        // Transform data into structured format
        const transformed = yearColumns.map((year) => {
          const yearData: TransformedEducationData = { Year: parseInt(year, 10) }

          rawData.forEach(row => {
            const educationLevel = row['EDUCATIONAL ATTAINMENT']
            const value = parseInt(row[year], 10)
            if (educationLevel) yearData[educationLevel] = isNaN(value) ? 0 : value
          })

          return yearData
        })

        // Create new aggregated Education Levels
        const aggregatedEducationLevels = [...Object.keys(educationLevelMappings), ...unmappedLevels]
        setEducationLevels(aggregatedEducationLevels)

        // Aggregate data based on new Education Levels
        const aggregatedData = transformed.map(yearData => {
          const newYearData: TransformedEducationData = { Year: yearData.Year }

          for (const newEducationLevel in educationLevelMappings) {
            const oldEducationLevels = educationLevelMappings[newEducationLevel]

            newYearData[newEducationLevel] = oldEducationLevels.reduce((sum, oldEducationLevel) => {
              return sum + (yearData[oldEducationLevel] || 0)
            }, 0)
          }

          unmappedLevels.forEach(level => {
            newYearData[level] = yearData[level] || 0
          })

          return newYearData
        })

        // Group data into 3-year Periods for Stacked Bar Chart
        const groupedData: GroupedEducationData[] = []
        const startYear = 1988
        const endYear = 2020

        for (let year = startYear; year <= endYear; year += 3) {
          const periodEnd = Math.min(year + 2, endYear)
          const periodLabel = `${year} - ${periodEnd}`
          const periodData: GroupedEducationData = { Period: periodLabel}

          // Sum up all values for each Education Level in this period
          aggregatedEducationLevels.forEach(educationLevel => {
            let sum = 0

            for (let y = year; y <= periodEnd; y++) {
              const yearData = aggregatedData.find(t => t.Year === y)
              if (yearData && yearData[educationLevel]) {
                sum += yearData[educationLevel] as number
              }
            }

            periodData[educationLevel] = sum
          })

          groupedData.push(periodData) 
        }

        setChartData(aggregatedData)
        setGroupedChartData(groupedData)
        setLoading(false)
      }
    })
  }, [csvPath])
  
  return {
    chartData,
    groupedChartData,
    educationLevels,
    loading
  }
}