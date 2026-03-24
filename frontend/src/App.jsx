import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddIssue from './pages/AddIssue';
import ReportIssue from './pages/ReportIssue';
import ReportsList from './pages/ReportsList';
import IssueDetails from './pages/IssueDetails';
import Analytics from './pages/Analytics';
import UserDashboard from './pages/UserDashboard';
import Leaderboard from './pages/Leaderboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-blue-200 relative overflow-x-hidden">
        {/* GLOBAL PREMIUM BACKGROUND MESH */}
        <div className="fixed inset-0 w-full h-full -z-10 bg-slate-50 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-200/40 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-200/30 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }}></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-sky-200/30 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        </div>

        <Navbar />
        <main className="flex-grow w-full z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/issues" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/add-issue" element={<ProtectedRoute><AddIssue /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
            <Route path="/reports-list" element={<ProtectedRoute><ReportsList /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/issue/:id" element={<ProtectedRoute><IssueDetails /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
