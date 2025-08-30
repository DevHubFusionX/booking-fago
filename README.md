# Fago's Booking - Modern Hotel Booking Website

A modern, responsive hotel booking website with HTML/CSS/JavaScript frontend and Node.js backend API.

## 🚀 Features

- **Modern UI/UX** - Clean, professional interface with glassmorphism effects
- **Responsive Design** - Mobile-first approach for all devices
- **Hotel Search & Filtering** - Advanced search with price, rating, and amenity filters
- **User Authentication** - Secure login/register with bcrypt password hashing
- **Component-Based Architecture** - Reusable frontend components

## 📁 Project Structure

```
├── backend/
│   └── server.js              # Node.js API server
├── frontend/
│   ├── components/            # Reusable components
│   │   ├── header.js         # Header component with auth
│   │   └── hotel-card.js     # Hotel card components
│   ├── pages/                # HTML pages
│   │   ├── index.html        # Homepage
│   │   ├── hotels.html       # Hotels listing
│   │   └── auth.html         # Login/Register
│   └── public/               # Static assets
│       ├── css/              # Stylesheets
│       ├── js/               # JavaScript files
│       └── img/              # Images
└── package.json              # Dependencies
```

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm run dev
   ```
   
   Or simply double-click `start.bat`

3. **Visit** `http://localhost:3000`

**Note:** Currently uses in-memory storage. Data will reset when server restarts.

## 🔧 API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/user` - Get current user
- `POST /api/logout` - User logout

## 🎨 Components

### Header Component (`header.js`)
- Dynamic navigation based on auth state
- Mobile menu functionality
- Search bar toggle

### Hotel Card Component (`hotel-card.js`)
- Reusable hotel display cards
- Star rating system
- Sample hotel data

## 🚀 Development

The project uses a clean separation between frontend and backend:

- **Frontend**: Pure HTML/CSS/JavaScript with component-based architecture
- **Backend**: Node.js/Express API server
- **Storage**: In-memory (can be upgraded to MySQL later)
- **Session Management**: Express sessions for authentication

## 📱 Features

- Modern search interface with date pickers
- Hotel filtering by price, rating, amenities
- Responsive design for mobile/desktop
- Secure user authentication
- Professional UI with smooth animations