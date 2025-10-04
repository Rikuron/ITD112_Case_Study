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

// const allDestinationDataCSV = '/data/Emigrant-1981-2020-AllCountries.csv'
const majorDestinationDataCSV = '/data/Emigrant-1981-2020-MajorCountry.csv'

const DestinationCharts = () => {
  const { chartData, barChartData, countries, loading } = useParseMajorDestinationData(majorDestinationDataCSV)

  // Show loading message
  if (loading) return <div>Loading...</div>

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
              <Line key={country} type="monotone" dataKey={country} stroke={colors[i % colors.length]} name={country} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Total Emigrants by MAJOR Destination Country (1981 - 2020)</h2>
        <ResponsiveContainer width="100%" height={550}>
          <BarChart 
            data={barChartData} 
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
            <XAxis 
              type="number" 
              tickFormatter={(value) => value.toLocaleString()}
              domain={[0, 2000000]}
              tickCount={11}
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
  )
}

export default DestinationCharts