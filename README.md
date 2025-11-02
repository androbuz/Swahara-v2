# Swahara - Agreement Management System (MVC Architecture)

A professional agreement management application built with Express.js, EJS, and SQLite following the MVC architectural pattern.

## 🏗️ Architecture Overview

This application follows the **Model-View-Controller (MVC)** design pattern with SQLite database:

```
swahara-mvc/
├── config/                 # Configuration files
│   ├── app.js             # Application configuration
│   ├── session.js         # Session configuration
│   └── database.js        # SQLite database configuration
├── controllers/            # Controllers (Business logic)
│   ├── authController.js  # Authentication logic
│   ├── agreementController.js # Agreement CRUD operations
│   └── userController.js  # User profile logic
├── models/                # Models (Data structures & DB queries)
│   ├── User.js           # User model with SQLite queries
│   └── Agreement.js      # Agreement model with SQLite queries
├── routes/                # Routes (URL mappings)
│   ├── index.js          # Main router
│   ├── authRoutes.js     # Authentication routes
│   ├── agreementRoutes.js # Agreement routes
│   └── userRoutes.js     # User routes
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   └── session.js        # Session initialization
├── views/                 # Views (EJS templates)
│   ├── web-layout.ejs    # Main layout with sidebar
│   ├── login.ejs         # Login page
│   ├── dashboard.ejs     # Dashboard with charts
│   ├── agreement-details.ejs # Single agreement view
│   ├── create-agreement.ejs  # Create agreement form
│   ├── profile.ejs       # User profile
│   ├── error.ejs         # Error page
│   └── 404.ejs           # 404 page
├── data/                  # SQLite database directory
│   └── swahara.db        # SQLite database (auto-created)
├── public/                # Static assets
├── app.js                 # Express app setup
├── server.js              # Server entry point
└── package.json           # Dependencies

```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

The SQLite database will be automatically created in the `/data` folder on first run with sample data.

## ✨ Key Features

### 📊 Dashboard with Visualizations
- **Stats Cards**: Active, Pending, Cancelled agreements, and Total Earned
- **Pie Chart**: Agreement status distribution (Active, Pending, Cancelled)
- **Bar Chart**: Monthly earnings over the last 6 months

### 📝 Agreement Management
- Create new agreements with party name and phone number
- View agreement details
- Accept or reject pending agreements
- Track agreement status (Active, Pending, Cancelled)

### 💾 SQLite Database
- Persistent data storage
- Automatic database initialization with sample data
- Efficient querying with parameterized statements

### 🎨 Professional UI
- Gradient backgrounds and modern design
- Card-based layouts
- Responsive web design
- Chart.js visualizations

## 📋 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  avatar TEXT,
  initials TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Agreements Table
```sql
CREATE TABLE agreements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  other_party_name TEXT NOT NULL,
  other_party_phone TEXT NOT NULL,
  created_by_id INTEGER NOT NULL,
  created_date DATE DEFAULT (date('now')),
  status TEXT DEFAULT 'active',
  amount TEXT,
  due_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_id) REFERENCES users(id)
)
```

## 🛣️ Routes

### Public Routes
- `GET /` - Redirects to login
- `GET /login` - Login page
- `POST /login` - Login action

### Protected Routes (Require Authentication)
- `GET /dashboard` - Main dashboard with stats and charts
- `GET /agreements/:agreementId` - View single agreement
- `GET /agreements/party/:partyName` - View all agreements with a party
- `POST /agreements/:agreementId/accept` - Accept agreement
- `POST /agreements/:agreementId/reject` - Reject/cancel agreement
- `GET /create-agreement` - Create agreement form
- `POST /create-agreement` - Create agreement action
- `GET /profile` - User profile
- `GET /logout` - Logout

## 📦 Technologies

- **Express.js** - Web framework
- **EJS** - Template engine
- **SQLite3** - Database
- **express-session** - Session management
- **Chart.js** - Data visualizations
- **Tailwind CSS** - Styling (via CDN)
- **Node.js** - Runtime environment

## 🎨 Design Patterns

1. **MVC Pattern**: Separation of data, presentation, and logic
2. **Middleware Pattern**: Request processing pipeline
3. **Router Pattern**: Modular route handling
4. **Singleton Pattern**: Single instances of controllers and database connection
5. **Repository Pattern**: Database access abstraction in models

## 🔒 Security Features

- Session-based authentication
- Protected routes with authentication middleware
- SQL injection prevention with parameterized queries
- Password field validation

## 📝 Notes

- Database file is created automatically in `/data/swahara.db`
- Sample data is seeded on first run
- Charts use Chart.js for visualizations
- Currency amounts are stored as text for simplicity
- Images are loaded from Unsplash CDN

## 🚀 Future Enhancements

- User registration and password hashing
- Email notifications
- File uploads (PDFs, documents)
- Agreement templates
- Advanced search and filtering
- Export to PDF
- RESTful API endpoints
- Multi-user support with proper authentication
- Unit and integration tests
- Agreement history and audit trail

## 📄 License

MIT License

---

**Developed for Uganda** 🇺🇬

Using Ugandan names, phone number format (+256), currency (UGX), and local business contexts.
