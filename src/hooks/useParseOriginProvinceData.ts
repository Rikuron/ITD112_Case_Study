import { useState, useEffect, useMemo } from 'react'
import { getAllProvinceData } from '../api/originService'

const normalizeName = (s: string) =>
  (s || '')
  .toUpperCase()
  .trim()
  .replace(/\s*\([^)]*\)\s*/g, ' ') // drop parenthetical notes
  .replace(/\s+/g, ' ')
  .trim()

type ProvinceTotals = Record<string, number>

export const useParseOriginProvinceData = (year: number | 'all' = 'all') => {
  const [totals, setTotals] = useState<ProvinceTotals>({})
  const [allRows, setAllRows] = useState<any[]>([])
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFromFirebase()
  }, [])

  useEffect(() => {
    if (allRows.length === 0) return

    const rows = year === 'all' ? allRows : allRows.filter((r: any) => r.Year === year)

    const t: ProvinceTotals = {}

    // Get all provinces
    const provinceNames = Object.keys(allRows[0]).filter(key => key !== 'Year')

    // Calculate totals for each province
    provinceNames.forEach(rawProvince => {
      const name = normalizeName(rawProvince)
      if (name === 'NCR') return // Skip NCR since my GeoJSON data splits it into districts

      let sum = 0
      rows.forEach(row => {
        const value = row[rawProvince]
        if (typeof value === 'number' && !Number.isNaN(value)) {
          sum += value
        }
      })

      if (sum > 0) {
        t[name] = sum
      }
    })

    const values = Object.values(t)
    setTotals(t)
    setMin(values.length ? Math.min(...values) : 0)
    setMax(values.length ? Math.max(...values) : 0)
    setLoading(false)
  }, [year, allRows])

  const years = useMemo(() => {
    return Array.from(new Set(allRows.map(r => r.Year))).sort((a, b) => b - a)
  }, [allRows])

  const fetchFromFirebase = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getAllProvinceData()

      if (data.length === 0) {
        setError('No province data found in Firebase. Please upload data first.')
        setLoading(false)
        return
      }

      setAllRows(data)
      setLoading(false)
      console.log('✅ Successfully loaded province data from Firebase')
    } catch (err) {
      console.error('Error fetching province data from Firebase:', err)
      setError('Failed to load province data from Firebase. Please check your connection.')
      setLoading(false)
    }
  }

  return { totals, years, min, max, loading, error }
}