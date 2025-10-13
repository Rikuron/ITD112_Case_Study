import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useParseOccupationData } from '../../hooks/useParseOccupationData'
import { useIsMobile } from '../../hooks/useIsMobile'
import TreemapNivo from './treemapNivo'
import { COLUMN_ORDERS } from '../../utils/columnOrders'
import { OCCUPATION_LABELS, formatOccupationTooltip } from '../../utils/occupationLabels'

const OccupationCharts = () => {
  const { chartData, occupations, loading, error } = useParseOccupationData()
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')
  const { treemapData, years } = useParseOccupationData(selectedYear)
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([])
  const isMobile = useIsMobile()

  useEffect(() => {
    if (occupations.length > 0) setSelectedOccupations(occupations)
  }, [occupations])

  // Occupation Checkbox handler for Line Chart
  const handleOccupationChange = (occupation: string) => {
    setSelectedOccupations(prev =>
      prev.includes(occupation) ? prev.filter(o => o !== occupation) : [...prev, occupation]
    )
  }

  // Year Change handler for Treemap
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = event.target.value
    setSelectedYear(year === 'all' ? 'all' : parseInt(year))
  }

  // Show loading message
  if (loading) return (
    <div className="text-white text-center p-8">
      <div className="animate-pulse">Loading Occupation data from Firebase...</div>
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
    '#1e90ff', '#32cd32', '#ff8c00', '#8a2be2', '#ff1493', 
    '#228b22', '#ffd700', '#dc143c', '#20b2aa', '#ff4500', 
    '#4169e1', '#9932cc', '#696969', '#a9a9a9'
  ]

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Line Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Emigration Trends By Occupation (1981 - 2020)</h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-white">
          {COLUMN_ORDERS.occupation.map(occupation => (
            <label key={occupation} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOccupations.includes(occupation)}
                onChange={() => handleOccupationChange(occupation)}
                className="form-checkbox h-2.5 w-2.5 md:h-4 md:w-4 text-highlights rounded"
                defaultChecked={selectedOccupations.includes(occupation)}
              />
              <span className="font-inter text-xs md:text-sm">{occupation}</span>
            </label>
          ))}
        </div>

        <div className={isMobile ? 'overflow-x-auto' : ''}>
          <div style={{ width: isMobile ? '600px' : 'auto' }}>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
                <XAxis dataKey="Year" angle={-45} textAnchor="end" height={70} />
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
                  formatter={formatOccupationTooltip}
                />
                <Legend wrapperStyle={{ zIndex: 1 }} />

                {occupations.map((occupation, i) => (
                  selectedOccupations.includes(occupation) && (
                    <Line key={occupation} type="monotone" dataKey={occupation} stroke={colors[i % colors.length]} name={occupation} />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>


      {/* Treemap Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">
          {selectedYear === 'all'
            ? 'Total Emigration Composition By Occupation Category (1981 - 2020)'
            : `Total Emigration Composition By Occupation Category in ${selectedYear}`}
        </h2>
        
        {/* Year Filter Dropdown */}
        <div className="mb-4 text-center">
          <label htmlFor="year-filter" className="text-white mr-2 font-inter">Filter by Year:</label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={handleYearChange}
            className="bg-primary border border-highlights text-white rounded p-2 font-inter"
          >
            <option value="all">All Years (1981-2020)</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className={isMobile ? 'overflow-x-auto' : ''}>
          <div style={{ width: isMobile ? '600px' : 'auto' }}>
            <TreemapNivo 
              key={`treemap-${treemapData.length}-${selectedYear}`}
              data={treemapData} 
              occupationLabelMap={OCCUPATION_LABELS} 
            />
          </div>
        </div>
      </div>


    </div>
  )
}

export default OccupationCharts