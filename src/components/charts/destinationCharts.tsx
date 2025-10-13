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
import { useParseMajorDestinationData } from '../../hooks/useParseMajorDestinationData'
import ChoroplethMap from './choroplethMap'
import { useIsMobile } from '../../hooks/useIsMobile'
import { COLUMN_ORDERS } from '../../utils/columnOrders'
import { CustomTooltip } from '../customTooltip'

const DestinationCharts = () => {
  const { chartData, barChartData, countries, loading, error } = useParseMajorDestinationData()
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('All Years')
  const isMobile = useIsMobile()

  useEffect(() => {
    if (countries.length > 0) setSelectedCountries(countries)
  }, [countries])

  const years = useMemo(() => ['All Years', ...chartData.map(d => d.YEAR)], [chartData])

  const singleYearData = useMemo(() => {
    if (selectedYear === 'All Years') return []

    const yearData = chartData.find(d => String(d.YEAR) === String(selectedYear))
    if (!yearData) return []

    return COLUMN_ORDERS.majorDestination.map(country => ({
      country,
      total: yearData[country] || 0
    }))
  }, [selectedYear, chartData, countries])

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
      <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">
          {selectedYear === 'All Years'
            ? 'Emigrants by MAJOR Destination Country (1981 - 2020)'
            : `Emigrant Population by MAJOR Destination Country in ${selectedYear}`}
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

        <div className={isMobile ? "overflow-x-auto" : ""}>
          <div style={{ minWidth: isMobile ? '900px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={550}>
              {selectedYear === 'All Years' ? (
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
                  <Tooltip content={<CustomTooltip 
                    data={singleYearData} 
                    colors={colors} 
                    categoryKey="country" 
                  />} wrapperStyle={{ zIndex: 10 }} />
                  <Bar dataKey="total" name="Total Emigrants">
                    {barChartData.map((_entry, index) => (
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
                    domain={[0, 50000]}
                    tickCount={11}
                    className={isMobile ? 'text-xs' : 'text-sm'} 
                  />
                  <YAxis 
                    type="category" 
                    dataKey="country" 
                    width={110}
                  />
                  <Tooltip 
                    content={<CustomTooltip 
                      data={singleYearData} 
                      colors={colors} 
                      categoryKey="country" 
                    />} 
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
    </div>
  )
}

export default DestinationCharts