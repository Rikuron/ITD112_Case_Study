# Filipino Emigrants Database - Comprehensive Data Visualization Platform

A sophisticated, full-stack web application for managing, analyzing, and visualizing Filipino emigrant data across multiple demographic dimensions. Built with modern React technologies, Firebase, and advanced data visualization libraries.

![React](https://img.shields.io/badge/React-19.0.0-blue) ![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-4.0.6-teal) ![TanStack](https://img.shields.io/badge/TanStack_Router-1.130.2-purple)

## 🌐 Live Demo

**🔗 [View Live Application](https://itd-112-case-study.vercel.app)**

Experience the full application with interactive data visualizations, real-time charts, and comprehensive emigrant data management.

## ✨ Features

### 📊 **Comprehensive Data Management**
- **Multi-dimensional Data**: Age, Civil Status, Education, Occupation, Sex, Origin (Region/Province), Destination (Major/All Countries)
- **Full CRUD Operations**: Create, Read, Update, Delete for all data types
- **CSV Data Import**: Bulk upload functionality with data validation
- **Role-based Access Control**: Secure authentication with permission-based features

### 📈 **Advanced Data Visualization**
- **Interactive Charts**: Line charts, bar charts, stacked bar charts, scatter plots
- **Geographic Visualizations**: Choropleth maps for origin and destination analysis
- **Population Pyramids**: Sex distribution visualization
- **Tree Maps**: Hierarchical data representation using Nivo
- **Responsive Design**: Optimized for desktop and mobile viewing

### 🎨 **Modern User Experience**
- **Beautiful UI**: Clean, modern design with Tailwind CSS
- **Responsive Layout**: Works seamlessly on all device sizes
- **Loading States**: Smooth user feedback during data operations
- **Error Handling**: Comprehensive error management and user notifications

### 🔒 **Security & Authentication**
- **Firebase Authentication**: Secure user login and registration
- **Permission System**: Role-based access control for data management
- **Environment Variables**: Secure API key management

## 🛠️ Tech Stack

### **Frontend**
- **React 19** with TypeScript
- **TanStack Router** for client-side routing
- **TanStack DevTools** for development experience
- **Tailwind CSS 4.0** for styling
- **React Icons** for iconography

### **Data Visualization**
- **Recharts** for standard charts (line, bar, scatter)
- **Nivo** for advanced visualizations (treemap, choropleth maps)
- **Custom Tooltips** and interactive components

### **Backend & Database**
- **Firebase Firestore** for real-time database
- **Firebase Authentication** for user management
- **React Firebase Hooks** for seamless integration

### **Development Tools**
- **Vite** for fast development and building
- **TypeScript** for type safety
- **Vitest** for testing
- **Papa Parse** for CSV processing

## 📋 Data Categories

The application manages emigrant data across multiple dimensions:

### **Demographics**
- **Age Groups**: 14 age brackets from "14 - Below" to "70 - Above"
- **Sex**: Male/Female distribution
- **Civil Status**: Single, Married, Widower, Separated, Divorced, Not Reported
- **Education**: 8 levels from Elementary to Post Graduate

### **Geographic**
- **Origin**: 17 Philippine regions and provinces
- **Destination**: Major destinations (USA, Canada, Australia, etc.) and all countries

### **Socioeconomic**
- **Occupation**: 14 categories from Professional to No Occupation Reported

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore and Authentication enabled

### Installation

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

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔥 Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project

2. **Enable Services**
   - **Firestore Database**: Enable in test mode for development
   - **Authentication**: Enable Email/Password authentication

3. **Configure Security Rules** (for development):
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

4. **Get Configuration**
   - Go to Project Settings → General → Your apps
   - Copy the Firebase config values to your `.env` file

## 📦 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run serve`** - Preview production build locally
- **`npm run test`** - Run test suite

## 📁 Project Structure
frontend_/ <br />
├── public/ <br />
│   ├── data/                    # Static data files (Provinces.json worldCountries.json) <br />
│   └── fonts/                   # Custom fonts <br />
├── src/ <br />
│   ├── api/                     # API service layer <br />
│   │   ├── ageService.ts  <br />
│   │   ├── civilStatusService.ts   <br />
│   │   ├── destinationService.ts   <br />
│   │   └── ...   <br />
│   ├── components/  <br />
│   │   ├── charts/              # Chart components   <br />
│   │   │   ├── ageCharts.tsx <br />
│   │   │   ├── choroplethMap.tsx   <br />
│   │   │   └── ...  <br />
│   │   ├── header.tsx  <br />
│   │   ├── navBar.tsx  <br />
│   │   └── loadingScreen.tsx <br />
│   ├── context/                 # React contexts  <br />
│   │   ├── authContext.tsx   <br />
│   │   └── navBarContext.tsx <br />
│   ├── hooks/                   # Custom React hooks <br />
│   │   ├── useParseAgeData.ts   <br />
│   │   ├── useGeoJSON.ts  <br />
│   │   └── ...   <br />
│   ├── routes/                  # TanStack Router pages <br />
│   │   ├── __root.tsx  <br />
│   │   ├── index.tsx           # Main dashboard   <br />
│   │   ├── login.tsx   <br />
│   │   ├── register.tsx   <br />
│   │   ├── manageData.tsx      # Data management interface <br />
│   │   └── uploadData.tsx      # CSV upload interface   <br />
│   ├── utils/                   # Utility functions  <br />
│   │   ├── uploadAgeData.ts  <br />
│   │   ├── columnOrders.ts   <br />
│   │   └── ...   <br />
│   ├── firebase.ts             # Firebase configuration <br />
│   └── main.tsx                # Application entry point   <br />
├── .env                        # Environment variables (not in git) <br />
├── package.json  <br />
├── tsconfig.json <br />
└── vite.config.ts   <br />

## 🔧 Usage

**Dashboard View**
- Navigate through different data categories using the sidebar
- View interactive charts and visualizations
- Filter data by year and other parameters

### **Data Management**
1. **Login** with appropriate permissions
2. **Upload CSV files** for bulk data import
3. **Manage records** with inline editing capabilities
4. **Delete records** with confirmation prompts

### **Data Upload**
1. **Prepare CSV files** following the required format
2. **Upload files** through the dedicated upload interface
3. **Validate data** before importing to Firebase
4. **Monitor progress** with real-time feedback

## 🌐 Deployment

### **Deploy to Vercel (Recommended)**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend_
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all Firebase configuration variables
   - Redeploy to apply changes

### **Alternative Deployment Options**
- **Netlify**: Build and deploy the `dist` folder
- **Firebase Hosting**: Use Firebase CLI for deployment
- **GitHub Pages**: For static hosting

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env` files to version control
- **Firebase Rules**: Implement proper security rules for production
- **Authentication**: Use role-based access control for sensitive operations
- **Data Validation**: All uploaded data is validated before storage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of ITD112 coursework.

## 🆘 Support & Troubleshooting

### **Common Issues**
1. **Firebase Connection**: Verify environment variables are set correctly
2. **Authentication**: Ensure Firebase Auth is properly configured
3. **Build Errors**: Check TypeScript compilation and dependencies
4. **Chart Rendering**: Verify data format and GeoJSON files

### **Getting Help**
- Check browser console for error messages
- Verify Firebase project configuration
- Ensure all dependencies are installed correctly

---

**Made with ❤️ for ITD112 Lab Assignment - Comprehensive Filipino Emigrants Database Platform**
**hehe sir pol flat one pls**