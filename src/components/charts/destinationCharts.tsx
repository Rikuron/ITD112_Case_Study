import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useParseMajorDestinationData } from '../../hooks/useParseMajorDestinationData'
import ChoroplethMap from './choroplethMap'
import { useIsMobile } from '../../hooks/useIsMobile'
import { COLUMN_ORDERS } from '../../utils/columnOrders'

const DestinationCharts = () => {
  const { chartData, barChartData, countries, loading, error } = useParseMajorDestinationData()
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const isMobile = useIsMobile()

  useEffect(() => {
    if (countries.length > 0) setSelectedCountries(countries)
  }, [countries])

  // Country Checkbox handler
  const handleCountryChange = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    )
  }
  
  if (loading) return (
    <div className="text-white text-center p-8">
      <div className="animate-pulse">Loading destination data from Firebase...</div>
    </div>
  )

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-4 m-8">
        <p className="font-bold">⚠️ Error Loading Data</p>
        <p>{error}</p>
      </div>
    )
  }

  const colors = [
    '#1e90ff', '#32cd32', '#ff8c00', '#8a2be2', '#a9a9a9',
    '#ff1493', '#228b22', '#ffd700', '#dc143c', '#20b2aa', 
    '#ff4500'
  ]

  // Custom Tooltip with matching color
  const CustomTooltip = (props: any) => {
    const { active, payload } = props

    if (active && payload && payload.length) {
      const data = payload[0]
      const index = barChartData.findIndex(item => item.country === data.payload.country)
      const color = colors[index % colors.length]
      
      return (
        <div style={{
          backgroundColor: '#2A324A',
          border: '1px solid ' + color,
          borderRadius: '8px',
          padding: '10px',
          color: '#ffffff',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <p style={{
            color: color,
            fontWeight: 'bold',
            marginBottom: '8px',
            margin: 0
          }}>
            {data.payload.country}
          </p>
          <p style={{
            color: color,
            fontWeight: 'bold',
            margin: 0
          }}>
            Total Emigrants: {data.value?.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Choropleth Map */}
      <ChoroplethMap />

      {/* Line Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Emigration Trends By MAJOR Destination Country (1981 - 2020)</h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-white">
          {COLUMN_ORDERS.majorDestination.map(country => (
            <label key={country} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() => handleCountryChange(country)}
                className="form-checkbox h-2.5 w-2.5 md:h-4 md:w-4 text-highlights rounded"
                defaultChecked={selectedCountries.includes(country)}
              />
              <span className="font-inter text-xs md:text-sm">{country}</span>
            </label>
          ))}
        </div>

        <div className={isMobile ? "overflow-x-auto" : ""}>
          <div style={{ minWidth: isMobile ? '600px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={525}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
                <XAxis dataKey="YEAR" angle={-45} textAnchor="end" height={70} />
                <YAxis 
                  domain={[0, 50000]}
                  tickCount={11}
                />
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
                />
                <Legend wrapperStyle={{ zIndex: 1 }} />

                {countries.map((country, i) => (
                  selectedCountries.includes(country) && (
                    <Line key={country} type="monotone" dataKey={country} stroke={colors[i % colors.length]} name={country} />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Total Emigrants by MAJOR Destination Country (1981 - 2020)</h2>
        
        <div className={isMobile ? "overflow-x-auto" : ""}>
          <div style={{ minWidth: isMobile ? '650px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={550}>
              <BarChart 
                data={barChartData} 
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => {
                    if (value === 0) return '0'
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}m`
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}k`
                    } 
                    return value.toString()
                  }}
                  domain={[0, 2000000]}
                  tickCount={11}
                  className={isMobile ? 'text-xs' : 'text-sm'}
                />
                <YAxis 
                  type="category" 
                  dataKey="country" 
                  width={110}
                />
                <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 10 }} />
                <Bar dataKey="total" name="Total Emigrants">
                  {barChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationCharts