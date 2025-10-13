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
import LoadingScreen from '../loadingScreen'
import { useParseEducationData } from '../../hooks/useParseEducationData'
import { useIsMobile } from '../../hooks/useIsMobile'
import { COLUMN_ORDERS } from '../../utils/columnOrders'
import { CustomTooltip } from '../customTooltip'

const EducationCharts = () => {
  const { chartData, groupedChartData, educationLevels, loading, error } = useParseEducationData()
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('All Years')
  const isMobile = useIsMobile()

  useEffect(() => {
    if (educationLevels.length > 0) setSelectedEducationLevels(educationLevels)
  }, [educationLevels])

  const years = useMemo(() => ['All Years', ...chartData.map(d => d.Year)], [chartData])

  const singleYearData = useMemo(() => {
    if (selectedYear === 'All Years') return []

    const yearData = chartData.find(d => String(d.Year) === String(selectedYear))
    if (!yearData) return []

    return COLUMN_ORDERS.education.map(educationLevel => ({
      educationLevel,
      population: yearData[educationLevel] || 0
    }))
  }, [selectedYear, chartData, educationLevels])

  // Education Level Checkbox handler
  const handleEducationLevelChange = (educationLevel: string) => {
    setSelectedEducationLevels(prev =>
      prev.includes(educationLevel) ? prev.filter(el => el !== educationLevel) : [...prev, educationLevel]
    )
  }

  // Show loading message
  if (loading) return ( <LoadingScreen /> )

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-4 m-8">
        <p className="font-bold">⚠️ Error Loading Data</p>
        <p>{error}</p>
      </div>
    )
  }

  // Error message
  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-4 m-8">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    )
  }

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F',
    '#FFBB28', '#DDA0DD'
  ]

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Line Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Emigration Trends By Education Level (1988 - 2020)</h2>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-white">
          {COLUMN_ORDERS.education.map(educationLevel => (
            <label key={educationLevel} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedEducationLevels.includes(educationLevel)}
                onChange={() => handleEducationLevelChange(educationLevel)}
                className="form-checkbox h-2.5 w-2.5 md:h-4 md:w-4 text-highlights rounded"
                defaultChecked={selectedEducationLevels.includes(educationLevel)}
              />
              <span className="font-inter text-xs md:text-sm">{educationLevel}</span>
            </label>
          ))}
        </div>

        <div className={isMobile ? 'overflow-x-auto' : ''}>
          <div style={{ width: isMobile ? '600px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={525}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
                <XAxis dataKey="Year" angle={-45} textAnchor="end" height={70} />
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

                {educationLevels.map((educationLevel, i) => (
                  selectedEducationLevels.includes(educationLevel) && (
                    <Line key={educationLevel} type="monotone" dataKey={educationLevel} stroke={colors[i % colors.length]} name={educationLevel} />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">
          {selectedYear === 'All Years'
            ? 'Emigrants by Education Level (1988 - 2020)'
            : `Emigrant Population by Education Level in ${selectedYear}`}
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
          <div style={{ width: isMobile ? '600px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={500}>
              {selectedYear === 'All Years' ? (
                <BarChart data={groupedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke='#4a5568'  />
                  <XAxis
                    dataKey="Period"
                    className={isMobile ? 'text-xs' : 'text-sm'}
                    tickFormatter={(period) => {
                      if (!isMobile) return period;
                      const years = period.split(' - ');
                      return years.map((year: string) => `'${year.slice(-2)}`).join(' - ');
                    }}
                  />
                  <YAxis
                    domain={[0, 300000]}
                    tickCount={11}
                  />
                  <Legend  />
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
                  {educationLevels.map((educationLevel, i) => (
                    <Bar key={educationLevel} dataKey={educationLevel} stackId="a" fill={colors[i % colors.length]} name={educationLevel} />
                  ))}
                </BarChart>
              ) : (
                <BarChart data={singleYearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
                  <XAxis dataKey="educationLevel" angle={-45} textAnchor="end" height={70} interval={0} className="md:text-sm text-xs" />
                  <YAxis />
                  <Tooltip 
                    content={<CustomTooltip 
                      data={singleYearData} 
                      colors={colors} 
                      categoryKey="educationLevel" 
                    />} 
                    wrapperStyle={{ zIndex: 10 }} 
                  />
                  <Bar dataKey="population" name="Population">
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

export default EducationCharts