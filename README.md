# 🎯 Task Management Dashboard - CRUD Application

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

A full-stack web application implementing complete CRUD (Create, Read, Update, Delete) operations for task management with PostgreSQL database integration.

## ✨ Features

### Complete CRUD Operations
- ✅ **CREATE** - Add new tasks and users
- ✅ **READ** - View all tasks with filtering options
- ✅ **UPDATE** - Edit task details and status
- ✅ **DELETE** - Remove tasks with confirmation

### Task Management
- Task properties: title, description, priority, status, due date, assignee
- Filter by status (todo, in-progress, completed, on-hold)
- Filter by priority (low, medium, high, urgent)
- Statistics dashboard with task counts
- Quick status updates

### AttendEase & Employee Features
- **Bulk Attendance Marking**: Mark multiple employees present/absent/late simultaneously.
- **Leave Management Workflow**: Request time off and track employee leaves (annual, sick, unpaid).
- **Profile Settings Update**: Users can dynamically update their full name and email address.
- **Custom Date Picker**: A consistent, beautiful `react-day-picker` component used across all forms.
- **Premium Auth UI**: Modern glassmorphism design with animated mesh gradients for login and signup pages.

### User Authentication
- User registration (signup)
- User login with session management
- Protected routes requiring authentication
- Cookie-based session handling
- Secure password hashing with bcrypt

### Modern UI/UX
- Responsive design (mobile and desktop)
- Clean, intuitive interface
- Real-time updates
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Dark mode for auth pages
- Light mode for dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable)
   ```bash
   cd task-management-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database**
   - Create PostgreSQL database named `taskflow`
   - Update `.env.local` with your credentials (already configured):
     ```env
     DATABASE_URL=postgresql://postgres:aech123@localhost:5432/taskflow
     NODE_ENV=development
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

4. **Initialize database**
   ```bash
   node init-database.js
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open application**
   - Navigate to http://localhost:3000
   - Create an account or use demo credentials

## 🎮 Usage

### Demo Credentials
- **Username:** demo
- **Password:** demo123

### Creating Tasks
1. Log in to your account
2. Click "New Task" button on dashboard
3. Fill in task details:
   - Title (required)
   - Description
   - Priority (low/medium/high/urgent)
   - Status (todo/in-progress/completed/on-hold)
   - Due date
   - Assignee name
4. Click "Save"

### Reading Tasks
- View all tasks on the dashboard
- Use filters to show specific tasks by status or priority
- Click on task cards to view full details

### Updating Tasks
- Click "Edit" button on any task
- Modify any field
- Click "Save" to update
- Or use quick status dropdown for status-only changes

### Deleting Tasks
- Click "Delete" button on any task
- Confirm deletion when prompted
- Task is removed from database

## 📊 Database Schema

### Users Table
```sql
id              SERIAL PRIMARY KEY
username        VARCHAR(255) UNIQUE NOT NULL
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
full_name       VARCHAR(255)
avatar_url      VARCHAR(255)
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Tasks Table
```sql
id              SERIAL PRIMARY KEY
user_id         INT DEFAULT 1
title           VARCHAR(255) NOT NULL
description     TEXT
priority        VARCHAR(50) DEFAULT 'medium'
status          VARCHAR(50) DEFAULT 'todo'
due_date        TIMESTAMP
assignee        VARCHAR(255)
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Sessions Table
```sql
id              SERIAL PRIMARY KEY
user_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
token           VARCHAR(255) UNIQUE NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
expires_at      TIMESTAMP NOT NULL
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup    - Create new user account
POST   /api/auth/login     - Login user (create session)
POST   /api/auth/logout    - Logout user (delete session)
GET    /api/auth/me        - Get current user information
```

### Tasks
```
GET    /api/tasks          - Get all tasks (supports ?status= and ?priority= filters)
POST   /api/tasks          - Create new task
GET    /api/tasks/[id]     - Get specific task by ID
PUT    /api/tasks/[id]     - Update specific task
DELETE /api/tasks/[id]     - Delete specific task
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - UI component library
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API
- **PostgreSQL** - Relational database
- **node-postgres (pg)** - PostgreSQL client
- **bcryptjs** - Password hashing
- **Cookie-based sessions** - Authentication

### Development
- **TypeScript 5.7** - Language
- **ESLint** - Linting
- **Turbopack** - Fast bundler
- **dotenv** - Environment variables

## 📁 Project Structure

```
task-management-dashboard/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   └── tasks/             # Task CRUD endpoints
│   ├── dashboard/             # Main dashboard page
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   └── page.tsx               # Home (redirects to dashboard)
├── components/
│   ├── Dashboard.tsx          # Main dashboard logic
│   ├── TaskForm.tsx           # Create/Edit task form
│   ├── TaskList.tsx           # Task list display
│   ├── TaskCard.tsx           # Individual task card
│   ├── TaskFilters.tsx        # Filter controls
│   ├── StatsOverview.tsx      # Statistics display
│   ├── ProtectedLayout.tsx    # Auth protection
│   ├── Sidebar.tsx            # Navigation
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── db.ts                  # Database connection
│   ├── db-init.ts             # Database initialization
│   ├── auth.ts                # Authentication logic
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
├── hooks/                     # Custom React hooks
├── .env.local                 # Environment variables
├── init-database.js           # Database setup script
└── package.json               # Dependencies and scripts
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint

# Database
node init-database.js   # Initialize/reset database tables
```

## 🧪 Testing

### Manual Testing
1. **Test CREATE:** Add new tasks through the UI
2. **Test READ:** View tasks, apply filters
3. **Test UPDATE:** Edit task details
4. **Test DELETE:** Remove tasks

### API Testing (Browser Console)
```javascript
// Create task
fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Task',
    priority: 'high',
    status: 'todo'
  })
}).then(r => r.json()).then(console.log);

// Read tasks
fetch('/api/tasks').then(r => r.json()).then(console.log);

// Update task (replace [ID] with actual ID)
fetch('/api/tasks/[ID]', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'completed' })
}).then(r => r.json()).then(console.log);

// Delete task (replace [ID] with actual ID)
fetch('/api/tasks/[ID]', {
  method: 'DELETE'
}).then(r => r.json()).then(console.log);
```

### Database Verification
```sql
-- Connect to database
\c taskflow

-- View all tasks
SELECT * FROM tasks ORDER BY created_at DESC;

-- View users
SELECT id, username, email, created_at FROM users;

-- View active sessions
SELECT * FROM sessions WHERE expires_at > CURRENT_TIMESTAMP;
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `.env.local`
- Ensure database `taskflow` exists
- Run `node init-database.js` to recreate tables

### Server Won't Start
- Check if port 3000 is available
- Run `npm install` to ensure dependencies
- Check for TypeScript errors
- Verify `.env.local` file exists

### Authentication Issues
- Clear browser cookies
- Check sessions table in database
- Verify password hashing is working
- Try creating a new account

## 📚 Documentation

Comprehensive documentation available:
- 📖 **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- 📋 **[Features Overview](FEATURES.md)** - Complete feature list
- 🔌 **[API Documentation](API_DOCUMENTATION.md)** - API reference
- 🧪 **[Testing Guide](TESTING.md)** - How to test everything
- 🏗️ **[Architecture](ARCHITECTURE.md)** - System design
- ✅ **[CRUD Verification](CRUD_VERIFICATION_CHECKLIST.md)** - Testing checklist
- 📝 **[File Structure](FILE_STRUCTURE_AND_CRUD_MAP.md)** - Detailed file map
- 🗺️ **[Roadmap](ROADMAP.md)** - Future plans
- ❓ **[FAQ](FAQ.md)** - Frequently asked questions
- 🚀 **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment

## 🔒 Security Features

- Password hashing with bcrypt
- HTTP-only cookies for session tokens
- SQL injection prevention with parameterized queries
- CSRF protection via SameSite cookies
- Input validation on frontend and backend
- Protected API routes requiring authentication

## 🎯 CRUD Requirements Compliance

This application fully implements the requirements for:
**"Basic Database Operations - Web-Based App CRUD (Create/Insert, Read/Select, Update, Delete)"**

✅ **CREATE (Insert)**
- User registration
- Task creation
- Session creation

✅ **READ (Select)**
- View all tasks
- View specific task
- Filter tasks by status/priority
- View user profile

✅ **UPDATE**
- Edit task properties
- Quick status updates
- Automatic timestamp updates

✅ **DELETE**
- Remove tasks
- Logout (delete session)
- Confirmation prompts

## 📈 Features Beyond Basic CRUD

- User authentication and authorization
- Session management
- Data filtering and search
- Statistics and analytics
- Responsive design
- Real-time UI updates
- Error handling and validation
- Modern UI with loading states

## 👨‍💻 Development

### Adding New Features
1. Define types in `lib/types.ts`
2. Create/update API routes in `app/api/`
3. Update database schema in `lib/db-init.ts`
4. Add UI components in `components/`
5. Update dashboard logic in `components/Dashboard.tsx`

### Database Migrations
Currently using simple initialization script. For production:
1. Use migration tools (e.g., Drizzle ORM, Prisma)
2. Version control schema changes
3. Implement rollback strategies

## 🚀 Deployment

### Prerequisites for Production
- PostgreSQL database (cloud or self-hosted)
- Node.js hosting (Vercel, Railway, etc.)
- Environment variables configured

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review documentation files
3. Verify database connection
4. Check server logs in terminal

## 📄 License

This project is for educational purposes demonstrating CRUD operations with a modern web stack.

## 🎉 Current Status

✅ Database: Connected and initialized
✅ Server: Running on http://localhost:3000
✅ CRUD Operations: Fully functional
✅ Authentication: Working
✅ UI: Responsive and modern
✅ Documentation: Complete

**The application is ready to use!**

---

**Built with ❤️ using Next.js, TypeScript, PostgreSQL, and Tailwind CSS**
