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
import AnimatedBackground from './components/AnimatedBackground';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-slate-800 flex flex-col font-sans selection:bg-blue-200 relative overflow-x-hidden">
        {/* INTERACTIVE PARTICLE CONSTELLATION MESH */}
        <AnimatedBackground />

        <Navbar />
        <main className="flex-grow w-full z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
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
