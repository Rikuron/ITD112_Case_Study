import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { useIsMobile } from '../../hooks/useIsMobile'
import type { PredictionResult } from '../../api/predictionService'

interface PredictionChartsProps {
  category: string
  categoryLabel: string
  historicalData: Array<{ Year: number; [key: string]: number }>
  predictions: PredictionResult[]
}

// Vibrant color palette
const COLORS = [
  '#8B5CF6', // violet
  '#06B6D4', // cyan  
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#3B82F6', // blue
  '#84CC16', // lime
  '#F97316', // orange
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#A855F7', // purple
  '#22C55E', // green
  '#FBBF24', // yellow
]

const PredictionCharts = ({ categoryLabel, historicalData, predictions }: PredictionChartsProps) => {
  const isMobile = useIsMobile()

  // Get feature names from historical data
  const features = useMemo(() => {
    if (historicalData.length === 0) return []
    return Object.keys(historicalData[0]).filter(key => key !== 'Year')
  }, [historicalData])

  // Combine historical and predicted data
  const combinedData = useMemo(() => {
    const historical = historicalData.map(item => ({
      ...item,
      isPrediction: false
    }))

    const predicted = predictions.map(pred => ({
      Year: pred.year,
      ...pred.predictions,
      isPrediction: true
    }))

    return [...historical, ...predicted]
  }, [historicalData, predictions])

  // Get the last historical year for the reference line
  const lastHistoricalYear = useMemo(() => {
    if (historicalData.length === 0) return null
    return Math.max(...historicalData.map(d => d.Year))
  }, [historicalData])

  // Year range for title
  const yearRange = useMemo(() => {
    if (combinedData.length === 0) return { min: 0, max: 0 }
    return {
      min: Math.min(...combinedData.map(d => d.Year)),
      max: Math.max(...combinedData.map(d => d.Year))
    }
  }, [combinedData])

  if (features.length === 0 || combinedData.length === 0) {
    return (
      <div className="bg-secondary rounded-lg shadow-md p-6 border-2 border-highlights text-center">
        <p className="text-gray-400 font-inter">No data available for {categoryLabel}</p>
      </div>
    )
  }

  // Create separate datasets for historical and predicted
  const historicalChartData = combinedData.filter(d => !d.isPrediction)
  const predictedChartData = combinedData.filter(d => d.isPrediction)

  // For smooth transition, include last historical point in predicted data
  const predictedWithBridge = lastHistoricalYear 
    ? [historicalChartData[historicalChartData.length - 1], ...predictedChartData]
    : predictedChartData

  return (
    <div className="space-y-8">
      {/* Main Combined Chart */}
      <div className="bg-secondary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-2">
          {categoryLabel} - Historical & Predicted Trends
        </h2>
        <p className="text-center text-gray-400 text-sm mb-4 font-inter">
          {yearRange.min} - {yearRange.max} (Predictions shown as dashed lines after {lastHistoricalYear})
        </p>

        <div className={isMobile ? "overflow-x-auto" : ""}>
          <div style={{ minWidth: isMobile ? '900px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis 
                  dataKey="Year" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis tick={{ fill: '#9CA3AF' }} />
                <Tooltip
                  wrapperStyle={{ zIndex: 10 }}
                  contentStyle={{
                    backgroundColor: '#2A324A',
                    border: '1px solid #3661E2',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  labelStyle={{
                    color: '#3661E2',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}
                  labelFormatter={(label) => {
                    const dataPoint = combinedData.find(d => d.Year === label)
                    const suffix = dataPoint?.isPrediction ? ' (Predicted)' : ''
                    return `Year: ${label}${suffix}`
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                
                {/* Reference line at prediction start */}
                {lastHistoricalYear && (
                  <ReferenceLine 
                    x={lastHistoricalYear} 
                    stroke="#3661E2" 
                    strokeDasharray="5 5"
                    label={{ 
                      value: 'Predictions Start', 
                      position: 'top',
                      fill: '#3661E2',
                      fontSize: 12
                    }}
                  />
                )}

                {/* Historical lines (solid) */}
                {features.map((feature, index) => (
                  <Line
                    key={`historical-${feature}`}
                    type="monotone"
                    dataKey={feature}
                    data={historicalChartData}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    name={feature}
                    connectNulls
                  />
                ))}

                {/* Predicted lines (dashed) */}
                {features.map((feature, index) => (
                  <Line
                    key={`predicted-${feature}`}
                    type="monotone"
                    dataKey={feature}
                    data={predictedWithBridge}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 4 }}
                    name={`${feature} (Predicted)`}
                    connectNulls
                    legendType="none"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Predictions Summary Table */}
      <div className="bg-secondary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h3 className="text-lg font-inter text-white mb-4 text-stroke">
          Predicted Values Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-highlights/30">
              <tr>
                <th className="px-4 py-3 font-inter">Year</th>
                {features.slice(0, 6).map(feature => (
                  <th key={feature} className="px-4 py-3 font-inter truncate max-w-[120px]" title={feature}>
                    {feature}
                  </th>
                ))}
                {features.length > 6 && (
                  <th className="px-4 py-3 font-inter text-highlights">+{features.length - 6} more</th>
                )}
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {predictions.map((pred, idx) => (
                <tr key={pred.year} className={idx % 2 === 0 ? 'bg-primary/30' : ''}>
                  <td className="px-4 py-3 font-bold text-highlights">{pred.year}</td>
                  {features.slice(0, 6).map(feature => (
                    <td key={feature} className="px-4 py-3">
                      {pred.predictions[feature]?.toLocaleString() ?? '-'}
                    </td>
                  ))}
                  {features.length > 6 && <td className="px-4 py-3 text-gray-500">...</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PredictionCharts