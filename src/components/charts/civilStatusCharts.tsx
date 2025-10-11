import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from 'recharts'
import { useParseCivilStatusData } from '../../hooks/useParseCivilStatusData'

const CivilStatusCharts = () => {
  const { chartData, groupedChartData, civilStatusCategories, loading, error } = useParseCivilStatusData()

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
              <Line key={civilStatusCategory} type="monotone" dataKey={civilStatusCategory} stroke={colors[i % colors.length]} name={civilStatusCategory} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked Bar Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Emigrants Trends By Civil Status (1988 - 2020)</h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={groupedChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke='#4a5568'  />
            <XAxis dataKey="Period" />
            <YAxis 
              domain={[0, 500000]}
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
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CivilStatusCharts