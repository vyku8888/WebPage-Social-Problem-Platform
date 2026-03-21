import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrophy, FaCoins, FaListUl, FaChartLine, FaTrash, FaCheck } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

const COLORS = ['#4DA8DA', '#F59E0B', '#10B981', '#6B7280'];

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteData, setDeleteData] = useState({ isOpen: false, type: null, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Dashboard error", err);
      }
      setLoading(false);
    };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleResolveItem = async (type, id) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'issue' ? `/api/issues/${id}/status` : `/api/reports/${id}/status`;
      const statusValue = type === 'issue' ? 'Resolved' : 'Action Taken';
      await axios.put(`http://localhost:5000${endpoint}`, { status: statusValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${type === 'issue' ? 'Issue' : 'Report'} marked as resolved!`);
      fetchDashboard(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = deleteData.type === 'issue' ? `/api/issues/${deleteData.id}` : `/api/reports/${deleteData.id}`;
      await axios.delete(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${deleteData.type === 'issue' ? 'Issue' : 'Report'} deleted successfully.`);
      setDeleteData({ isOpen: false, type: null, id: null });
      fetchDashboard(); // Refresh data immediately
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting item');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="text-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div></div>;
  if (!data) return <div className="text-center mt-20 text-red-500">Error loading your dashboard</div>;

  const { profile, activity, issues, reports } = data;

  const pieData = [
    { name: 'Issues Reported', value: profile.issuesReported || 0 },
    { name: 'Votes Received', value: profile.totalVotesReceived || 0 },
    { name: 'Comments Received', value: profile.totalComments || 0 }
  ].filter(d => d.value > 0);

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        
        {/* Profile Card */}
        <div className="glass rounded-3xl p-6 shadow-lg flex-1 border-t-4 border-t-primary">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">{profile.name}</h2>
              <p className="text-gray-500 mb-4">{profile.email}</p>
              <span className="bg-primaryLight text-primaryDark px-4 py-1.5 rounded-full text-sm font-bold border border-primary/20 shadow-sm">
                🏆 {profile.currentBadge}
              </span>
            </div>
            <div className="text-center bg-white/80 rounded-2xl p-4 shadow-sm border border-gray-100">
              <span className="block text-4xl font-black text-primary mb-1">#{profile.rank}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Local Rank</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-gray-50">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500 text-xl shadow-sm">
                <FaCoins />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Credits</p>
                <p className="text-2xl font-black text-gray-800">{profile.credits}</p>
              </div>
            </div>
            <div className="bg-white/80 rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-gray-50">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-primary text-xl shadow-sm">
                <FaTrophy />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Contribution Score</p>
                <p className="text-2xl font-black text-gray-800">{profile.score}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="glass rounded-3xl p-6 shadow-lg flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Engagement Distribution</h3>
          <p className="text-sm text-gray-500 mb-4">Breakdown of how the community interacts with you.</p>
          <div className="flex-1 min-h-[200px] w-full relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                Not enough data to map yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Tracking Section */}
        <div className="glass rounded-3xl p-6 shadow-lg lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaListUl className="text-primary" /> Your Reported Problems
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {issues.length === 0 && reports.length === 0 ? (
               <div className="text-center py-10">
                 <p className="text-gray-500 mb-3">You haven't reported anything yet.</p>
                 <Link to="/report" className="text-primary font-bold hover:underline">Start making a difference &rarr;</Link>
               </div>
            ) : null}
            
            {issues.map(issue => (
              <div key={issue._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-primary bg-primaryLight px-2.5 py-1 rounded-md">
                    GENERAL ISSUE: {issue.category}
                  </span>
                  <div className="flex gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${issue.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {issue.status}
                    </span>
                    {issue.status !== 'Resolved' && (
                      <button onClick={() => handleResolveItem('issue', issue._id)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-full transition-colors" title="Mark as Resolved">
                        <FaCheck size={12} />
                      </button>
                    )}
                    <button onClick={() => setDeleteData({ isOpen: true, type: 'issue', id: issue._id })} className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors" title="Delete Issue">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
                <Link to={`/issue/${issue._id}`} className="font-bold text-lg text-gray-800 hover:text-primary transition-colors">
                  {issue.title}
                </Link>
                <div className="flex flex-wrap gap-4 mt-3 text-sm font-medium text-gray-500">
                  <span className="flex items-center gap-1">👍 {issue.totalVotes} votes</span>
                  <span className="flex items-center gap-1">💬 {issue.comments?.length || 0} comments</span>
                  <span className="flex items-center gap-1">📅 {new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}

            {reports.map(report => (
              <div key={report._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
                    EVIDENCE REPORT: {report.category}
                  </span>
                  <div className="flex gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${report.status === 'Action Taken' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {report.status}
                    </span>
                    {report.status !== 'Action Taken' && (
                      <button onClick={() => handleResolveItem('report', report._id)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-full transition-colors" title="Mark as Action Taken">
                        <FaCheck size={12} />
                      </button>
                    )}
                    <button onClick={() => setDeleteData({ isOpen: true, type: 'report', id: report._id })} className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors" title="Delete Report">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-gray-800">{report.title}</h4>
                <div className="flex flex-wrap gap-4 mt-3 text-sm font-medium text-gray-500">
                  <span className="flex items-center gap-1 text-red-400">🚨 {report.severity} Severity</span>
                  <span className="flex items-center gap-1">📍 {report.location}</span>
                  <span className="flex items-center gap-1">📅 {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="glass rounded-3xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaChartLine className="text-green-500" /> Track Record
          </h3>
          
          <div className="bg-white p-5 rounded-2xl shadow-sm mb-5 border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-full -mr-8 -mt-8 opacity-50"></div>
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="block text-sm font-bold text-gray-400 uppercase tracking-wide mb-1">Action Needed</span>
                <span className="font-bold text-gray-700">Pending</span>
              </div>
              <span className="text-3xl font-black text-orange-500">{activity.pending}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-300 to-orange-500 h-2 rounded-full" style={{ width: `${(activity.pending / (activity.pending + activity.resolved || 1)) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-full -mr-8 -mt-8 opacity-50"></div>
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="block text-sm font-bold text-gray-400 uppercase tracking-wide mb-1">Impact Made</span>
                <span className="font-bold text-gray-700">Resolved</span>
              </div>
              <span className="text-3xl font-black text-green-500">{activity.resolved}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-300 to-green-500 h-2 rounded-full" style={{ width: `${(activity.resolved / (activity.pending + activity.resolved || 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={deleteData.isOpen}
        title={`Delete ${deleteData.type === 'issue' ? 'Issue' : 'Report'}?`}
        message={isDeleting ? "Deleting..." : "Are you sure you want to delete this permanently? All related points, comments, and engagement will be reversed and erased."}
        onConfirm={isDeleting ? undefined : handleDeleteConfirm}
        onCancel={() => setDeleteData({ isOpen: false, type: null, id: null })}
      />
    </div>
  );
};

export default UserDashboard;
