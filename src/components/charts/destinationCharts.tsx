import {
  LineChart,
  Line,
  // BarChart,
  // Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useParseMajorDestinationData } from '../../hooks/useParseMajorDestinationData'


// const allDestinationDataCSV = '/data/Emigrant-1981-2020-AllCountries.csv'
const majorDestinationDataCSV = '/data/Emigrant-1981-2020-MajorCountry.csv'

const DestinationCharts = () => {
  const { chartData, countries, loading } = useParseMajorDestinationData(majorDestinationDataCSV)

  // Show loading message
  if (loading) return <div>Loading...</div>

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F',
    '#FFBB28', '#FF8042', '#A4DE6C', '#D0ED57', '#FFC0CB', '#B22222',
    '#DDA0DD'
  ]

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Line Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Emigration Trends By Destination Country (1981 - 2020)</h2>
        
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
    </div>
  )
}

export default DestinationCharts