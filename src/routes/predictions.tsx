import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { predictAllCategories, checkAPIHealth } from '../api/predictionService'
import type { AllPredictionsResponse } from "../api/predictionService"
import { getAllAgeData } from "../api/ageService"
import { getAllCivilStatusData } from "../api/civilStatusService"
import { getAllMajorDestinationData } from "../api/destinationService"
import { getAllEducationData } from "../api/educationService"
import { getAllOccupationData } from "../api/occupationService"
import { getAllSexData } from "../api/sexService"
import { getAllRegionData } from "../api/originService"
import PredictionCharts from "../components/charts/predictionCharts"
import LoadingScreen from "../components/loadingScreen"
import { useIsMobile } from "../hooks/useIsMobile"

export const Route = createFileRoute('/predictions')({
    component: PredictionsPage
})

type CategoryKey = 'age' | 'civil_status' | 'destination' | 'education' | 'occupation' | 'sex' | 'origin'

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  age: 'Age Groups',
  civil_status: 'Civil Status',
  destination: 'Major Destination',
  education: 'Education',
  occupation: 'Occupation',
  sex: 'Sex',
  origin: 'Region of Origin'
}

// Map category keys to their data fetchers
const dataFetchers: Record<CategoryKey, () => Promise<any[]>> = {
  age: getAllAgeData,
  civil_status: getAllCivilStatusData,
  destination: getAllMajorDestinationData,
  education: getAllEducationData,
  occupation: getAllOccupationData,
  sex: getAllSexData,
  origin: getAllRegionData
}

function PredictionsPage() {
  const [yearsAhead, setYearsAhead] = useState<number>(5)
  const [loading, setLoading] = useState(false)
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(false)
  const [predictions, setPredictions] = useState<AllPredictionsResponse | null>(null)
  const [historicalData, setHistoricalData] = useState<Record<CategoryKey, any[]>>({} as Record<CategoryKey, any[]>)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('age')
  const isMobile = useIsMobile()

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await checkAPIHealth()
      setApiHealthy(healthy)
    }
    checkHealth()
  }, [])

  // Fetch historical data for selected category
  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!historicalData[selectedCategory]) {
        try {
          const data = await dataFetchers[selectedCategory]()
          setHistoricalData(prev => ({ ...prev, [selectedCategory]: data }))
        } catch (err) {
          console.error(`Failed to fetch historical data for ${selectedCategory}:`, err)
        }
      }
    }
    fetchHistoricalData()
  }, [selectedCategory])

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    setPredictions(null)

    try {
      // Fetch all historical data in parallel
      const categories = Object.keys(dataFetchers) as CategoryKey[]
      const historicalPromises = categories.map(async (cat) => {
        if (!historicalData[cat]) {
          const data = await dataFetchers[cat]()
          return { category: cat, data}
        }
        return { category: cat, data: historicalData[cat] }
      })

      const historicalResults = await Promise.all(historicalPromises)
      const newHistoricalData = { ...historicalData }
      historicalResults.forEach(({ category, data }) => {
        newHistoricalData[category] = data
      })
      setHistoricalData(newHistoricalData)

      // Get predictions from ML API
      const predictionsResponse = await predictAllCategories(yearsAhead)
      setPredictions(predictionsResponse)
    } catch (err) {
      console.error('Prediction error: ', err)
      setError(err instanceof Error ? err.message : 'Failed to generate predictions')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-primary min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* API Status Banner */}
        {apiHealthy === false && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-4 mb-6">
            <p className="font-bold">⚠️ ML API Unavailable</p>
            <p className="text-sm">Make sure the Flask backend is running on port 5432</p>
          </div>
        )}

        {/* Controls Card */}
        <div className="bg-secondary rounded-lg shadow-md p-6 border-2 border-highlights mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Year Selector - Enhanced */}
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <label htmlFor="years-ahead" className="text-white font-inter font-medium text-center md:text-left">
                Predict for the next:
              </label>
              
              <div className="flex flex-col gap-2">
                {/* Slider with visual markers */}
                <div className="relative px-2">
                  <input
                    id="years-ahead"
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={yearsAhead}
                    onChange={(e) => setYearsAhead(Number(e.target.value))}
                    className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer 
                               [&::-webkit-slider-thumb]:appearance-none
                               [&::-webkit-slider-thumb]:w-5
                               [&::-webkit-slider-thumb]:h-5
                               [&::-webkit-slider-thumb]:rounded-full
                               [&::-webkit-slider-thumb]:bg-highlights
                               [&::-webkit-slider-thumb]:cursor-pointer
                               [&::-webkit-slider-thumb]:shadow-lg
                               [&::-webkit-slider-thumb]:shadow-highlights/50
                               [&::-webkit-slider-thumb]:transition-transform
                               [&::-webkit-slider-thumb]:hover:scale-110
                               [&::-moz-range-thumb]:w-5
                               [&::-moz-range-thumb]:h-5
                               [&::-moz-range-thumb]:rounded-full
                               [&::-moz-range-thumb]:bg-highlights
                               [&::-moz-range-thumb]:border-0
                               [&::-moz-range-thumb]:cursor-pointer"
                  />
                  
                  {/* Tick marks */}
                  <div className="flex justify-between px-0.5 mt-1">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setYearsAhead(num)}
                        className={`
                          w-6 h-6 text-xs rounded-full transition-all duration-200
                          ${yearsAhead === num 
                            ? 'bg-highlights text-white font-bold scale-110' 
                            : 'bg-primary/50 text-gray-400 hover:bg-highlights/30 hover:text-white'
                          }
                        `}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current selection display */}
                <div className="text-center">
                  <span className="text-highlights font-bold font-inter text-2xl">
                    {yearsAhead}
                  </span>
                  <span className="text-gray-400 font-inter ml-2">
                    {yearsAhead === 1 ? 'year' : 'years'} into the future
                  </span>
                </div>
              </div>
            </div>

            {/* Predict Button */}
            <button
              onClick={handlePredict}
              disabled={loading || apiHealthy === false}
              className={`
                px-8 py-3 rounded-lg font-inter font-bold text-white transition-all duration-300
                ${loading || apiHealthy === false
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-highlights hover:cursor-pointer hover:bg-highlights/80 hover:scale-105 hover:shadow-lg hover:shadow-highlights/30'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating Predictions...
                </span>
              ) : (
                '🔮 Generate Predictions'
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingScreen />}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-lg p-4 mb-6">
            <p className="font-bold">⚠️ Prediction Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Predictions Results */}
        {predictions && !loading && (
          <>
            {/* Category Tabs */}
            <div className="mb-6">
              {isMobile ? (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as CategoryKey)}
                  className="w-full px-4 py-3 rounded-lg border border-highlights/20 bg-secondary text-gray-300 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-highlights"
                >
                  {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key) => (
                    <option key={key} value={key}>
                      {CATEGORY_LABELS[key]}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex flex-row w-full items-start rounded-lg bg-secondary border border-highlights/20 p-1 gap-1">
                  {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 text-center
                        ${selectedCategory === key
                          ? 'bg-highlights text-white shadow-sm'
                          : 'text-gray-300 hover:text-white hover:bg-highlights/50 hover:cursor-pointer'
                        }
                      `}
                    >
                      {CATEGORY_LABELS[key]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Charts */}
            <PredictionCharts
              category={selectedCategory}
              categoryLabel={CATEGORY_LABELS[selectedCategory]}
              historicalData={historicalData[selectedCategory] || []}
              predictions={predictions.predictions[selectedCategory] || []}
            />

            {/* Prediction Errors Warning */}
            {predictions.errors && Object.keys(predictions.errors).length > 0 && (
              <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 rounded-lg p-4 mt-6">
                <p className="font-bold mb-2">⚠️ Some predictions failed:</p>
                <ul className="list-disc list-inside text-sm">
                  {Object.entries(predictions.errors).map(([cat, err]) => (
                    <li key={cat}><strong>{CATEGORY_LABELS[cat as CategoryKey]}:</strong> {err}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!predictions && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl text-gray-400 font-inter mb-2">No predictions yet</h3>
            <p className="text-gray-500 font-inter">
              Select how many years to predict and click "Generate Predictions"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}