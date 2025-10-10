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
import TreemapNivo from './treemapNivo'

const occupationLabelMap: Record<string, string> = {
  "Prof'l": "Prof'l, Tech'l, & Related Workers",
  "Managerial": "Managerial, Executive, and Administrative Workers",
  "Clerical": "Clerical Workers",
  "Sales": "Sales Workers",
  "Service": "Service Workers",
  "Agriculture": "Agriculture, Animal Husbandry, Forestry Workers & Fishermen",
  "Production": "Production Process, Transport Equipment Operators, & Laborers",
  "Armed Forces": "Members of the Armed Forces",
  "Housewives": "Housewives",
  "Retirees": "Retirees",
  "Students": "Students",
  "Minors": "Minors (Below 7 years old)",
  "Out of School Youth": "Out of School Youth",
  "No Occupation Reported": "No Occupation Reported"
}

// Tooltip Formatter to display new occupation labels
const customTooltipFormatter = (value: any, name: string) => {
  const fullName = occupationLabelMap[name] || name
  return [value.toLocaleString(), fullName]
} 

const OccupationCharts = () => {
  const { chartData, occupations, treemapData, loading, error } = useParseOccupationData()

  // Show loading message
  if (loading) return (
    <div className="text-white text-center p-8">
      <div className="animate-pulse">Loading occupation data from Firebase...</div>
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
              formatter={customTooltipFormatter}
            />
            <Legend wrapperStyle={{ zIndex: 1 }} />

            {occupations.map((occupation, i) => (
              <Line key={occupation} type="monotone" dataKey={occupation} stroke={colors[i % colors.length]} name={occupation} />
            ))}
          </LineChart>
        </ResponsiveContainer>

      </div>


      {/* Treemap Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Total Emigration Composition By Occupation Category (1981 - 2020)</h2>
        <TreemapNivo 
          key={`treemap-${treemapData.length}`}
          data={treemapData} 
          occupationLabelMap={occupationLabelMap} 
        />
      </div>


    </div>
  )
}

export default OccupationCharts