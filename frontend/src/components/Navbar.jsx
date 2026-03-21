import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/sociofy-logo.jpg" alt="Sociofy" className="h-8 object-contain" />
          </Link>
          
          <div className="flex space-x-6 items-center">
            {user ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-primary font-bold transition-colors">Home</Link>
                <Link to="/report" className="text-gray-600 hover:text-primary font-bold transition-colors">Submit Report</Link>
                <Link to="/reports-list" className="text-gray-600 hover:text-primary font-bold transition-colors">View Evidence</Link>
                <Link to="/leaderboard" className="text-gray-600 hover:text-primary font-bold transition-colors">Leaderboard</Link>
                <Link to="/analytics" className="text-gray-600 hover:text-primary font-bold transition-colors">Analytics</Link>
                <span className="text-gray-300 hidden md:block">|</span>
                <Link to="/dashboard" className="text-primaryDark hover:text-primary font-black transition-colors">Dashboard</Link>
                <span className="text-gray-300 hidden md:block">|</span>
                <span className="text-gray-900 font-semibold">{user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
