import { useState, useEffect } from 'react'
import { ResponsiveChoropleth } from '@nivo/geo'
import { useParseAllDestinationData } from '../../hooks/useParseAllDestinationData'

const allDestinationDataCSV = '/data/Emigrant-1981-2020-AllCountries.csv'

// Country name mapping from CSV to GeoJSON ISO codes
const countryMapping: Record<string, string> = {
  "ALBANIA": "ALB",
  "ANGOLA": "AGO",
  "ANTARCTICA": "ATA",
  "ARGENTINA": "ARG",
  "AUSTRALIA": "AUS",
  "AUSTRIA": "AUT",
  "BAHAMAS": "BHS",
  "BANGLADESH": "BGD",
  "BELGIUM": "BEL",
  "BOLIVIA": "BOL",
  "BOSNIA AND HERZEGOVINA": "BIH",
  "BRAZIL": "BRA",
  "BRUNEI DARUSSALAM": "BRN",
  "BULGARIA": "BGR",
  "CANADA": "CAN",
  "CHILE": "CHL",
  "CHINA (P.R.O.C.)": "CHN",
  "COLOMBIA": "COL",
  "COSTA RICA": "CRI",
  "CROATIA": "HRV",
  "CYPRUS": "CYP",
  "CZECH REPUBLIC": "CZE",
  "DEMOCRATIC REPUBLIC OF THE CONGO (ZAIRE)": "COD",
  "DENMARK": "DNK",
  "DOMINICAN REPUBLIC": "DOM",
  "ECUADOR": "ECU",
  "EGYPT": "EGY",
  "ESTONIA": "EST",
  "ETHIOPIA": "ETH",
  "FALKLAND ISLANDS (MALVINAS)": "FLK",
  "FIJI": "FJI",
  "FINLAND": "FIN",
  "FRANCE": "FRA",
  "GABON": "GAB",
  "GERMANY": "DEU",
  "GHANA": "GHA",
  "GREECE": "GRC",
  "GREENLAND": "GRL",
  "HUNGARY": "HUN",
  "ICELAND": "ISL",
  "INDIA": "IND",
  "INDONESIA": "IDN",
  "IRAN": "IRN",
  "IRAQ": "IRQ",
  "IRELAND": "IRL",
  "ITALY": "ITA",
  "JAPAN": "JPN",
  "JORDAN": "JOR",
  "KAZAKHSTAN": "KAZ",
  "KUWAIT": "KWT",
  "LATVIA": "LVA",
  "LEBANON": "LBN",
  "LESOTHO": "LSO",
  "LIBERIA": "LBR",
  "LIBYA": "LBY",
  "LITHUANIA": "LTU",
  "LUXEMBOURG": "LUX",
  "MACEDONIA": "MKD",
  "MALAYSIA": "MYS",
  "MEXICO": "MEX",
  "MOROCCO": "MAR",
  "MYANMAR (BURMA)": "MMR",
  "NAMIBIA": "NAM",
  "NEPAL": "NPL",
  "NETHERLANDS": "NLD",
  "NEW ZEALAND": "NZL",
  "NORWAY": "NOR",
  "OMAN": "OMN",
  "PAKISTAN": "PAK",
  "PANAMA": "PAN",
  "PAPUA NEW GUINEA": "PNG",
  "PERU": "PER",
  "POLAND": "POL",
  "PORTUGAL": "PRT",
  "PUERTO RICO": "PRI",
  "QATAR": "QAT",
  "ROMANIA": "ROU",
  "RUSSIAN FEDERATION / USSR": "RUS",
  "SAUDI ARABIA": "SAU",
  "SLOVAK REPUBLIC": "SVK",
  "SLOVENIA": "SVN",
  "SOLOMON ISLANDS": "SLB",
  "SOUTH AFRICA": "ZAF",
  "SOUTH KOREA": "KOR",
  "SPAIN": "ESP",
  "SRI LANKA": "LKA",
  "SUDAN": "SDN",
  "SWEDEN": "SWE",
  "SWITZERLAND": "CHE",
  "SYRIA": "SYR",
  "TAIWAN (ROC)": "TWN",
  "THAILAND": "THA",
  "TRINIDAD AND TOBAGO": "TTO",
  "TUNISIA": "TUN",
  "TURKEY": "TUR",
  "UGANDA": "UGA",
  "UKRAINE": "UKR",
  "UNITED ARAB EMIRATES": "ARE",
  "UNITED KINGDOM": "GBR",
  "UNITED STATES OF AMERICA": "USA",
  "URUGUAY": "URY",
  "VANUATU": "VUT",
  "VENEZUELA": "VEN",
  "VIETNAM": "VNM",
  "YEMEN": "YEM"
}

const ChoroplethMap = () => {
  const { mapData, loading } = useParseAllDestinationData(allDestinationDataCSV)
  const [geoData, setGeoData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/data/worldCountries.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load map data')
        return res.json()
      })
      .then(data => {
        console.log('GeoJSON loaded:', data)
        setGeoData(data)
      })
      .catch(err => {
        console.error('Error loading GeoJSON:', err)
        setError(err.message)
      })
  }, [])

  if (error) return <div className="text-white p-6">Error: {error}</div>
  if (loading || !geoData) return <div className="text-white p-6">Loading map...</div>

  // Transform data for Nivo Choropleth format
  const nivoData = mapData.map(item => {
    let categoryValue = 0
    if (item.total >= 1000000) categoryValue = 4
    else if (item.total >= 500000) categoryValue = 3
    else if (item.total >= 100000) categoryValue = 2
    else if (item.total >= 10000) categoryValue = 1
    
    return {
      id: countryMapping[item.country] || item.country,
      value: categoryValue,
      total: item.total
    }
  })

  return (
    <div className="bg-primary rounded-lg shadow-md p-6 border-2 border-highlights">
      <h2 className="text-lg text-center font-inter text-stroke text-white mb-4">
        Emigrant Destinations by Country (1981 - 2020)
      </h2>

      <div style={{ height: '600px' }}>
        <ResponsiveChoropleth
          data={nivoData}
          features={geoData.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors={['#1E293B', '#155E75', '#0D9488', '#2DD4BF', '#5EEAD4']}
          domain={[0, 4]}
          unknownColor="#1e293b"
          label="properties.name"
          valueFormat={(value) => {
            const country = nivoData.find(item => item.value === value)
            return country ? country.total.toLocaleString() : value.toString()
          }}
          tooltip={({ feature }) => (
            <div style={{
              background: '#2A324A',
              border: '1px solid #3661E2',
              borderRadius: '8px',
              padding: '10px',
              color: '#ffffff'
            }}>
              <strong>{feature.label}</strong><br />
              Total: {feature.data?.total?.toLocaleString() || 'N/A'}
            </div>
          )}
          projectionScale={130}
          projectionTranslation={[0.5, 0.6]}
          projectionRotation={[0, 0, 0]}
          enableGraticule={false}
          borderWidth={0.5}
          borderColor="#3661E2"
        />
      </div>

      {/* Custom Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6" style={{ backgroundColor: '#5EEAD4' }}></div>
          <span className="text-white text-sm">Extreme (≥1M)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6" style={{ backgroundColor: '#2DD4BF' }}></div>
          <span className="text-white text-sm">Significant (≥500K)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6" style={{ backgroundColor: '#0D9488' }}></div>
          <span className="text-white text-sm">Moderate (≥100K)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6" style={{ backgroundColor: '#155E75' }}></div>
          <span className="text-white text-sm">Slight (≥10K)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6" style={{ backgroundColor: '#1E293B' }}></div>
          <span className="text-white text-sm">Nil (&lt;10K)</span>
        </div>
      </div>
    </div>
  )
}

export default ChoroplethMap
