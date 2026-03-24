import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = user ? [
    { name: 'Issues', path: '/issues' },
    { name: 'Submit Report', path: '/report' },
    { name: 'Evidence', path: '/reports-list' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Dashboard', path: '/dashboard', highlight: true }
  ] : [];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center group">
            <motion.img 
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              src="/sociofy-logo.jpg" 
              alt="Sociofy" 
              className="h-10 object-contain drop-shadow-sm" 
            />
          </Link>
          
          {/* CENTER NAVIGATION - LOGGED IN */}
          {user && (
            <div className="hidden lg:flex items-center space-x-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    location.pathname === link.path 
                      ? 'bg-white shadow-sm text-blue-700' 
                      : link.highlight
                        ? 'text-indigo-600 hover:bg-white/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {/* RIGHT ALIGNED BUTTONS */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4 border-l pl-4 border-slate-200">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Welcome back</span>
                  <span className="text-sm font-extrabold text-slate-800">{user.name}</span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl font-bold hover:bg-rose-100 hover:shadow-sm transition-colors text-sm"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Link to="/login" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold px-2 sm:px-4 py-2 transition-colors">
                    <LogIn className="w-5 h-5" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400 }}>
                  <Link to="/register" className="flex items-center gap-2 bg-blue-600 text-white px-5 sm:px-6 py-2.5 rounded-xl font-bold shadow-[0_8px_16px_rgba(37,99,235,0.2)] hover:shadow-[0_12px_20px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition-all">
                    <UserPlus className="w-5 h-5" />
                    <span>Register</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
