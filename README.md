# Filipino Emigrants Database CRUD Application

A modern, responsive web application for managing and visualizing Filipino emigrant data by marital status and year. Built with React, Firebase, and beautiful UI components.

![Filipino Emigrants App](https://img.shields.io/badge/React-19.0.0-blue) ![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-4.0.6-teal)

## ✨ Features

- **📊 Data Management**: Full CRUD operations (Create, Read, Update, Delete) for emigrant records
- **📈 Data Visualization**: Interactive bar charts showing emigrant statistics by category
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **📱 Mobile Friendly**: Fully responsive design that works on all devices
- **🔒 Secure**: Environment variables for API keys and configuration
- **⚡ Fast**: Built with Vite for lightning-fast development and builds

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Routing**: TanStack Router
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library

## 📋 Data Structure

The application manages emigrant data with the following fields:
- **Year**: The emigration year
- **Single**: Number of single emigrants
- **Married**: Number of married emigrants
- **Widower**: Number of widowed emigrants
- **Separated**: Number of separated emigrants
- **Divorced**: Number of divorced emigrants
- **Not Reported**: Number of emigrants with unreported marital status

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lab1/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Firebase configuration:
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

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔥 Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Set up Firestore security rules (for development):
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
4. Get your Firebase config from Project Settings
5. Update your `.env` file with the configuration values

## 📦 Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run serve`** - Preview production build
- **`npm run test`** - Run tests

## 📁 Project Structure

frontend/
├── public/ # Static assets
├── src/
│ ├── routes/ # TanStack Router pages
│ │ ├── root.tsx # Root layout
│ │ └── index.tsx # Main CRUD page
│ ├── services/ # API services
│ │ └── emigrantsService.ts
│ ├── firebase.ts # Firebase configuration
│ ├── main.tsx # Application entry point
│ └── styles.css # Global styles
├── .env.example # Environment variables template
├── .gitignore # Git ignore rules
├── package.json # Dependencies and scripts
└── README.md # Project documentation

## 🔧 Usage

### Adding Records
1. Fill in the year and emigrant counts by marital status
2. Click "Add Record" to save to the database

### Viewing Data
- **Table View**: See all records in a responsive table
- **Chart View**: Visualize total emigrants by category in an interactive bar chart

### Managing Records
- **Update**: Click "Update" to modify a record's year
- **Delete**: Click "Delete" to remove a record

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Set environment variables in Vercel dashboard

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of ITD112 coursework.

## 🆘 Support

If you encounter any issues:
1. Check that all environment variables are set correctly
2. Ensure Firebase project is properly configured
3. Verify internet connection for Firebase access
4. Check browser console for any error messages

## 🏗️ Future Enhancements

- [ ] User authentication
- [ ] Data export functionality
- [ ] Advanced filtering and search
- [ ] More chart types and visualizations
- [ ] Bulk data import
- [ ] Print/PDF export features

---

**Made with ❤️ for ITD112 Lab Assignment**