import { useEffect, useState } from 'react'
import { ResponsiveChoropleth } from '@nivo/geo'
import { useParseOriginProvinceData } from '../../hooks/useParseOriginProvinceData'

const csvPath = '/data/Emigrant-1988-2020-PlaceOfOrigin-Province.csv'

const normalizeName = (s: string) =>
  (s || '')
    .toUpperCase()
    .trim()
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const provinceGeoPath = '/data/Provinces.json'

const PHOriginChoropleth = () => {
  const { totals, min, max, loading } = useParseOriginProvinceData(csvPath)
  const [features, setFeatures] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(provinceGeoPath)
    .then((r) => {
      if (!r.ok) throw new Error('Failed to load map data')
      return r.json()
    })
    .then((fc) => {
      const feats = (fc?.features || [])
      .filter((feat: any) =>
        (feat?.properties?.ENGTYPE_1 || '').toUpperCase() === 'PROVINCE' &&
        feat?.properties?.PROVINCE
      )
      .map((feat: any) => ({
        ...feat,
        id: normalizeName(feat.properties.PROVINCE)
      }))

      setFeatures(feats)
    })
    .catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="text-white p-6">Error: {error}</div>
  if (loading || !features) return <div className="text-white p-6">Loading map...</div>

  const data = Object.entries(totals).map(([name, total]) => ({
    id: name,
    value: total,
    total
  }))

  return (
    <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
      <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">
        Emigrant Origin Density by Province (1988 - 2020)
      </h2>

      <div style={{ height: '600px' }}>
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
  )
}

export default PHOriginChoropleth