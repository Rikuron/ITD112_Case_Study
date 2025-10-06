import { useEffect, useState } from 'react'
import Papa from 'papaparse'

const normalizeName = (s: string) =>
  (s || '')
    .toUpperCase()
    .trim()
    .replace(/\s*\([^)]*\)\s*/g, ' ') // drop parenthetical notes
    .replace(/\s+/g, ' ')
    .trim()

type ProvinceTotals = Record<string, number>

export const useParseOriginProvinceData = (csvPath: string) => {
  const [totals, setTotals] = useState<ProvinceTotals>({})
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = (results.data as Record<string, string>[]).filter(Boolean)
        const t: ProvinceTotals = {}

        rows.forEach((row) => {
          const raw = (row.PROVINCE || row.REGION || '').toString()
          if (!raw) return
          const name = normalizeName(raw)
          if (name === 'NCR') return // GeoJSON splits NCR into districts, skip the pseudo-province

          let sum = 0
          for (const k of Object.keys(row)) {
            if (k === 'PROVINCE' || k === 'REGION') continue
            const v = parseInt(row[k] as string, 10)
            if (!Number.isNaN(v)) sum += v
          }
          t[name] = sum
        })

        const values = Object.values(t)
        setTotals(t)
        setMin(values.length ? Math.min(...values) : 0)
        setMax(values.length ? Math.max(...values) : 0)
        setLoading(false)
      }
    })
  }, [csvPath])

  return { totals, min, max, loading }
}