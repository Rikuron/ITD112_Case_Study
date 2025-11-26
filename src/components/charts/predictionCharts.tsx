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
import { COLUMN_ORDERS } from '../../utils/columnOrders'

interface PredictionChartsProps {
  category: string
  categoryLabel: string
  historicalData: Array<{ Year: number; [key: string]: number }>
  predictions: PredictionResult[]
}

// Map category keys to COLUMN_ORDERS keys
const CATEGORY_TO_ORDER_KEY: Record<string, keyof typeof COLUMN_ORDERS> = {
  age: 'age',
  civil_status: 'civilStatus',
  destination: 'majorDestination',
  education: 'education',
  occupation: 'occupation',
  sex: 'sex',
  origin: 'region'
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

const PredictionCharts = ({ category, categoryLabel, historicalData, predictions }: PredictionChartsProps) => {
  const isMobile = useIsMobile()

  // Get the column order for this category
  const columnOrder = useMemo(() => {
    const orderKey = CATEGORY_TO_ORDER_KEY[category]
    return orderKey ? COLUMN_ORDERS[orderKey] : []
  }, [category])

  // Get feature names from historical data
  const features = useMemo(() => {
    if (historicalData.length === 0) return []
    const allFeatures = Object.keys(historicalData[0]).filter(key => key !== 'Year')

    // Sort features by column order
    if (columnOrder.length > 0) {
      return allFeatures.sort((a, b) => {
        const indexA = columnOrder.indexOf(a)
        const indexB = columnOrder.indexOf(b)

        // If not found in order, put at the end
        const orderA = indexA === -1 ? 999 : indexA
        const orderB = indexB === -1 ? 999 : indexB
        return orderA - orderB
      })
    }
    return allFeatures
  }, [historicalData, columnOrder])

  // Get the last historical year for the reference line
  const lastHistoricalYear = useMemo(() => {
    if (historicalData.length === 0) return null
    return Math.max(...historicalData.map(d => d.Year))
  }, [historicalData])

  // Create unified chart data with separate keys for historical and predicted
  const chartData = useMemo(() => {
    // Historical data - use feature names directly
    const historical = historicalData.map(item => {
      const dataPoint: Record<string, any> = { Year: item.Year, type: 'historical' }
      features.forEach(feature => {
        dataPoint[feature] = item[feature]
        dataPoint[`${feature}_pred`] = null // null for predicted in historical range
      })
      return dataPoint
    })

    // Bridge point - last historical year with both values for smooth connection
    const bridgePoint = historical.length > 0 ? (() => {
      const lastHistorical = historical[historical.length - 1]
      const bridge: Record<string, any> = { Year: lastHistorical.Year, type: 'bridge' }
      features.forEach(feature => {
        bridge[feature] = lastHistorical[feature]
        bridge[`${feature}_pred`] = lastHistorical[feature] // Same value for connection
      })
      return bridge
    })() : null

    // Predicted data - use _pred suffix
    const predicted = predictions.map(pred => {
      const dataPoint: Record<string, any> = { Year: pred.year, type: 'predicted' }
      features.forEach(feature => {
        dataPoint[feature] = null // null for historical in predicted range
        dataPoint[`${feature}_pred`] = pred.predictions[feature] ?? null
      })
      return dataPoint
    })

    // Remove the duplicate bridge year from historical if it exists
    const historicalWithoutLast = historical.slice(0, -1)
    
    return bridgePoint 
      ? [...historicalWithoutLast, bridgePoint, ...predicted]
      : [...historical, ...predicted]
  }, [historicalData, predictions, features])

  // Year range for title
  const yearRange = useMemo(() => {
    if (chartData.length === 0) return { min: 0, max: 0 }
    return {
      min: Math.min(...chartData.map(d => d.Year)),
      max: Math.max(...chartData.map(d => d.Year))
    }
  }, [chartData])

  if (features.length === 0 || chartData.length === 0) {
    return (
      <div className="bg-secondary rounded-lg shadow-md p-6 border-2 border-highlights text-center">
        <p className="text-gray-400 font-inter">No data available for {categoryLabel}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Main Combined Chart */}
      <div className="bg-secondary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-2">
          {categoryLabel} - Historical & Predicted Trends
        </h2>
        <p className="text-center text-gray-400 text-sm mb-4 font-inter">
          {yearRange.min} - {yearRange.max} • <span className="text-highlights">Dashed lines</span> = Predictions after {lastHistoricalYear}
        </p>

        <div className={isMobile ? "overflow-x-auto" : ""}>
          <div style={{ minWidth: isMobile ? '900px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis 
                  dataKey="Year" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => value.toString()}
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
                    const dataPoint = chartData.find(d => d.Year === label)
                    const suffix = dataPoint?.type === 'predicted' ? ' (Predicted)' : ''
                    return `Year: ${label}${suffix}`
                  }}
                  formatter={(value: any, name: string) => {
                    if (value === null) return [null, null]
                    const cleanName = name.replace('_pred', '')
                    const isPredicted = name.includes('_pred')
                    return [
                      value?.toLocaleString() ?? '-',
                      isPredicted ? `${cleanName} (Pred)` : cleanName
                    ]
                  }}
                  itemSorter={(item) => -(item.value || 0)}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => {
                    // Only show base feature names, hide _pred versions
                    if (value.includes('_pred')) return null
                    return value
                  }}
                />
                
                {/* Reference line at prediction start */}
                {lastHistoricalYear && (
                  <ReferenceLine 
                    x={lastHistoricalYear} 
                    stroke="#3661E2" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ 
                      value: '← Historical | Predicted →', 
                      position: 'top',
                      fill: '#3661E2',
                      fontSize: 11,
                      fontWeight: 'bold'
                    }}
                  />
                )}

                {/* Historical lines (solid) */}
                {features.map((feature, index) => (
                  <Line
                    key={`historical-${feature}`}
                    type="monotone"
                    dataKey={feature}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2.5}
                    dot={false}
                    name={feature}
                    connectNulls={false}
                  />
                ))}

                {/* Predicted lines (dashed) */}
                {features.map((feature, index) => (
                  <Line
                    key={`predicted-${feature}`}
                    type="monotone"
                    dataKey={`${feature}_pred`}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2.5}
                    strokeDasharray="8 4"
                    dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }}
                    name={`${feature}_pred`}
                    connectNulls={false}
                    legendType="none"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend explanation */}
        <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-violet-500"></div>
            <span>Historical Data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-violet-500 border-dashed" style={{ borderTop: '2px dashed #8B5CF6' }}></div>
            <span>Predicted Data</span>
          </div>
        </div>
      </div>

      {/* Predictions Summary Table */}
      <div className="bg-secondary rounded-lg shadow-md p-6 border-2 border-highlights">
      <h3 className="text-lg font-inter text-white mb-2 text-stroke">
          Predicted Values Summary
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {features.length} categories • Scroll horizontally to see all →
        </p>
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm text-left border-collapse min-w-max">
            <thead className="text-gray-400 border-b border-highlights/30 sticky top-0 bg-secondary z-10">
              <tr>
                <th className="px-3 py-3 font-inter font-semibold text-highlights sticky left-0 bg-secondary z-20 min-w-[70px]">
                  Year
                </th>
                {features.map((feature, idx) => (
                  <th 
                    key={feature} 
                    className="px-3 py-3 font-inter font-medium whitespace-nowrap"
                    title={feature}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span>{feature}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {predictions.map((pred, idx) => (
                <tr 
                  key={pred.year} 
                  className={`${idx % 2 === 0 ? 'bg-primary/30' : ''} hover:bg-highlights/10 transition-colors`}
                >
                  <td className="px-3 py-3 font-bold text-highlights sticky left-0 bg-secondary z-10">
                    {pred.year}
                  </td>
                  {features.map(feature => (
                    <td key={feature} className="px-3 py-3 whitespace-nowrap">
                      {pred.predictions[feature]?.toLocaleString() ?? '-'}
                    </td>
                  ))}
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