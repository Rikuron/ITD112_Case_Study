import { useState, useEffect } from 'react'
import Papa from 'papaparse'

interface TransformedSexData {
  YEAR: number
  MALE: number
  FEMALE: number
}

interface GroupedSexData {
  Period: string
  MALE: number
  FEMALE: number
}

interface PopulationPyramidData {
  Period: string
  MALE: number
  FEMALE: number
  MaleNegative: number
  [key: string]: string | number
}

interface ScatterPlotData {
  male: { x: number; y: number }[]
  female: { x: number; y: number }[]
}

interface TrendlineData {
  x: number
  y: number
}

interface TrendlineDataSet {
  maleTrend: TrendlineData[]
  femaleTrend: TrendlineData[]
}

interface UseParseSexDataReturn {
  chartData: TransformedSexData[]
  groupedChartData: GroupedSexData[]
  populationPyramidData: PopulationPyramidData[]
  scatterPlotData: ScatterPlotData
  trendlineData: TrendlineDataSet
  sexCategories: string[]
  loading: boolean
}

export const useParseSexData = (csvPath: string): UseParseSexDataReturn => {
  const [chartData, setChartData] = useState<TransformedSexData[]>([])
  const [groupedChartData, setGroupedChartData] = useState<GroupedSexData[]>([])
  const [populationPyramidData, setPopulationPyramidData] = useState<PopulationPyramidData[]>([])
  const [scatterPlotData, setScatterPlotData] = useState<ScatterPlotData>({ male: [], female: [] })
  const [trendlineData, setTrendlineData] = useState<TrendlineDataSet>({ maleTrend: [], femaleTrend: [] })
  const [sexCategories, setSexCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate Linear Regression for Scatter Plot Trendline
  const calculateLinearRegression = (data: { x: number; y: number}[]) => {
    const n = data.length
    const sumX = data.reduce((sum, point) => sum + point.x, 0)
    const sumY = data.reduce((sum, point) => sum + point.y, 0)
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0)
    const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    
    return { slope, intercept }
  }

  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[]

        // If data is empty, return
        if (rawData.length === 0) return 

        // Extract all Sex Categories (excluding YEAR)
        const allCategories = Object.keys(rawData[0]).filter(key => key !== 'YEAR')
        setSexCategories(allCategories)

        // Transform data into structured format
        const transformed = rawData.map((row) => {
          const yearData: TransformedSexData = {
            YEAR: parseInt(row.YEAR, 10),
            MALE: parseInt(row.MALE, 10) || 0,
            FEMALE: parseInt(row.FEMALE, 10) || 0
          }

          return yearData
        })

        // Group data into 5 year periods for Population Pyramid
        const groupedData: GroupedSexData[] = []
        const startYear = 1981
        const endYear = 2020

        for (let year = startYear; year <= endYear; year += 5) {
          const periodEnd = Math.min(year + 4, endYear)
          const periodLabel = `${year} - ${periodEnd}`
          const periodData: GroupedSexData = {
            Period: periodLabel,
            MALE: 0,
            FEMALE: 0
          }

          // Sum up all values for each sex category in the period
          allCategories.forEach(category => {
            let sum = 0

            for (let y = year; y <= periodEnd; y++) {
              const yearData = transformed.find(s => s.YEAR === y)

              if (yearData && yearData[category as keyof TransformedSexData]) {
                sum += yearData[category as keyof TransformedSexData] as number
              }
            }

            (periodData as any)[category] = sum
          })

          groupedData.push(periodData)
        }

        // Create Population Pyramid data with negative male values for display
        const pyramidData: PopulationPyramidData[] = groupedData.map((period) => ({
          Period: period.Period,
          MALE: period.MALE,
          FEMALE: period.FEMALE,
          MaleNegative: -period.MALE
        }))


        // Create scatter plot data
        const maleScatterData = transformed.map(item => ({ x: item.YEAR, y: item.MALE }))
        const femaleScatterData = transformed.map(item => ({ x: item.YEAR, y: item.FEMALE }))

        // Calculate trendlines
        const maleRegression = calculateLinearRegression(maleScatterData)
        const femaleRegression = calculateLinearRegression(femaleScatterData)

        const maleTrendline: TrendlineData[] = [
          { x: startYear, y: maleRegression.slope * startYear + maleRegression.intercept },
          { x: endYear, y: maleRegression.slope * endYear + maleRegression.intercept }
        ]

        const femaleTrendline: TrendlineData[] = [
          { x: startYear, y: femaleRegression.slope * startYear + femaleRegression.intercept },
          { x: endYear, y: femaleRegression.slope * endYear + femaleRegression.intercept }
        ]


        setChartData(transformed)
        setGroupedChartData(groupedData)
        setPopulationPyramidData(pyramidData)
        setScatterPlotData({ male: maleScatterData, female: femaleScatterData })
        setTrendlineData({ maleTrend: maleTrendline, femaleTrend: femaleTrendline })
        setLoading(false)
      }
    })
  }, [csvPath])

  return {
    chartData,
    groupedChartData,
    populationPyramidData,
    scatterPlotData,
    trendlineData,
    sexCategories,
    loading
  }  
}