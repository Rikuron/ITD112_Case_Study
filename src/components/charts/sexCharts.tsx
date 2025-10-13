import { useState, useEffect } from 'react'
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
import LoadingScreen from '../loadingScreen'
import { ResponsiveBar } from '@nivo/bar'
import { useParseSexData } from '../../hooks/useParseSexData'
import { useIsMobile } from '../../hooks/useIsMobile'
import { COLUMN_ORDERS } from '../../utils/columnOrders'

const SexCharts = () => {
  const { chartData, populationPyramidData, scatterPlotData, trendlineData, sexCategories, loading, error } = useParseSexData()
  const [selectedLineSexCategories, setSelectedLineSexCategories] = useState<string[]>([])
  const [selectedScatterSexCategories, setSelectedScatterSexCategories] = useState<string[]>([])
  const isMobile = useIsMobile()

  useEffect(() => {
    if (sexCategories.length > 0) setSelectedLineSexCategories(sexCategories)
    if (sexCategories.length > 0) setSelectedScatterSexCategories(sexCategories)
  }, [sexCategories])

  // Sex Category Checkbox handler
  const handleLineSexCategoryChange = (sexCategory: string) => {
    setSelectedLineSexCategories(prev =>
      prev.includes(sexCategory) ? prev.filter(sc => sc !== sexCategory) : [...prev, sexCategory]
    )
  }

  const handleScatterSexCategoryChange = (sexCategory: string) => {
    setSelectedScatterSexCategories(prev =>
      prev.includes(sexCategory) ? prev.filter(sc => sc !== sexCategory) : [...prev, sexCategory]
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

  const colors = [
    '#8884d8', '#ff8042'
  ]

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Line Chart */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Emigration Trends By Sex (1981 - 2020)</h2>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-white">
          {COLUMN_ORDERS.sex.map(sexCategory => (
            <label key={sexCategory} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedLineSexCategories.includes(sexCategory)}
                onChange={() => handleLineSexCategoryChange(sexCategory)}
                className="form-checkbox h-2.5 w-2.5 md:h-4 md:w-4 text-highlights rounded"
                defaultChecked={selectedLineSexCategories.includes(sexCategory)}
              />
              <span className="font-inter text-xs md:text-sm">{sexCategory}</span>
            </label>
          ))}
        </div>

        <div className={isMobile ? 'overflow-x-auto' : ''}>
          <div style={{ width: isMobile ? '1400px' : 'auto' }}>
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
                  selectedLineSexCategories.includes(sexCategory) && (
                    <Line key={sexCategory} type="monotone" dataKey={sexCategory} stroke={colors[i % colors.length]} name={sexCategory} strokeWidth={2} />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Population Pyramid */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Population Pyramid By Sex (1981 - 2020)</h2>
        
        <div className={isMobile ? 'overflow-x-auto' : ''}>
          <div style={{ width: isMobile ? '600px' : 'auto', height: '500px' }}>
            <ResponsiveBar
              data={populationPyramidData}
              keys={['MaleNegative', 'FEMALE']}
              indexBy="Period"
              layout="horizontal"
              margin={{ top: 0, right: 80, bottom: 90, left: 120 }}
              padding={0.2}
              valueScale={{ type: 'linear', min: -250000, max: 250000 }}
              indexScale={{ type: 'band', round: true }}
              colors={colors}
              borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
              }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Population',
                legendPosition: 'middle',
                legendOffset: 40,
                format: (value) => {
                  const absValue = Math.abs(value)
                  if (absValue === 0) return '0'
                  if (absValue >= 1000) {
                    return `${(absValue / 1000).toFixed(0)}k`
                  }
                  return absValue.toString()
                }
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0
              }}
              enableGridX={true}
              enableGridY={true}
              gridXValues={[-200000, -150000, -100000, -50000, 0, 50000, 100000, 150000, 200000, 250000]}
              enableLabel={false}
              labelSkipWidth={12}
              labelSkipHeight={12}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 90,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  data: [
                    {
                      id: 'MaleNegative',
                      label: 'MALE',
                      color: colors[0]
                    },
                    {
                      id: 'FEMALE',
                      label: 'FEMALE',
                      color: colors[1]
                    }
                  ],
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
              tooltip={({ id, value, data }) => (
                <div
                  style={{
                    background: '#2A324A',
                    border: '1px solid #3661E2',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    minWidth: '175px',
                    width: 'auto'
                  }}
                >
                  <div style={{ color: '#3661E2', fontWeight: 'bold', marginBottom: '8px' }}>
                    {data.Period}
                  </div>
                  <div className={id === 'MaleNegative' ? `text-[${colors[0]}]` : `text-[${colors[1]}]`}>
                    <strong>{id === 'MaleNegative' ? 'MALE' : id}:</strong> {Math.abs(value).toLocaleString()}
                  </div>
                </div>
              )}
              theme={{
                background: 'transparent',
                text: {
                  fontSize: 14,
                  fill: '#666666',
                  fontFamily: 'Inter, sans-serif'
                },
                axis: {
                  domain: {
                    line: {
                      stroke: '#4a5568',
                      strokeWidth: 1
                    }
                  },
                  ticks: {
                    line: {
                      stroke: '#4a5568',
                      strokeWidth: 1
                    },
                    text: {
                      fill: '#666666',
                      fontFamily: 'Inter, sans-serif',
                    }
                  },
                  legend: {
                    text: {
                      fill: '#ffffff',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 'bold'
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: '#4a5568',
                    strokeWidth: 1,
                    strokeDasharray: '3 3'
                  }
                },
                legends: {
                  text: {
                    fill: '#ffffff',
                    fontFamily: 'Inter, sans-serif'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Scatter Plot */}
      <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
        <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">Male vs Female Emigration Scatter Plot (1981 - 2020)</h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 text-white">
          {COLUMN_ORDERS.sex.map(sexCategory => (
            <label key={sexCategory} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedScatterSexCategories.includes(sexCategory)}
                onChange={() => handleScatterSexCategoryChange(sexCategory)}
                className="form-checkbox h-2.5 w-2.5 md:h-4 md:w-4 text-highlights rounded"
                defaultChecked={selectedScatterSexCategories.includes(sexCategory)}
              />
              <span className="font-inter text-xs md:text-sm">{sexCategory}</span>
            </label>
          ))}
        </div>

        <div className={isMobile ? 'overflow-x-auto' : ''} style={{ height: '500px' }}>
          <div style={{ width: isMobile ? '1250px' : 'auto' }}>
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
                  tickFormatter = {(value) => `'${value.toString().slice(-2)}`}
                />
                <YAxis 
                  type="number" 
                  dataKey="y"
                  name="Count"
                  domain={[0, 60000]}
                />
                <Tooltip 
                  wrapperStyle={{ zIndex: 10 }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const year = payload[0]?.payload?.x
                      const yearData = chartData.find(d => d.YEAR === year)
                      
                      if (yearData) {
                        return (
                          <div className="bg-[#2A324A] border border-[#3661E2] rounded-lg p-3 text-white text-sm font-inter min-w-[175px] w-auto">
                            <div className="text-[#3661E2] font-bold mb-2">
                              Year: {year}
                            </div>
                            {selectedScatterSexCategories.includes('MALE') && (
                              <div className="text-[#8884d8]">
                                Male: {yearData.MALE?.toLocaleString()}
                              </div>
                            )}
                            {selectedScatterSexCategories.includes('FEMALE') && (
                              <div className="text-[#ff8042]">
                                Female: {yearData.FEMALE?.toLocaleString()}
                              </div>
                            )}
                          </div>
                        )
                      }
                    }
                    return null
                  }}
                />
                
                <Legend />

                {selectedScatterSexCategories.includes('MALE') && (
                  <>
                    <Scatter 
                      name="MALE" 
                      data={scatterPlotData.male}
                      fill={colors[0]}
                    />
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
                  </>
                )}

                {selectedScatterSexCategories.includes('FEMALE') && (
                  <>
                    <Scatter 
                      name="FEMALE" 
                      data={scatterPlotData.female}
                      fill={colors[1]}
                    />
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
                  </>
                )}

              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SexCharts