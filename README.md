# HNReader — MERN Stack HackerNews Scraper

A full-stack MERN application that scrapes the top 10 stories from [Hacker News](https://news.ycombinator.com), serves them through a REST API with JWT authentication, and displays them in a modern, theme-aware React frontend with bookmarking and pagination.

---

## 2. Project Overview

**HNReader** was built as a MERN stack assignment to demonstrate:

- **Web scraping** using Axios + Cheerio to extract live data from HackerNews
- **REST API design** following MVC architecture with Express.js
- **JWT-based authentication** with bcrypt password hashing
- **React frontend** using Context API for global state (auth + theme)
- **MongoDB** for persistent story and user storage with duplicate prevention

### Assignment Requirements Fulfilled

| Requirement | Status |
|---|---|
| Web scraper (Cheerio + Axios) | ✅ |
| Auto-scrape on server start | ✅ |
| Manual scrape via POST /api/scrape | ✅ |
| JWT Authentication (register + login) | ✅ |
| Bookmark toggle (protected route) | ✅ |
| Pagination (page + limit query params) | ✅ |
| React Context API (auth + theme) | ✅ |
| Protected frontend routes | ✅ |
| Dark / Light mode (CSS token system) | ✅ |
| Skeleton loading + Toast notifications | ✅ |

---

## 3. Features

- 🔍 **Live Scraper** — Fetches top 10 HN stories on startup and via API
- 🔐 **JWT Auth** — Register / Login with token-based sessions
- 🔖 **Bookmarks** — Toggle bookmarks per user, persisted in MongoDB
- 📄 **Pagination** — Backend-driven page/limit query params with UI controls
- 🛡️ **Protected Routes** — Bookmarks page requires login (frontend + backend)
- 🌗 **Dark / Light Mode** — Instant, persistent theme switching via CSS tokens
- 💀 **Skeleton Loading** — Animated placeholder cards during data fetch
- 🔔 **Toast Notifications** — Feedback on login, logout, bookmark, scrape
- 🧩 **Reusable Components** — Button, Input, StoryCard, Pagination, SkeletonList

---

## 4. Tech Stack

### Backend
| Package | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | HTTP framework |
| MongoDB + Mongoose | Database + ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT creation & verification |
| Cheerio | HTML parsing (scraper) |
| Axios | HTTP client (scraper) |
| dotenv | Environment variable loading |
| cors | Cross-origin request handling |
| nodemon | Dev server auto-restart |

### Frontend
| Package | Purpose |
|---|---|
| React 19 (Vite) | UI framework |
| Tailwind CSS v4 | Utility CSS (via @tailwindcss/vite) |
| React Router DOM | Client-side routing |
| Axios | API communication |
| Context API | Global auth + theme state |
| react-hot-toast | Toast notifications |

---

## 5. Complete Folder Structure

```
Assignment/
├── client/                         # React frontend (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── apiService.js       # Centralised Axios instance + all endpoint functions
│   │   ├── components/
│   │   │   ├── Button.jsx          # Reusable button with loading spinner
│   │   │   ├── Input.jsx           # Reusable labeled input with error support
│   │   │   ├── Navbar.jsx          # Sticky navbar with auth state + theme toggle
│   │   │   ├── Pagination.jsx      # Page navigation with ellipsis logic
│   │   │   ├── SkeletonList.jsx    # Animated skeleton placeholder cards
│   │   │   └── StoryCard.jsx       # Story display card with bookmark toggle
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global auth state (user, login, logout, register)
│   │   │   └── ThemeContext.jsx    # Global dark/light theme state
│   │   ├── hooks/
│   │   │   └── useStories.js       # Custom hook for paginated story fetching
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx      # Shared layout wrapping Navbar + Outlet
│   │   ├── pages/
│   │   │   ├── BookmarksPage.jsx   # Protected page: user's bookmarked stories
│   │   │   ├── HomePage.jsx        # Main feed with stories + re-scrape button
│   │   │   ├── LoginPage.jsx       # Login form page
│   │   │   └── RegisterPage.jsx    # Registration form page
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx  # HOC: redirects unauthenticated users to /login
│   │   ├── utils/
│   │   │   └── formatters.js       # Relative time + domain formatting helpers
│   │   ├── App.jsx                 # Root: providers + BrowserRouter + routes
│   │   ├── index.css               # Design system (CSS tokens, dark/light themes)
│   │   └── main.jsx                # React DOM entry point
│   ├── .env.example
│   └── package.json
│
└── server/                         # Express backend
    ├── src/
    │   ├── config/
    │   │   └── db.js               # MongoDB connection via Mongoose
    │   ├── controllers/
    │   │   ├── authController.js   # Register + Login business logic
    │   │   └── storyController.js  # Stories CRUD + bookmark toggle + scrape trigger
    │   ├── middleware/
    │   │   └── authMiddleware.js   # JWT verification → attaches req.user
    │   ├── models/
    │   │   ├── User.js             # User schema: name, email, password, bookmarks[]
    │   │   └── Story.js            # Story schema: title, url, points, author, postedAt, hnId
    │   ├── routes/
    │   │   ├── authRoutes.js       # POST /api/auth/register, /api/auth/login
    │   │   └── storyRoutes.js      # GET/POST /api/stories + bookmark + scrape
    │   ├── scraper/
    │   │   └── scraperService.js   # Cheerio scraper: fetch → parse → upsert MongoDB
    │   ├── utils/
    │   │   └── generateToken.js    # JWT signing utility
    │   └── app.js                  # Express app: middleware + routes + error handlers
    ├── server.js                   # Entry point: connect DB → auto-scrape → start server
    ├── .env.example
    └── package.json
```

---

## 6. Database Schema

### User Schema
```js
{
  name:      String  (required, min 2 chars)
  email:     String  (required, unique, lowercase)
  password:  String  (hashed with bcrypt, min 6 chars)
  bookmarks: [ObjectId → Story]   // Array of references to Story documents
  timestamps: true                // createdAt, updatedAt
}
```

### Story Schema
```js
{
  title:     String  (required)
  url:       String  (default: "")
  points:    Number  (default: 0)
  author:    String  (default: "unknown")
  postedAt:  String  (raw timestamp from HN)
  hnId:      String  (unique + sparse — HN item ID for deduplication)
  timestamps: true
}
```

### Relationship
- **User → Story**: Many-to-many via `User.bookmarks[]` array of Story ObjectIds
- `User.populate("bookmarks")` resolves the full Story documents on the bookmarks endpoint

---

## 7. API Documentation

### Auth Routes

| Method | Route | Description | Auth | Request Body |
|---|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ | `{ name, email, password }` |
| POST | `/api/auth/login` | Login, get JWT | ❌ | `{ email, password }` |

**Register Response Example:**
```json
{ "_id": "...", "name": "John", "email": "john@example.com", "token": "eyJ..." }
```

### Story Routes

| Method | Route | Description | Auth | Query/Params |
|---|---|---|---|---|
| GET | `/api/stories` | All stories (paginated, sorted by points) | ❌ | `?page=1&limit=10` |
| GET | `/api/stories/:id` | Single story | ❌ | `:id` = MongoDB ObjectId |
| GET | `/api/stories/bookmarks` | User's bookmarked stories | ✅ | — |
| POST | `/api/stories/:id/bookmark` | Toggle bookmark | ✅ | `:id` = story ObjectId |
| POST | `/api/scrape` | Manually trigger scraper | ❌ | — |

**GET /api/stories Response:**
```json
{
  "stories": [ { "_id": "...", "title": "...", "points": 420, "author": "pg", "postedAt": "...", "url": "..." } ],
  "currentPage": 1,
  "totalPages": 2,
  "totalStories": 10
}
```

**POST /api/stories/:id/bookmark Response:**
```json
{ "bookmarked": true, "message": "Bookmark added" }
```

---

## 8. Authentication Flow

```
REGISTER
────────
User submits { name, email, password }
  → authController.registerUser()
  → Check if email already exists (409 if yes)
  → User.create() → pre-save hook hashes password with bcrypt (salt rounds: 10)
  → generateToken(user._id) → signs JWT with JWT_SECRET, expires 7d
  → Returns { _id, name, email, token }

LOGIN
─────
User submits { email, password }
  → authController.loginUser()
  → User.findOne({ email })
  → user.matchPassword(password) → bcrypt.compare()
  → generateToken(user._id)
  → Returns { _id, name, email, token }

JWT FLOW
────────
Frontend stores token in localStorage
  → apiService.js Axios interceptor reads localStorage on every request
  → Adds header: Authorization: Bearer <token>

PROTECTED ROUTE (Backend)
──────────────────────────
Request arrives at protected endpoint
  → authMiddleware.protect() reads Authorization header
  → jwt.verify(token, JWT_SECRET) → decodes { id }
  → User.findById(id).select("-password") → attaches to req.user
  → Controller executes with req.user available

PROTECTED ROUTE (Frontend)
───────────────────────────
<ProtectedRoute> checks AuthContext.isAuthenticated
  → If false → <Navigate to="/login" replace />
  → If true  → renders children
```

---

## 9. Web Scraper Flow

```
scraperService.js — scrapeHackerNews()
────────────────────────────────────────

1. FETCH HTML
   axios.get("https://news.ycombinator.com")
   → Returns full HTML of the HN front page

2. PARSE HTML
   cheerio.load(html)
   → Creates a jQuery-like $ interface over the HTML DOM

3. EXTRACT DATA (top 10 items)
   $("tr.athing").slice(0, 10).each(...)
   → Each HN story has TWO <tr> rows:
      - tr.athing  → contains title, URL, hnId (item id attr)
      - next <tr>  → subtext row with points, author, time

   Per story extracted:
   - hnId     → titleRow.attr("id")
   - title    → span.titleline > a (text)
   - url      → span.titleline > a (href) — prefixed if relative
   - points   → span.score (text, parsed to int)
   - author   → a.hnuser (text)
   - postedAt → span.age (title attr or text)

4. UPSERT TO MONGODB
   Story.bulkWrite([
     { updateOne: { filter: { hnId }, update: { $set: story }, upsert: true } }
   ])
   → If hnId exists → update points/title/etc (story refreshed)
   → If hnId new   → insert as new document
   → Prevents duplicates via unique hnId index on the Story model

5. AUTO-RUN ON STARTUP
   server.js calls scrapeHackerNews() immediately after DB connects
   Errors are caught and logged — they do NOT crash the server

6. MANUAL TRIGGER
   POST /api/scrape → triggerScrape controller → calls scrapeHackerNews()
   Frontend "Re-scrape" button calls this endpoint
```

---

## 10. Frontend Architecture

```
Context API Flow
────────────────
ThemeContext  → manages { theme, toggleTheme }
               → writes data-theme attr to <html> → CSS tokens update globally
               → persists in localStorage

AuthContext   → manages { user, isAuthenticated, login, register, logout }
               → on mount: reads localStorage for existing token+user
               → login/register: calls API, stores token+user in localStorage
               → logout: clears localStorage, resets state

Routing
───────
BrowserRouter → Routes
  /           → HomePage        (public)
  /login      → LoginPage       (public)
  /register   → RegisterPage    (public)
  /bookmarks  → BookmarksPage   (ProtectedRoute → requires isAuthenticated)

All routes wrapped in MainLayout → Navbar is always visible

API Communication
─────────────────
All calls go through src/api/apiService.js
  → Single Axios instance with baseURL = VITE_API_URL
  → Request interceptor auto-attaches Bearer token from localStorage
  → Named exports for each endpoint (registerUser, loginUser, fetchStories, etc.)
  → Components import only the function they need — not the axios instance
```

---

## 11. Pagination Logic

**Backend:**
```
GET /api/stories?page=2&limit=10

page  = parseInt(req.query.page)  || 1    → which page to show
limit = parseInt(req.query.limit) || 10   → items per page
skip  = (page - 1) * limit               → documents to skip in DB

Story.find().sort({ points: -1 }).skip(skip).limit(limit)

Response includes:
  currentPage, totalPages (Math.ceil(total / limit)), totalStories
```

**Frontend:**
- `useStories` hook stores `currentPage` in state
- `<Pagination>` calls `setCurrentPage(n)` on click
- Hook re-runs `fetchStories(currentPage)` via `useEffect([currentPage])`

---

## 12. Project Workflow Analysis

```
FULL REQUEST LIFECYCLE — Example: User bookmarks a story
─────────────────────────────────────────────────────────

1. User clicks bookmark icon on a StoryCard
   └─ StoryCard.handleBookmark() called

2. Frontend checks AuthContext.isAuthenticated
   └─ If false → toast.error("Please log in")
   └─ If true  → proceed

3. toggleBookmarkApi(story._id) called
   └─ apiService.js: POST /api/stories/:id/bookmark
   └─ Axios interceptor injects: Authorization: Bearer <token>

4. Request hits Express server
   └─ app.js routes to storyRoutes.js
   └─ protect middleware runs:
        - Extracts token from Authorization header
        - jwt.verify(token, JWT_SECRET)
        - User.findById(decoded.id) → req.user = user

5. storyController.toggleBookmark() runs
   └─ Finds the story by req.params.id
   └─ Checks if story._id is in user.bookmarks[]
   └─ If yes → removes it (filter)
   └─ If no  → pushes it
   └─ user.save()
   └─ Returns { bookmarked: true/false, message }

6. Response returns to frontend
   └─ StoryCard updates local bookmarked state
   └─ Calls onBookmarkToggle(storyId, newState) → parent updates Set
   └─ toast.success("Bookmarked!" / "Bookmark removed")

─────────────────────────────────────────────────────────
SCRAPER LIFECYCLE — On server startup
─────────────────────────────────────────────────────────

server.js
  └─ connectDB() → MongoDB connected
  └─ scrapeHackerNews() (non-blocking, errors logged)
       └─ axios.get("https://news.ycombinator.com")
       └─ cheerio parses HTML
       └─ Extracts top 10 story objects
       └─ Story.bulkWrite(upserts by hnId)
  └─ app.listen(PORT)

─────────────────────────────────────────────────────────
AUTH LIFECYCLE — Register then access protected page
─────────────────────────────────────────────────────────

User fills RegisterPage form
  └─ AuthContext.register(name, email, password)
  └─ POST /api/auth/register
  └─ Backend: User.create() → bcrypt hashes password → JWT issued
  └─ Frontend: token + user stored in localStorage
  └─ AuthContext.user set → isAuthenticated = true
  └─ navigate("/")

User clicks "Bookmarks" in Navbar
  └─ <ProtectedRoute> checks isAuthenticated = true → renders BookmarksPage
  └─ GET /api/stories/bookmarks (with Bearer token)
  └─ protect middleware verifies token
  └─ User.findById().populate("bookmarks")
  └─ Returns full story objects for each bookmarked ID
```

---

## 13. Local Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### Step 1 — Clone the repository
```bash
git clone <your-repo-url>
cd Assignment
```

### Step 2 — Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
# Then edit .env and fill in your values (see Section 14)

# Start development server
npm run dev
```
Server runs at: `http://localhost:5000`

### Step 3 — Frontend Setup
```bash
cd client

# Install dependencies (React + Tailwind already set up)
npm install

# Create your .env file
cp .env.example .env
# Edit VITE_API_URL if your backend runs on a different port

# Start development server
npm run dev
```
Frontend runs at: `http://localhost:5173`

### Step 4 — Configure MongoDB Atlas
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster
2. Under **Database Access** → create a user with read/write permissions
3. Under **Network Access** → add `0.0.0.0/0` (or your IP)
4. Click **Connect** → **Drivers** → copy the connection string
5. Replace `<username>:<password>` in your `MONGO_URI`

### Step 5 — Trigger the scraper manually
```bash
curl -X POST http://localhost:5000/api/scrape
# Or use the "Re-scrape" button on the frontend home page
```

> **Note:** The scraper also runs automatically every time the server starts.

---

## 14. Environment Variables

### Backend (`server/.env`)
```env
PORT=5000                         # Port the Express server listens on
MONGO_URI=mongodb+srv://...       # Full MongoDB Atlas connection string
JWT_SECRET=your_secret_here       # Long, random string for signing JWT tokens
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api   # Backend API base URL
```

> All env vars are accessed via `process.env.*` (backend) or `import.meta.env.*` (frontend, Vite).
> Never commit `.env` files — they are in `.gitignore`.

---

## 15. Deployment Guide

### Frontend → Vercel
1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import repo
3. Set **Root Directory** to `client`
4. Add Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render
1. Go to [render.com](https://render.com) → **New Web Service** → connect repo
2. Set **Root Directory** to `server`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. Add Environment Variables: `PORT`, `MONGO_URI`, `JWT_SECRET`
6. Deploy

### Database → MongoDB Atlas
- Already configured in Step 4 above
- Make sure **Network Access** includes `0.0.0.0/0` for Render's dynamic IPs

---

## 16. Future Improvements

- ♻️ **Scheduled scraping** — Use `node-cron` to auto-scrape every 30 minutes
- 🔍 **Search & filter** — Filter stories by title, author, or minimum points
- 📊 **Analytics dashboard** — Track most bookmarked stories
- 🔄 **Refresh token** — Implement refresh token rotation for longer sessions
- 📱 **PWA support** — Make the app installable on mobile devices
- 🧪 **Testing** — Add Jest + Supertest for backend, React Testing Library for frontend
- 🗂️ **Story categories** — Tag stories by topic (AI, Web, Security, etc.)
- 🔔 **Email notifications** — Notify users when bookmarked stories hit a new points milestone
- 🌐 **Multiple sources** — Add support for scraping Reddit r/programming, Lobsters, etc.

---

## 17. Author

Built as a MERN stack assignment demonstrating full-stack development skills:
- REST API design with Express.js
- JWT authentication with bcrypt
- Web scraping with Cheerio
- React frontend with Context API
- MongoDB data modeling with Mongoose

---

*Made with ❤️ using the MERN stack*




















