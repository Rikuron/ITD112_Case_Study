# Filipino Emigrants Database - Data Visualization Platform

A sophisticated, full-stack web application for managing, analyzing, and visualizing Filipino emigrant data across multiple demographic dimensions. Built with React 19, TypeScript, Firebase, TensorFlow LSTM models, and advanced data visualization libraries.

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript&logoColor=white) ![Firebase](https://img.shields.io/badge/Firebase-12.3.0-FFCA28?logo=firebase&logoColor=black) ![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20.0-FF6F00?logo=tensorflow&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.6-38B2AC?logo=tailwind-css&logoColor=white)

## 🌐 Live Demo

**🔗 [View Live Application](https://itd-112-case-study.vercel.app)**

Experience the full application with interactive data visualizations, real-time charts, machine learning predictions, and comprehensive emigrant data management.

---

## ✨ Key Features

### 📊 **Comprehensive Data Management**

- **Multi-dimensional Data**: Age, Civil Status, Education, Occupation, Sex, Origin (Region/Province), Destination (Major/All Countries)
- **Full CRUD Operations**: Create, Read, Update, Delete for all data types
- **CSV Bulk Import**: Upload and validate CSV files for efficient data entry
- **Real-time Updates**: Firebase Firestore integration for instant data synchronization

### 📈 **Advanced Data Visualization**

- **Interactive Charts**: Line charts, bar charts, stacked bar charts, scatter plots using Recharts
- **Geographic Visualizations**: Choropleth maps for origin and destination analysis using Nivo
- **Population Pyramids**: Sex distribution visualization with custom styling
- **Tree Maps**: Hierarchical data representation for complex datasets
- **Responsive Design**: Optimized for both desktop and mobile viewing

### 🤖 **Machine Learning Predictions**

- **LSTM Neural Networks**: Time-series forecasting using Long Short-Term Memory models
- **Multi-category Predictions**: Predict future trends for all demographic categories
- **Flask API Backend**: RESTful API for model training and predictions
- **TensorFlow Integration**: Powered by TensorFlow 2.20 for robust ML capabilities
- **Automated Training**: Train models on historical data with hyperparameter tuning
- **Future Forecasting**: Predict emigration trends 1-10 years ahead

### 🎨 **Modern User Experience**

- **Beautiful UI**: Clean, modern design with Tailwind CSS 4.0
- **Responsive Layout**: Seamless experience across all device sizes
- **Loading States**: Smooth user feedback during data operations
- **Empty States**: Helpful messages when no data is available
- **Error Handling**: Comprehensive error management with user-friendly notifications

### 🔒 **Security & Authentication**

- **Firebase Authentication**: Secure user login and registration
- **Role-based Access Control**: Permission system for data management features
- **Protected Routes**: Authenticated access to sensitive operations
- **Environment Variables**: Secure API key management

---

## 🛠️ Tech Stack

### Frontend Framework

- **React 19.0.0** - Latest React with improved performance
- **TypeScript 5.7.2** - Type-safe development
- **Vite 6.3.5** - Lightning-fast build tool and dev server
- **TanStack Router 1.130.2** - Type-safe routing with file-based routing

### Styling & UI

- **Tailwind CSS 4.0.6** - Utility-first CSS framework
- **React Icons 5.5.0** - Comprehensive icon library
- **Custom CSS** - Additional styling for unique components

### Data Visualization

- **Recharts 3.2.1** - Composable charting library for React
- **Nivo 0.99.0** - Rich data visualization components
  - `@nivo/bar` - Bar charts
  - `@nivo/geo` - Geographic maps
  - `@nivo/treemap` - Hierarchical treemaps
  - `@nivo/core` - Core utilities

### Backend & Database

- **Firebase 12.3.0** - Backend-as-a-Service platform
  - Firestore - NoSQL cloud database
  - Authentication - User management
- **React Firebase Hooks 5.1.1** - React hooks for Firebase

### Machine Learning Backend

- **Flask 3.1.2** - RESTful API server
- **TensorFlow 2.20.0** - Deep learning framework
- **LSTM Models** - Time-series prediction
- **NumPy 2.3.4** - Numerical computing
- **Pandas 2.3.3** - Data manipulation
- **Scikit-learn 1.7.2** - Data preprocessing and metrics
- **Firebase Admin 6.5.0** - Backend Firebase integration

### Data Processing

- **Papa Parse 5.5.3** - Powerful CSV parser for JavaScript

### Development Tools

- **Vitest 3.0.5** - Fast unit testing framework
- **@testing-library/react 16.2.0** - React component testing
- **TanStack DevTools** - Router and React Query debugging

---

## 📋 Data Categories

The application manages emigrant data across multiple dimensions:

| Category               | Details                                                                                                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Age Groups**   | 14 age brackets: "14 - Below", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70 - Above", "Not Reported" |
| **Sex**          | Male, Female                                                                                                                                                   |
| **Civil Status** | Single, Married, Widower, Separated, Divorced, Not Reported                                                                                                    |
| **Education**    | Elementary Level, Elementary Graduate, High School Level, High School Graduate, College Level, College Graduate, Post Graduate, Not Reported                   |
| **Origin**       | 17 Philippine regions and provinces with choropleth map visualization                                                                                          |
| **Destination**  | Major destinations (USA, Canada, Australia, Japan, etc.) and comprehensive country list with world map visualization                                           |
| **Occupation**   | 14 categories: Professional, Technical, Clerical, Sales, Service, Agricultural, Production, Managers, Housewife, Student, No Occupation, Not Reported, etc.    |

---

## 🤖 Machine Learning Predictions

The application features an advanced **LSTM (Long Short-Term Memory)** neural network backend for predicting future emigration trends.

### Architecture

```
Frontend (React) ←→ Flask API ←→ TensorFlow LSTM Models ←→ Firebase Firestore
```

### ML Features

- **Time-Series Forecasting**: Predict emigration trends for 1-10 years ahead
- **Multi-dimensional Predictions**: Separate models for each data category:
  - Age Groups
  - Sex Distribution
  - Civil Status
  - Education Levels
  - Occupation Categories
  - Origin Regions
  - Destination Countries

### API Endpoints

The Flask backend (`http://localhost:5432` or deployed URL) provides:

| Endpoint                       | Method | Description                           |
| ------------------------------ | ------ | ------------------------------------- |
| `/api/health`                | GET    | Health check for API status           |
| `/api/predict/<category>`    | POST   | Get predictions for specific category |
| `/api/predict-all`           | POST   | Get predictions for all categories    |
| `/api/train/<category>`      | POST   | Train model for specific category     |
| `/api/model-info/<category>` | GET    | Get model metadata and performance    |
| `/api/model-info-all`        | GET    | Get all models information            |

### Prediction Request Example

```javascript
// Predict age distribution for next 5 years
fetch('http://localhost:5432/api/predict/age', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ years_ahead: 5 })
})
.then(res => res.json())
.then(data => console.log(data.predictions));
```

### Model Architecture

- **Input Layer**: Historical time-series data (normalized)
- **LSTM Layers**: 2 stacked LSTM layers with dropout for regularization
- **Dense Layer**: Fully connected output layer
- **Optimizer**: Adam optimizer with learning rate scheduling
- **Loss Function**: Mean Squared Error (MSE)
- **Metrics**: Mean Absolute Error (MAE)

### Training Process

1. **Data Collection**: Fetch historical data from Firebase Firestore
2. **Preprocessing**: Normalize data and create time-series sequences
3. **Model Training**: Train LSTM model with early stopping
4. **Validation**: Evaluate model performance on validation set
5. **Model Saving**: Save trained model and metadata
6. **Prediction**: Use trained model for future forecasting

### Backend Setup

The ML backend is located in the `backend/` directory:

```
backend/
├── ml/
│   ├── config.py              # Configuration and constants
│   ├── data_preprocessor.py   # Data preprocessing utilities
│   ├── lstm_model.py          # LSTM model architecture
│   ├── predictor.py           # Prediction logic
│   └── trainer.py             # Model training logic
├── models/                    # Saved trained models
├── app.py                     # Flask API server
├── train_all_models.py        # Script to train all models
├── hyperparameter_tuning.py   # Hyperparameter optimization
└── requirements.txt           # Python dependencies
```

### Running the ML Backend

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```
2. **Create virtual environment**

   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```
4. **Set up environment variables**

   Create a `.env` file:

   ```env
   FIREBASE_CREDENTIALS_PATH=path/to/firebase-credentials.json
   # OR
   FIREBASE_CREDENTIALS_JSON={"type":"service_account",...}
   ```
5. **Train models** (optional, if models don't exist)

   ```bash
   python train_all_models.py
   ```
6. **Start Flask server**

   ```bash
   python app.py
   ```

   The API will be available at `http://localhost:5432`

### Integration with Frontend

The frontend integrates with the ML backend through:

1. **Prediction Service** (`src/api/predictionService.ts`)
2. **Prediction Charts** (`src/components/charts/predictionCharts.tsx`)
3. **Prediction Hooks** (custom React hooks for data fetching)

Users can view predictions directly in the dashboard by selecting the "Predictions" tab.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **Firebase Project** with Firestore and Authentication enabled
- **Python 3.8+** (for ML backend)

### Frontend Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd lab1/frontend_
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```
4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Add project" and follow the setup wizard
- Choose a project name (e.g., "filipino-emigrants-db")

### 2. Enable Required Services

#### Firestore Database

1. Navigate to **Firestore Database** in the left sidebar
2. Click "Create database"
3. Start in **test mode** for development
4. Choose a location closest to your users

#### Authentication

1. Navigate to **Authentication** in the left sidebar
2. Click "Get started"
3. Enable **Email/Password** sign-in method

### 3. Configure Security Rules

For **development** (Firestore):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}
```

For **production** (recommended):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Get Configuration

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app and copy the config values
5. Add these values to your `.env` file

---

## 📦 Available Scripts

| Command           | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| `npm run dev`   | Start development server with hot reload on `localhost:3000` |
| `npm run start` | Alternative command to start dev server                        |
| `npm run build` | Build for production (outputs to `dist/`)                    |
| `npm run serve` | Preview production build locally                               |
| `npm run test`  | Run test suite with Vitest                                     |

---

## 📁 Project Structure

```
lab1/
├── frontend_/                   # React frontend application
│   ├── public/
│   │   ├── data/                # Static data files
│   │   │   ├── Provinces.json   # Philippine provinces GeoJSON
│   │   │   └── worldCountries.json  # World countries GeoJSON
│   │   └── fonts/               # Custom fonts
│   ├── src/
│   │   ├── api/                 # API service layer
│   │   │   ├── baseService.ts
│   │   │   ├── ageService.ts
│   │   │   ├── predictionService.ts
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── charts/          # Chart components
│   │   │   │   ├── predictionCharts.tsx
│   │   │   │   └── ...
│   │   │   └── ...
│   │   ├── context/             # React contexts
│   │   ├── hooks/               # Custom React hooks
│   │   ├── routes/              # TanStack Router pages
│   │   ├── utils/               # Utility functions
│   │   ├── firebase.ts
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Flask ML API backend
│   ├── ml/                      # Machine learning modules
│   │   ├── config.py
│   │   ├── data_preprocessor.py
│   │   ├── lstm_model.py
│   │   ├── predictor.py
│   │   └── trainer.py
│   ├── models/                  # Trained LSTM models
│   ├── app.py                   # Flask API server
│   ├── train_all_models.py      # Training script
│   ├── hyperparameter_tuning.py # Hyperparameter optimization
│   └── requirements.txt         # Python dependencies
│
└── README.md
```

---

## 🎯 Usage Guide

### Dashboard View

1. **Navigate** through different data categories using the sidebar
2. **View** interactive charts and visualizations
3. **Filter** data by year using the year selector
4. **Switch** between chart types (line, bar, scatter, map)
5. **Hover** over chart elements for detailed tooltips

### Data Management

1. **Login** with your credentials
2. Navigate to **Manage Data** page
3. **Select** a data category (Age, Sex, Education, etc.)
4. **Edit** records inline by clicking on cells
5. **Delete** records with confirmation prompts
6. **Add** new records using the form

### CSV Data Upload

1. **Login** with appropriate permissions
2. Navigate to **Upload Data** page
3. **Select** the data category
4. **Prepare** CSV file following the required format
5. **Upload** the file using the upload card
6. **Review** validation messages
7. **Confirm** import to Firebase

### Machine Learning Predictions

1. Navigate to the **Dashboard**
2. Select a data category
3. Click on the **Predictions** tab
4. View predicted trends for future years
5. Compare predictions with historical data

---

## 🌐 Deployment

### Deploy Frontend to Vercel (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```
2. **Login to Vercel**

   ```bash
   vercel login
   ```
3. **Deploy**

   ```bash
   cd frontend_
   vercel
   ```
4. **Configure Environment Variables**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project → Settings → Environment Variables
   - Add all Firebase configuration variables
   - Redeploy to apply changes
5. **Production Deployment**

   ```bash
   vercel --prod
   ```

### Deploy ML Backend to Render

1. **Create a new Web Service** on [Render](https://render.com)
2. **Configure the service**

   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - Environment: Python 3
3. **Add environment variables**

   - `FIREBASE_CREDENTIALS_JSON` - Your Firebase service account JSON (as string)
4. **Deploy** and note the URL (e.g., `https://your-app.onrender.com`)
5. **Update frontend** to use the deployed backend URL in `src/api/predictionService.ts`

---

## 🔒 Security Considerations

### Development

- ✅ Use test mode for Firestore during development
- ✅ Keep `.env` file in `.gitignore`
- ✅ Use environment variables for all sensitive data

### Production

- ⚠️ **Never commit** `.env` files to version control
- ⚠️ Implement **proper Firestore security rules**
- ⚠️ Enable **Firebase App Check** for additional security
- ⚠️ Use **role-based access control** for sensitive operations
- ⚠️ Validate all user inputs on both client and server
- ⚠️ Enable **CORS** only for trusted domains

---

## 🆘 Troubleshooting

### Common Issues

#### Firebase Connection Errors

**Problem:** "Firebase: Error (auth/invalid-api-key)"**Solution:**

- Verify all environment variables are set correctly in `.env`
- Ensure variable names start with `VITE_`
- Restart dev server after changing `.env`

#### ML Backend Connection

**Problem:** Predictions not loading**Solution:**

- Ensure Flask backend is running on `http://localhost:5432`
- Check CORS configuration in `backend/app.py`
- Verify models are trained and exist in `backend/models/`

#### Chart Rendering Issues

**Problem:** Charts not displaying or showing errors**Solution:**

- Verify data format matches expected structure
- Check GeoJSON files are in `public/data/`
- Ensure data contains valid numeric values
- Check browser console for specific errors

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

---

## 📄 License

This project is created for educational purposes as part of **ITD112 coursework**.

---

## 🙏 Acknowledgments

- **Firebase** for backend infrastructure
- **Recharts** and **Nivo** for data visualization
- **TanStack Router** for routing solution
- **Tailwind CSS** for styling framework
- **Vite** for blazing-fast development experience
- **TensorFlow** for machine learning capabilities
- **Flask** for RESTful API backend

---

**📊 Made with ❤️ for ITD112 Lab Assignment - Filipino Emigrants Database Platform**
**hehe sir pol flat one pls**
