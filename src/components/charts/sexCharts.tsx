import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useParseSexData } from '../../hooks/useParseSexData'

const sexDataCSV = '/data/Emigrant-1981-2020-Sex.csv'

const SexCharts = () => {
  const { chartData, scatterPlotData, trendlineData, sexCategories, loading } = useParseSexData(sexDataCSV)

  // Show loading message
  if (loading) return <div>Loading...</div>

  const colors = [
    '#8884d8', '#ff8042'
  ]

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Line Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Emigration Trends By Sex (1981 - 2020)</h2>

        <ResponsiveContainer width="100%" height={525}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
            <XAxis dataKey="YEAR" angle={-45} textAnchor="end" height={70} />
            <YAxis 
              domain={[0, 60000]}
              tickCount={13}
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

            {sexCategories.map((sexCategory, i) => (
              <Line 
                key={sexCategory} 
                type="monotone" 
                dataKey={sexCategory} 
                stroke={colors[i % colors.length]} 
                name={sexCategory} 
                strokeWidth={2} 
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Population Pyramid */}
      {/* <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Population Pyramid By Sex (1981 - 2020)</h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart 
            data={populationPyramidData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
            <XAxis 
              type="number" 
              domain={[-250000, 250000]}
              tickCount={11}
              tickFormatter={(value) => Math.abs(value).toLocaleString()}
            />
            <YAxis 
              type="category" 
              dataKey="Period" 
              width={80}
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
              formatter={(value: number, name: string) => [
                Math.abs(value).toLocaleString(),
                name === 'MaleNegative' ? 'MALE' : name
              ]}
            />
            <Legend />
            <Bar dataKey="MaleNegative" fill={colors[0]} name="MALE" />
            <Bar dataKey="FEMALE" fill={colors[1]} name="FEMALE" />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* Scatter Plot */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Male vs Female Emigration Scatter Plot (1981 - 2020)</h2>
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart 
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke='#4a5568' />
            <XAxis 
              type="number" 
              dataKey = "x"
              name="Year"
              domain={[1981, 2020]}
              tickCount={25}
            />
            <YAxis 
              type="number" 
              dataKey="y"
              name="Count"
              domain={[0, 55000]}
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
            />
            <Legend />
            
            {/* Male Data Points */}
            <Scatter 
              name="MALE" 
              data={scatterPlotData.male}
              fill={colors[0]}
            />
            
            {/* Female Data Points */}
            <Scatter 
              name="FEMALE" 
              data={scatterPlotData.female}
              fill={colors[1]}
              />

              {/* Male Trendline */}
              <Line 
                type="linear"
                dataKey="y"
                data={trendlineData.maleTrend}
                stroke={colors[0]}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                name="Male Trend"
              />
  
              {/* Female Trendline */}
              <Line 
                type="linear"
                dataKey="y"
                data={trendlineData.femaleTrend}
                stroke={colors[1]}
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={false}
                name="Female Trend"
              />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SexCharts