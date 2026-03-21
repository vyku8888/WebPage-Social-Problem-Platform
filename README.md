# Sociofy - Public Issue & Complaint Intelligence Platform

Sociofy is a comprehensive, full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed to empower communities. It provides an intuitive platform for citizens to report local infrastructure and social problems, upload photographic evidence, propose solutions, and engage through an advanced gamified voting system.

## 🚀 Key Features

* **Interactive Community Dashboard:** View all reported issues locally, track real-time resolution metrics, and securely upvote/unvote critical community bugs.
* **Evidence-Based Reporting:** Seamlessly submit private local reports with severity tracking and photographic uploads directly from your device.
* **Gamification & Leaderboards:** Earn "Contribution Scores", secure algorithmic Badges (Beginner to Top Contributor), and climb the global ranking Leaderboard.
* **Live Issue Tracking:** Transparently monitor whether authorities have marked an issue or report as 'Action Taken' or 'Resolved'.
* **Advanced User Control:** Total content sovereignty through secure, cascading database removals, allowing you to instantly eradicate your own issues, comments, solutions, and votes. 

## 🛠️ Technology Stack

* **Frontend:** React, Vite, TailwindCSS, React Router, Recharts (for dynamic analytics), React Icons.
* **Backend:** Node.js, Express.js, JWT Authentication, Bcrypt Password Encryption.
* **Database:** MongoDB (Mongoose ORM).
* **Storage:** Local Multer filesystem handling for immediate, isolated image uploads without external buckets.

## 📦 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd social-problem-platform
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   * Create a `.env` file in the `backend/` directory with your `MONGO_URI` and ideal `JWT_SECRET`.
   * Start the server: `node server.js`
   
3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   * Start the Vite development server: `npm run dev`

4. Open your browser and navigate to the localhost port provided by Vite (typically `http://localhost:5173`).

## 🛡️ Architecture & Security
Sociofy implements strict RESTful API principles. Every single engagement endpoint (`/api/issues`, `/api/users/dashboard`, `/api/reports`) requires secure Bearer JWT token headers injected transparently by the local storage context API wrapper. 

*Designed and developed specifically to bridge the civic engagement gap between citizens and authorities.*
