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
import { useParseCivilStatusData } from '../../hooks/useParseCivilStatusData'
import { useIsMobile } from '../../hooks/useIsMobile'
import { COLUMN_ORDERS } from '../../utils/columnOrders'
import { CustomTooltip } from '../customTooltip'

const CivilStatusCharts = () => {
  const { chartData, groupedChartData, civilStatusCategories, loading, error } = useParseCivilStatusData()
  const [selectedCivilStatusCategories, setSelectedCivilStatusCategories] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('All Years')
  const isMobile = useIsMobile()
  
  useEffect(() => {
    if (civilStatusCategories.length > 0) setSelectedCivilStatusCategories(civilStatusCategories)
  }, [civilStatusCategories])

  const years = useMemo(() => ['All Years', ...chartData.map(d => d.YEAR)], [chartData])

  const singleYearData = useMemo(() => {
    if (selectedYear === 'All Years') return []

    const yearData = chartData.find(d => String(d.YEAR) === String(selectedYear))
    if (!yearData) return []

    return COLUMN_ORDERS.civilStatus.map(civilStatusCategory => ({
      civilStatusCategory,
      population: yearData[civilStatusCategory] || 0
    }))
  }, [selectedYear, chartData, civilStatusCategories])

  // Civil Status Category Checkbox handler
  const handleCivilStatusCategoryChange = (civilStatusCategory: string) => {
    setSelectedCivilStatusCategories(prev =>
      prev.includes(civilStatusCategory) ? prev.filter(cs => cs !== civilStatusCategory) : [...prev, civilStatusCategory]
    )
  }

  // Show loading message
  if (loading) return (
    <div className="text-white text-center p-8">
      <div className="animate-pulse">Loading Civil Status data from Firebase...</div>
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
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#DDA0DD'
  ]

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Line Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Emigration Trends By Civil Status (1988 - 2020)</h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-white">
          {COLUMN_ORDERS.civilStatus.map(civilStatusCategory => (
            <label key={civilStatusCategory} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCivilStatusCategories.includes(civilStatusCategory)}
                onChange={() => handleCivilStatusCategoryChange(civilStatusCategory)}
                className="form-checkbox h-2.5 w-2.5 md:h-4 md:w-4 text-highlights rounded"
                defaultChecked={selectedCivilStatusCategories.includes(civilStatusCategory)}
              />
              <span className="font-inter text-xs md:text-sm">{civilStatusCategory}</span>
            </label>
          ))}          
        </div>

        <div className={isMobile ? "overflow-x-auto" : ""}>
          <div style={{ minWidth: isMobile ? '900px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={525}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
                <XAxis dataKey="YEAR" angle={-45} textAnchor="end" height={70} />
                <YAxis 
                  domain={[0, 55000]}
                  tickCount={12}
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

                {civilStatusCategories.map((civilStatusCategory, i) => (
                  selectedCivilStatusCategories.includes(civilStatusCategory) && (
                    <Line key={civilStatusCategory} type="monotone" dataKey={civilStatusCategory} stroke={colors[i % colors.length]} name={civilStatusCategory} />
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
            ? 'Emigrants by Civil Status (1988 - 2020)'
            : `Emigrant Population by Civil Status in ${selectedYear}`}
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
                  {civilStatusCategories.map((civilStatusCategory, i) => (
                    <Bar key={civilStatusCategory} dataKey={civilStatusCategory} stackId="a" fill={colors[i % colors.length]} name={civilStatusCategory} />
                  ))}
                </BarChart>
              ) : (
                <BarChart data={singleYearData}>
                  <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
                  <XAxis dataKey="civilStatusCategory" angle={-45} textAnchor="end" height={70} interval={0} />
                  <YAxis />
                  <Tooltip
                    content={<CustomTooltip 
                      data={singleYearData} 
                      colors={colors} 
                      categoryKey="civilStatusCategory" 
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

export default CivilStatusCharts