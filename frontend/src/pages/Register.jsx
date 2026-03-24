import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/issues');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] py-10">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/80 relative overflow-hidden"
      >
        {/* Decorative corner accent */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">Create Account</h2>
          <p className="text-slate-500 font-medium">Join thousands resolving issues.</p>
        </div>
        
        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-100 font-medium shadow-sm">
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-white/50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-white/50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3.5 bg-white/50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                placeholder="••••"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-5 py-3.5 bg-white/50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                placeholder="••••"
              />
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-2xl shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_25px_rgba(79,70,229,0.4)] hover:bg-indigo-700 transition-all mt-6"
          >
            Create My Account
          </motion.button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500 font-medium relative z-10">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
            Sign In Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
