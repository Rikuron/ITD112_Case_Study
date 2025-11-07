import { useIsMobile } from '../hooks/useIsMobile'

export type DataType = 'age' | 'civilStatus' | 'majorDestination' | 'allDestination' | 'education' | 'occupation' | 'sex' | 'region' | 'province'

interface DataTypeTabsProps {
  selectedDataType: DataType
  onDataTypeChange: (dataType: DataType) => void
  dataTypes: DataType[]
}

const formatDataTypeName = (key: string) => {
  // Convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
}

const DataTypeTabs = ({ selectedDataType, onDataTypeChange, dataTypes }: DataTypeTabsProps) => {
  const isMobile = useIsMobile()

  return (
    <div className="mb-6 w-full">
      <div className={`flex ${
        isMobile 
          ? 'flex-col w-full' 
          : 'flex-row w-full'
      } items-stretch rounded-lg bg-secondary border border-highlights/20 p-1 gap-1`}>
        {dataTypes.map((dataType) => {
          const isActive = selectedDataType === dataType
          return (
            <button
              key={dataType}
              onClick={() => onDataTypeChange(dataType)}
              className={`
                relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                flex items-center justify-center
                ${
                  isMobile
                    ? 'w-full text-left justify-start'
                    : 'flex-1 text-center'
                }
                ${
                  isActive
                    ? 'bg-highlights text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-highlights/50'
                }
                focus:outline-none focus:ring-2 focus:ring-highlights focus:ring-offset-2 focus:ring-offset-secondary
                hover:cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-selected={isActive}
              role="tab"
            >
              <span className="leading-tight">
                {formatDataTypeName(dataType)} Data
              </span>
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
    </div>
  )
}

export default DataTypeTabs