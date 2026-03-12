# AI-Based Learning Path Personalizer

## Overview
An intelligent web application that generates personalized day-by-day learning roadmaps for any domain using a custom 3-step AI engine combined with Google Gemini AI. Users get a structured roadmap with YouTube tutorials and article links for each day based on their experience level, target field, and learning goals.

---

## 🚀 Live Features
- 🔐 JWT Authentication + Google OAuth Login
- 🤖 AI-powered personalized roadmap generation
- 🌍 Supports 50+ static domains + any unknown domain via Gemini AI
- 📅 Day-by-day learning schedule with phases (Beginner → Intermediate → Advanced)
- 🎥 YouTube tutorial link for each day (Indian English channels preferred)
- 📄 Article/tutorial link for each day from trusted sites
- ✅ Mark days as complete with progress tracking
- 📊 Multiple roadmaps per user (different fields and levels)
- 📧 Contact form with email notification
- 📱 Responsive dark-themed UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Google OAuth (@react-oauth/google)
- CSS3 (Dark Gen Z theme)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Nodemailer
- Axios

### AI & APIs
- Google Gemini AI (gemini-2.0-flash-lite) — Dynamic topic generation
- YouTube Data API v3 — Tutorial video fetching
- Google Custom Search API — Article fetching
- Custom 3-Step AI Engine — Rule Filter + Weighted Scoring + Semantic Similarity

---

## 🤖 AI Workflow

### Step 1 — Domain Check
```
Known domain (Web Dev, Data Science)?
→ Use static topic database (fast, no API cost)

Unknown domain (Cooking, Photography)?
→ Call Google Gemini AI to generate 6 topics dynamically
```

### Step 2 — 3-Step AI Engine
```
Rule Filter (ruleFilter.js)
→ Removes topics that don't match user's experience/field/duration

Weighted Scoring (weightedScoring.js)
→ Scores each topic based on level match + mastery + keywords

Semantic Similarity (semanticSimilarity.js)
→ Re-ranks topics based on user's description keywords
```

### Step 3 — Phase Split
```
Beginner phase   → first % of days (fundamentals)
Intermediate phase → middle % of days
Advanced phase   → last % of days

Percentages calculated based on experience + mastery level
```

### Step 4 — Resource Fetching
```
For each day module:
YouTube API → real tutorial video (English, India region)
Google Search API → real article from trusted sites
Both APIs failed? → Smart domain-based fallback links
```

---

## 📁 Project Structure
```
AI-Learning-Path-Personalizer/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── GeneratePage.jsx
│       │   ├── Progress.jsx
│       │   ├── Contact.jsx
│       │   ├── LoginPage.jsx
│       │   └── SignupPage.jsx
│       ├── Navbar.js
│       ├── ProtectedRoute.js
│       └── App.js
│
└── backend/
    ├── ai/
    │   ├── topicDatabase.js       ← Static topic database (50+ domains)
    │   ├── topicGenerator.js      ← Gemini AI integration
    │   ├── roadmapGenerator.js    ← Core AI orchestrator
    │   ├── ruleFilter.js          ← Step 1: Rule-based filtering
    │   ├── weightedScoring.js     ← Step 2: Weighted scoring
    │   ├── semanticSimilarity.js  ← Step 3: Semantic similarity
    │   └── resourceFetcher.js     ← YouTube + Article fetching
    ├── controllers/
    │   ├── roadmapController.js
    │   └── authController.js
    ├── models/
    │   ├── Roadmap.js
    │   └── User.js
    ├── routes/
    │   ├── roadmapRoutes.js
    │   ├── authRoutes.js
    │   └── contactRoutes.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── config/
    │   └── emailService.js
    └── server.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
YOUTUBE_API_KEY=your_youtube_api_key
GOOGLE_SEARCH_API_KEY=your_google_search_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY_2=your_backup_gemini_api_key
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

---

## 🔧 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Cloud account (for APIs)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/AI-Learning-Path-Personalizer.git
cd AI-Learning-Path-Personalizer
```

**2. Install backend dependencies**
```bash
cd backend
npm install
```

**3. Install frontend dependencies**
```bash
cd frontend
npm install
```

**4. Set up environment variables**
```bash
# Create .env file in backend/ folder
# Add all variables from Environment Variables section above
```

**5. Run the application**
```bash
# Terminal 1 — Start backend
cd backend
npm run dev

# Terminal 2 — Start frontend
cd frontend
npm start
```

**6. Open in browser**
```
http://localhost:3000
```

---

## 🔌 API Endpoints

### Auth Routes
```
POST /api/auth/register     → Register new user
POST /api/auth/login        → Login with email/password
POST /api/auth/google       → Login with Google OAuth
```

### Roadmap Routes (Protected)
```
POST /api/roadmap/generate          → Generate new roadmap
GET  /api/roadmap/                  → Get all user roadmaps
GET  /api/roadmap/:id               → Get single roadmap
PUT  /api/roadmap/:id/complete/:day → Mark day as complete
DELETE /api/roadmap/:id             → Delete roadmap
```

### Contact Routes
```
POST /api/contact           → Send contact form email
```

---

## 🔒 Security
- JWT tokens with 7-day expiry
- Token expiry auto-checked on every page load
- Protected routes on both frontend and backend
- Google OAuth for secure social login
- Environment variables for all sensitive keys

---

## 📊 AI Algorithms Used

| Algorithm | Type | Purpose |
|---|---|---|
| Rule-Based Filtering | Rule-Based AI | Remove irrelevant topics |
| Weighted Scoring | Score-Based Ranking | Rank topics by importance |
| Semantic Similarity | Keyword-Based NLP | Match user's personal goal |
| Gemini LLM | Generative AI | Handle unknown domains |
| Phase Split | Percentage-Based | Progressive difficulty order |

---

## 🌐 External APIs Used

| API | Purpose | Free Quota |
|---|---|---|
| Google Gemini AI | Dynamic topic generation | 1500 req/day |
| YouTube Data API v3 | Tutorial video fetching | 10,000 units/day |
| Google Custom Search | Article link fetching | 100 queries/day |
| Google OAuth | Social login | Unlimited |

---

## 👨‍💻 Author
**Dhavamani S**
- Email: s.dhavamani6967@gmail.com