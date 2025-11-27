// ML Prediction API Service
const API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5432'

export interface PredictionResult {
  year: number
  predictions: Record<string, number>
}

export interface CategoryPredictions {
  category: string
  predictions: PredictionResult[]
}

export interface AllPredictionsResponse {
  predictions: Record<string, PredictionResult[]>
  errors?: Record<string, string>
}

// Predict for a single category
export const predictCategory = async (
  category: string,
  yearsAhead: number
): Promise<CategoryPredictions> => {
  const response = await fetch(`${API_BASE_URL}/api/predict/${category}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ years_ahead: yearsAhead }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || `Failed to predict ${category}`)
  }

  return response.json()
}

// Predict all categories at once
export const predictAllCategories = async (
  yearsAhead: number
): Promise<AllPredictionsResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/predict-all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ years_ahead: yearsAhead }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to predict all categories')
  }

  return response.json()
}

// Ger model info for all categories
export const getAllModelsInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/api/model-info-all`)

  if (!response.ok) {
    throw new Error('Failed to fetch model information')
  }

  return response.json()
}

// Health Check
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    return response.ok
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
}