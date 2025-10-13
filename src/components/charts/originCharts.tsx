import { useState, useEffect, useMemo } from 'react'
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
import OriginChoropleth from './originChoropleth'
import { useParseOriginData } from '../../hooks/useParseOriginData'
import { useIsMobile } from '../../hooks/useIsMobile'
import { COLUMN_ORDERS } from '../../utils/columnOrders'

const OriginCharts = () => {
  const { chartData, barChartData, regions, loading, error } = useParseOriginData()
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('All Years')
  const isMobile = useIsMobile()

  useEffect(() => {
    if (regions.length > 0) setSelectedRegions(regions)
  }, [regions])

  const years = useMemo(() => ['All Years', ...chartData.map(d => d.YEAR)], [chartData])

  // Function to extract region shorthand
  const getRegionShorthand = (fullRegion: string): string => {
    // Handle regions with acronyms in parentheses
    const acronymMatch = fullRegion.match(/\(([A-Z]+)\)/)
    if (acronymMatch) {
      return acronymMatch[1]
    }
    
    // Handle "Region X - Description" format
    const regionMatch = fullRegion.match(/^Region\s+(I+|[IVX]+|[A-Z]+)\s*(-|–)/)
    if (regionMatch) {
      return `Region ${regionMatch[1]}`
    }

    // Handle special cases for Region IV A and IV B
    if (fullRegion.includes('Region IV A')) {
      return 'Region IV-A'
    }
    if (fullRegion.includes('Region IV B')) {
      return 'Region IV-B'
    }    
    
    // Return as is if no pattern matches
    return fullRegion
  }

  const singleYearData = useMemo(() => {
    if (selectedYear === 'All Years') return []

    const yearData = chartData.find(d => String(d.YEAR) === String(selectedYear))
    if (!yearData) return []

    return COLUMN_ORDERS.region.map(region => ({
      region,
      shorthand: getRegionShorthand(region),
      total: yearData[region] || 0
    }))
  }, [selectedYear, chartData, regions])

  // Region Checkbox handler
  const handleRegionChange = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    )
  }

  // Show loading message
  if (loading) return (
    <div className="text-white text-center p-8">
      <div className="animate-pulse">Loading Age data from Firebase...</div>
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
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F',
    '#FFBB28', '#FF8042', '#A4DE6C', '#D0ED57', '#FFC0CB', '#B22222',
    '#4682B4', '#DDA0DD', '#20b2aa', '#ff4500', '#32cd32'
  ]

  // Transform barChartData to include shorthand
  const barChartDataWithShorthand = barChartData.map(item => ({
    ...item,
    shorthand: getRegionShorthand(item.region)
  }))

  // Custom Tooltip for Bar Charts
  const CustomBarTooltip = (props: any, colorArray: string[]) => {
    const { active, payload } = props

    if (active && payload && payload.length) {
      const data = payload[0]
      const index = barChartData.findIndex(item => item.region === data.payload.region)
      const color = colorArray[index % colorArray.length]
      
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
            {data.payload.region}
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
      {/* Line Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">
          Emigration Trends By Region of Origin (1988 - 2020)
        </h2>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-white">
          {COLUMN_ORDERS.region.map(region => (
            <label key={region} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRegions.includes(region)}
                onChange={() => handleRegionChange(region)}
                className="form-checkbox h-2.5 w-2.5 md:h-4 md:w-4 text-highlights rounded"
                defaultChecked={selectedRegions.includes(region)}
              />
              <span className="font-inter text-xs md:text-sm">{getRegionShorthand(region)}</span>
            </label>
          ))}
        </div>

        <div className={isMobile ? 'overflow-x-auto' : ''}>
          <div style={{ width: isMobile ? '1400px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
                <XAxis dataKey="YEAR" angle={-45} textAnchor="end" height={70} />
                <YAxis 
                  domain={[0, 30000]}
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
                <Legend 
                  wrapperStyle={{ zIndex: 1 }} 
                  iconType="line"
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                  formatter={(region) => getRegionShorthand(region)}
                />

                {regions.map((region, i) => (
                  selectedRegions.includes(region) && (
                    <Line 
                      key={region} 
                      type="monotone" 
                      dataKey={region} 
                      stroke={colors[i % colors.length]} 
                      name={(region)}
                    />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart - All Regions */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">
          {selectedYear === 'All Years'
            ? 'Total Emigrants by Region (1988 - 2020)'
            : `Total Emigrants by Region in ${selectedYear}`}
        </h2>

        <div className="mb-4 text-center">
          <label htmlFor="year-filter" className="text-white mr-2 font-inter">Filter by Year:</label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="bg-primary border border-highlights text-white rounded p-2 font-inter"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className={isMobile ? 'overflow-x-auto' : ''}>
          <div style={{ width: isMobile ? '1000px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={600}>
              {selectedYear === 'All Years' ? (
                <BarChart 
                  data={barChartDataWithShorthand} 
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
                    domain={[0, 700000]}
                    tickCount={15}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="shorthand" 
                    style={{ fontSize: '14px' }}
                    width={90}
                  />
                  <Tooltip 
                    content={(props) => CustomBarTooltip(props, colors)} 
                    wrapperStyle={{ zIndex: 10 }} 
                  />
                  <Bar dataKey="total" name="Total Emigrants">
                    {barChartDataWithShorthand.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart 
                  data={singleYearData}
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
                    domain={[0, 30000]}
                    tickCount={15}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="shorthand" 
                    style={{ fontSize: '14px' }}
                    width={90}
                  />
                  <Tooltip 
                    content={(props) => CustomBarTooltip(props, colors)} 
                    wrapperStyle={{ zIndex: 10 }} 
                  />
                  <Bar dataKey="total" name="Total Emigrants">
                    {singleYearData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Choropleth Map */}
      <OriginChoropleth />
    </div>
  )
}

export default OriginCharts
