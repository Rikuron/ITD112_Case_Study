import { useCallback } from 'react'
import { ResponsiveChoropleth } from '@nivo/geo'
import { useParseOriginProvinceData } from '../../hooks/useParseOriginProvinceData'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useGeoJSON } from '../../hooks/useGeoJSON'
import { useYearFilter } from '../../hooks/useYearFilter'

const normalizeName = (s: string) =>
  (s || '')
    .toUpperCase()
    .trim()
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const PHOriginChoropleth = () => {
  const { selectedYear, onSelectChange } = useYearFilter('all')
  const { totals, years, min, max, loading, error: dataError } = useParseOriginProvinceData(selectedYear)
  const isMobile = useIsMobile()
  
  const transform = useCallback((fc: any) => (
    (fc?.features || []).filter((feat: any) =>
      (feat?.properties?.ENGTYPE_1 || '').toUpperCase() === 'PROVINCE' &&
      feat?.properties?.PROVINCE
    ).map((feat: any) => ({
      ...feat,
      id: normalizeName(feat.properties.PROVINCE)
    }))
  ), [])

  const { data: features, loading: geoLoading, error: geoError } = useGeoJSON<any[]>(
    '/data/Provinces.json',
    transform    
  )

  if (geoError) return <div className="text-red-500 p-6">Error: {geoError}</div>
  if (dataError) return <div className="text-red-500 p-6">Error: {dataError}</div>
  if (loading || geoLoading || !features) return <div className="text-white p-6">Loading map...</div>

  const data = Object.entries(totals).map(([name, total]) => ({
    id: name,
    value: total,
    total
  }))

  return (
    <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
      <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">
        {selectedYear === 'all' 
          ? 'Emigrant Origin Density by Province (1988 - 2020)' 
          : `Emigrant Origin Density by Province in ${selectedYear}`
        }
      </h2>

      {/* Year Filter Dropdown */}
      <div className="mb-4 flex justify-center">
        <select
          value={selectedYear}
          onChange={onSelectChange}
          className="px-4 py-2 bg-secondary border border-highlights rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-highlights"
        >
          <option value="all">All Years (1988-2020)</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className={isMobile ? 'overflow-x-auto' : ''}>
        <div style={{ width: isMobile ? '600px' : '100%', height: '600px' }}>
          <ResponsiveChoropleth
            data={data}
            features={features}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            colors={['#0b1020', '#1e3a8a', '#2563eb', '#60a5fa', '#93c5fd']}
            domain={[min, max]}
            unknownColor="#1e293b"
            label="properties.PROVINCE"
            valueFormat={(v) => Number(v).toLocaleString()}
            tooltip={({ feature }: any) => (
              <div
                style={{
                  background: '#2A324A',
                  border: '1px solid #3661E2',
                  borderRadius: '8px',
                  padding: '10px',
                  color: '#ffffff'
                }}
              >
                <strong>{feature.properties?.PROVINCE}</strong>
                <br />
                Total: {feature.data?.total?.toLocaleString() || 'N/A'}
              </div>
            )}
            // Tuned to center/scale PH; adjust if needed
            projectionScale={2000}
            projectionTranslation={[0.5, 0.72]}
            projectionRotation={[-122, -8.5, 0]}
            enableGraticule={false}
            borderWidth={0.5}
            borderColor="#3661E2"
          />
        </div>
      </div>
    </div>
  )
}

export default PHOriginChoropleth