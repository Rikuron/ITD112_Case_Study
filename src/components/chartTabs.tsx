import { useIsMobile } from '../hooks/useIsMobile'

export type ChartKey = 'age' | 'civil_status' | 'destination' | 'education' | 'occupation' | 'sex' | 'origin'

interface ChartTabsProps {
  selectedChart: ChartKey
  onChartChange: (chart: ChartKey) => void
  chartKeys: ChartKey[]
}

const formatChartName = (key: string) => {
  return key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const ChartTabs = ({ selectedChart, onChartChange, chartKeys }: ChartTabsProps) => {
  const isMobile = useIsMobile()

  return (
    <div className="mb-8 w-full">
      {isMobile ? (
        /* Mobile Dropdown Navigation */
        <select
          value={selectedChart}
          onChange={(e) => onChartChange(e.target.value as ChartKey)}
          className="w-full px-4 py-3 rounded-lg border border-highlights/20 bg-secondary text-gray-300 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-highlights focus:ring-offset-2 focus:ring-offset-primary transition-all duration-200"
        >
          {chartKeys.map((key) => (
            <option key={key} value={key} className="bg-secondary text-gray-300">
              {formatChartName(key)}
            </option>
          ))}
        </select>
      ) : (
        /* Desktop Tabs Navigation */
        <div className="flex flex-row w-full items-start rounded-lg bg-secondary border border-highlights/20 p-1 gap-1">
          {chartKeys.map((key) => {
            const isActive = selectedChart === key
            return (
              <button
                key={key}
                onClick={() => onChartChange(key)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                  flex-1 text-center
                  ${
                    isActive
                      ? 'bg-highlights text-white shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-highlights/50 hover:cursor-pointer'
                  }
                  focus:outline-none focus:ring-2 focus:ring-highlights focus:ring-offset-2 focus:ring-offset-secondary
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                aria-selected={isActive}
                role="tab"
              >
                {formatChartName(key)}
                {isActive && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-highlights rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ChartTabs