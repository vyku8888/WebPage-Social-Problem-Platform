import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';
import { FaPlus } from 'react-icons/fa';

const Home = () => {
  const [issues, setIssues] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchIssues();
    fetchUserVotes();
  }, []);

  const fetchUserVotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await axios.get('http://localhost:5000/api/users/votes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserVotes(data);
      }
    } catch (err) {}
  };

  const fetchIssues = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/issues');
      setIssues(data);
    } catch (err) {
      setError('Failed to fetch issues');
    }
    setLoading(false);
  };

  const handleVoteSuccess = (issueId, newTotalVotes, action) => {
    setIssues(issues.map(issue => 
      issue._id === issueId ? { ...issue, totalVotes: newTotalVotes } : issue
    ));
    if (action === 'voted') {
      setUserVotes([...userVotes, issueId]);
    } else {
      setUserVotes(userVotes.filter(id => id !== issueId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Issues</h1>
          <p className="text-gray-500">Vote on social problems that matter to you to drive change.</p>
        </div>
        <Link 
          to="/add-issue"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap"
        >
          <FaPlus /> Raise Issue
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      {issues.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-500">Be the first to raise a community issue!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map(issue => (
            <IssueCard 
              key={issue._id} 
              issue={issue} 
              hasVoted={userVotes.includes(issue._id)}
              onVoteSuccess={handleVoteSuccess} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
