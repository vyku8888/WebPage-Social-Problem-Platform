import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth/forgotpassword', { email });
      // We explicitly receive the demo URL from the backend
      setMessage(`Demo Link Generated: ${response.data.resetUrl}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh]">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="bg-white/70 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/80 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 transform rotate-3">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Reset Password</h2>
          <p className="text-slate-500 font-medium">Enter your email to receive a recovery link.</p>
        </div>
        
        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-100 font-medium shadow-sm">
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-50 text-emerald-700 p-5 rounded-2xl text-sm mb-6 border border-emerald-200 font-bold shadow-sm break-words whitespace-pre-wrap">
            <p className="mb-2">For presentation demo purposes, click this link to reset your password:</p>
            <a href={message.replace('Demo Link Generated: ', '')} className="text-blue-600 underline">
              {message.replace('Demo Link Generated: ', '')}
            </a>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Registered Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-white/50 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 px-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Send Recovery Token'} <ArrowRight className="w-4 h-4"/>
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium relative z-10">
          Remember it?{' '}
          <Link to="/login" className="font-bold text-slate-900 hover:text-slate-700">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
