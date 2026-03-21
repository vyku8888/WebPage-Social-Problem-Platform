import { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaArrowUp, FaCommentAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const IssueCard = ({ issue, hasVoted, onVoteSuccess }) => {
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleVote = async (e) => {
    e.preventDefault();
    if(voting) return;
    setVoting(true);
    setError('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/issues/${issue._id}/vote`, {}, config);
      onVoteSuccess(issue._id, data.totalVotes, data.action);
    } catch (err) {
      setError(err.response?.data?.message || 'Error voting');
    }
    setVoting(false);
  };

  const goal = 50; // simple mock goal for progress bar UI
  const progressPercent = Math.min((issue.totalVotes / goal) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
          {issue.category}
        </span>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
          issue.status === 'Resolved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
        }`}>
          {issue.status === 'Resolved' ? <FaCheckCircle /> : <FaExclamationCircle />}
          {issue.status}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{issue.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{issue.description}</p>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{issue.totalVotes} Votes</span>
          <span>Goal: {goal}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          By <span className="font-medium text-gray-700">{issue.author?.name || 'Unknown'}</span>
        </div>
        
        <div className="flex gap-2">
          <Link 
            to={`/issue/${issue._id}`}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            <FaCommentAlt /> Details
          </Link>
          <button 
            onClick={handleVote}
            disabled={voting}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors ${hasVoted ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:opacity-50`}
          >
            <FaArrowUp /> {voting ? '...' : (hasVoted ? 'Unvote' : 'Vote')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
