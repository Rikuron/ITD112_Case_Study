import { ResponsiveTreeMap } from '@nivo/treemap'

interface TreemapNivoProps {
  data: {
    name: string
    value: number
  }[]
  occupationLabelMap: Record<string, string>
}

const TreemapNivo = ({ data, occupationLabelMap }: TreemapNivoProps) => {
  const colors = [
    '#1e90ff', '#32cd32', '#ff8c00', '#8a2be2', '#ff1493', 
    '#228b22', '#ffd700', '#dc143c', '#20b2aa', '#ff4500', 
    '#4169e1', '#9932cc', '#696969', '#a9a9a9'
  ]

  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Transform data to Nivo format
  const nivoData = {
    name: 'occupations',
    color: '#2A324A',
    children: data.map((item, index) => ({
      name: item.name,
      fullName: occupationLabelMap[item.name] || item.name,
      value: item.value,
      color: colors[index % colors.length],
    })),
  }

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <ResponsiveTreeMap
        data={nivoData}
        identity="name"
        value="value"
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        labelSkipSize={0}
        labelTextColor="white"
        colors={(node: any) => node.data.color}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]]
        }}
        borderWidth={2}
        label={(node: any) => {
          const value = node.value
          const percentage = ((value / total) * 100).toFixed(2)
          const name = node.data?.name || ''
          const fullName = node.data?.fullName || ''
          
          if (!name) return ''
          
          // Get rectangle dimensions
          const width = node.width || 0
          const height = node.height || 0
          const area = width * height
          
          // Estimate max characters that fit (adjust based on font size)
          const estimatedFontSize = Math.min(14, Math.max(8, Math.sqrt(area) / 8))
          const maxChars = Math.floor(width / (estimatedFontSize * 0.6))
          
          // Very large rectangles - show full name, value, and percentage
          if (area > 25000 && width > 200) {
            const truncatedName = fullName.length > maxChars ? fullName.substring(0, maxChars - 3) + '...' : fullName
            return `${truncatedName}: ${value.toLocaleString()} (${percentage}%)`
          } 
          // Large rectangles - show name and percentage
          else if (area > 12000 && width > 120) {
            const truncatedName = name.length > maxChars - 6 ? name.substring(0, maxChars - 9) + '...' : name
            return `${truncatedName}: ${percentage}%`
          } 
          // Medium rectangles - show name or percentage
          else if (area > 5000 && width > 80) {
            return name.length > maxChars ? `${percentage}%` : name
          } 
          // Small rectangles - just percentage
          else if (area > 2500) {
            return `${percentage}%`
          } 
          // Very small - hide
          else {
            return ''
          }
        }}
        orientLabel={false}
        enableParentLabel={false}
        animate={true}
        motionConfig="gentle"
        tooltip={({ node }: any) => {
          const fullName = node.data.fullName
          const value = node.value
          const percentage = ((value / total) * 100).toFixed(2)
          
          return (
            <div
              style={{
                background: '#2A324A',
                padding: '12px 16px',
                border: '2px solid #3661E2',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#3661E2', marginBottom: '4px' }}>
                {fullName}
              </div>
              <div>
                <strong>Count:</strong> {value.toLocaleString()}
              </div>
              <div>
                <strong>Percentage:</strong> {percentage}%
              </div>
            </div>
          )
        }}
        theme={{
          text: {
            fontSize: 12,
            fontWeight: 'bold',
            fill: '#ffffff',
            fontFamily: 'Inter, sans-serif',
          },
          tooltip: {
            container: {
              background: 'transparent',
              padding: 0,
            },
          },
        }}
      />
    </div>
  )
}

export default TreemapNivo
