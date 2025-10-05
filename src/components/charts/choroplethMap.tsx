import { useState, useEffect } from 'react'
import { ResponsiveChoropleth } from '@nivo/geo'
import { useParseAllDestinationData } from '../../hooks/useParseAllDestinationData'

const allDestinationDataCSV = '/data/Emigrant-1981-2020-AllCountries.csv'

// Country name mapping from CSV to GeoJSON ISO codes
const countryMapping: Record<string, string> = {
  "PHILIPPINES": "PHL",
  "AFGHANISTAN": "AFG",
  "ALBANIA": "ALB",
  "ALGERIA": "DZA",
  "ANGOLA": "AGO",
  "ANTARCTICA": "ATA",
  "ARGENTINA": "ARG",
  "ARMENIA": "ARM",
  "AUSTRALIA": "AUS",
  "AUSTRIA": "AUT",
  "AZERBAIJAN": "AZE",
  "BAHAMAS": "BHS",
  "BANGLADESH": "BGD",
  "BELARUS": "BLR",
  "BELGIUM": "BEL",
  "BELIZE": "BLZ",
  "BENIN": "BEN",
  "BHUTAN": "BTN",
  "BOLIVIA": "BOL",
  "BOSNIA AND HERZEGOVINA": "BIH",
  "BOTSWANA": "BWA",
  "BRAZIL": "BRA",
  "BRUNEI DARUSSALAM": "BRN",
  "BULGARIA": "BGR",
  "BURKINA": "BFA",
  "BURUNDI": "BDI",
  "CAMBODIA": "KHM",
  "CAMEROON": "CMR",
  "CANADA": "CAN",
  "CENTRAL AFRICAN REPUBLIC": "CAF",
  "CHAD": "TCD",
  "CHILE": "CHL",
  "CHINA (P.R.O.C.)": "CHN",
  "COLOMBIA": "COL",
  "COSTA RICA": "CRI",
  "COTE D' IVOIRE (IVORY COAST)": "CIV",
  "CROATIA": "HRV",
  "CUBA": "CUB",
  "CYPRUS": "CYP",
  "CZECH REPUBLIC": "CZE",
  "DEMOCRATIC REPUBLIC OF THE CONGO (ZAIRE)": "COD",
  "DENMARK": "DNK",
  "DJIBOUTI": "DJI",
  "DOMINICAN REPUBLIC": "DOM",
  "ECUADOR": "ECU",
  "EGYPT": "EGY",
  "EL SALVADOR": "SLV",
  "EQUATORIAL GUINEA": "GNQ",
  "ERITREA": "ERI",
  "ESTONIA": "EST",
  "ETHIOPIA": "ETH",
  "FALKLAND ISLANDS (MALVINAS)": "FLK",
  "FIJI": "FJI",
  "FINLAND": "FIN",
  "FRANCE": "FRA",
  "FRENCH SOUTHERN AND ANTARCTIC LANDS": "ATF",
  "GABON": "GAB",
  "GAMBIA": "GMB",
  "GERMANY": "DEU",
  "GEORGIA": "GEO",
  "GHANA": "GHA",
  "GREECE": "GRC",
  "GREENLAND": "GRL",
  "GUATEMALA": "GTM",
  "GUINEA": "GIN",
  "GUINEA BISSAU": "GNB",
  "GUYANA": "GUY",
  "HAITI": "HTI",
  "HONDURAS": "HND",
  "HUNGARY": "HUN",
  "ICELAND": "ISL",
  "INDIA": "IND",
  "INDONESIA": "IDN",
  "IRAN": "IRN",
  "IRAQ": "IRQ",
  "IRELAND": "IRL",
  "ISRAEL": "ISR",
  "ITALY": "ITA",
  "JAMAICA": "JAM",
  "JAPAN": "JPN",
  "JORDAN": "JOR",
  "KAZAKHSTAN": "KAZ",
  "KENYA": "KEN",
  "KOSOVO": "OSA",
  "KUWAIT": "KWT",
  "KYRGYZSTAN": "KGZ",
  "LAOS": "LAO",
  "LATVIA": "LVA",
  "LEBANON": "LBN",
  "LESOTHO": "LSO",
  "LIBERIA": "LBR",
  "LIBYA": "LBY",
  "LITHUANIA": "LTU",
  "LUXEMBOURG": "LUX",
  "MACEDONIA": "MKD",
  "MADAGASCAR": "MDG",
  "MALAWI": "MWI",
  "MALAYSIA": "MYS",
  "MALI": "MLI",
  "MAURITANIA": "MRT",
  "MEXICO": "MEX",
  "MOLDOVA": "MDA",
  "MONGOLIA": "MNG",
  "MONTENEGRO": "MNE",
  "MOROCCO": "MAR",
  "MOZAMBIQUE": "MOZ",
  "MYANMAR (BURMA)": "MMR",
  "NAMIBIA": "NAM",
  "NEPAL": "NPL",
  "NETHERLANDS": "NLD",
  "NEW CALEDONIA": "NCL",
  "NEW ZEALAND": "NZL",
  "NICARAGUA": "NIC",
  "NIGER": "NER",
  "NIGERIA": "NGA",
  "NORTHERN CYPRUS": "-99",
  "NORTH KOREA": "PRK",
  "NORWAY": "NOR",
  "OMAN": "OMN",
  "PAKISTAN": "PAK",
  "PANAMA": "PAN",
  "PAPUA NEW GUINEA": "PNG",
  "PARAGUAY": "PRY",
  "PERU": "PER",
  "POLAND": "POL",
  "PORTUGAL": "PRT",
  "PUERTO RICO": "PRI",
  "QATAR": "QAT",
  "REPUBLIC OF THE CONGO": "COG",
  "REPUBLIC OF SERBIA": "SRB",
  "ROMANIA": "ROU",
  "RUSSIAN FEDERATION / USSR": "RUS",
  "RWANDA": "RWA",
  "SAUDI ARABIA": "SAU",
  "SENEGAL": "SEN",
  "SIERRA LEONE": "SLE",
  "SLOVAK REPUBLIC": "SVK",
  "SLOVENIA": "SVN",
  "SOLOMON ISLANDS": "SLB",
  "SOMALIA": "SOM",
  "SOMALILAND": "ABV",
  "SOUTH AFRICA": "ZAF",
  "SOUTH KOREA": "KOR",
  "SOUTH SUDAN": "SDS",
  "SPAIN": "ESP",
  "SRI LANKA": "LKA",
  "SUDAN": "SDN",
  "SURINAME": "SUR",
  "SWEDEN": "SWE",
  "SWAZILAND": "SWZ",
  "SWITZERLAND": "CHE",
  "SYRIA": "SYR",
  "TAIWAN (ROC)": "TWN",
  "TAJIKISTAN": "TJK",
  "THAILAND": "THA",
  "TOGO": "TGO",
  "TRINIDAD AND TOBAGO": "TTO",
  "TUNISIA": "TUN",
  "TURKEY": "TUR",
  "TURKMENISTAN": "TKM",
  "UGANDA": "UGA",
  "UKRAINE": "UKR",
  "UNITED ARAB EMIRATES": "ARE",
  "UNITED KINGDOM": "GBR",
  "UNITED REPUBLIC OF TANZANIA": "TZA",
  "UNITED STATES OF AMERICA": "USA",
  "URUGUAY": "URY",
  "UZBEKISTAN": "UZB",
  "VANUATU": "VUT",
  "VENEZUELA": "VEN",
  "VIETNAM": "VNM",
  "WEST BANK": "PSE",
  "WESTERN SAHARA": "ESH",
  "YEMEN": "YEM",
  "ZAMBIA": "ZMB",
  "ZIMBABWE": "ZWE"
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
        Emigrant Destination of Filipinos by Country (1981 - 2020)
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
