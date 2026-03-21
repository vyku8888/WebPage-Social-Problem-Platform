import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCrown } from 'react-icons/fa';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/users/leaderboard');
        setLeaders(data);
      } catch (error) {
        console.error("Error fetching leaderboard", error);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading ranks...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-primaryDark mb-3 flex justify-center items-center gap-3">
          <FaCrown className="text-yellow-400" /> Civic Leaderboard
        </h1>
        <p className="text-gray-600 font-medium">Top contributors mapping problems to progress</p>
      </div>

      <div className="glass rounded-3xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-primaryLight text-gray-500 text-sm uppercase tracking-wider">
                <th className="pb-4 pl-4">Rank</th>
                <th className="pb-4">Citizen</th>
                <th className="pb-4">Score</th>
                <th className="pb-4">Credits</th>
                <th className="pb-4">Issues Reported</th>
                <th className="pb-4 pr-4">Badge</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 hover:bg-white/50 transition-colors">
                  <td className="py-4 pl-4 font-bold text-gray-700">
                    {user.rank === 1 ? <span className="text-yellow-500 text-xl">🥇</span> : 
                     user.rank === 2 ? <span className="text-gray-400 text-xl">🥈</span> : 
                     user.rank === 3 ? <span className="text-orange-400 text-xl">🥉</span> : 
                     <span className="text-gray-400 ml-2">{user.rank}</span>}
                  </td>
                  <td className="py-4 font-semibold text-gray-900">{user.name}</td>
                  <td className="py-4 font-bold text-primary">{user.score}</td>
                  <td className="py-4 font-medium text-gray-600">{user.credits}</td>
                  <td className="py-4 text-gray-600">{user.issuesReported}</td>
                  <td className="py-4 pr-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      user.currentBadge === 'Social Hero' ? 'bg-purple-100 text-purple-700' :
                      user.currentBadge === 'Top Reporter' ? 'bg-blue-100 text-blue-700' :
                      user.currentBadge === 'Active Citizen' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {user.currentBadge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
