import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowUp, FaCommentAlt, FaLightbulb, FaThumbsUp, FaTrash, FaCheck } from 'react-icons/fa';
import ConfirmationModal from '../components/ConfirmationModal';

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  
  const [newComment, setNewComment] = useState('');
  const [newSolution, setNewSolution] = useState('');
  
  const [commenting, setCommenting] = useState(false);
  const [submittingSolution, setSubmittingSolution] = useState(false);

  const [hasVoted, setHasVoted] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Added delete modal state
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate(); // Added useNavigate hook

  // Get current user ID to check ownership
  const currentUserStr = localStorage.getItem('user');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const currentUserId = currentUser ? currentUser._id : null;

  useEffect(() => {
    fetchIssueData();
  }, [id]);

  const fetchIssueData = async () => {
    try {
      const [issueRes, commentsRes, solutionsRes, votesRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/issues/${id}`),
        axios.get(`http://localhost:5000/api/comments/${id}`),
        axios.get(`http://localhost:5000/api/solutions/${id}`),
        localStorage.getItem('token') 
          ? axios.get('http://localhost:5000/api/users/votes', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }) 
          : Promise.resolve({ data: [] })
      ]);
      setIssue(issueRes.data);
      setComments(commentsRes.data);
      setSolutions(solutionsRes.data);
      setHasVoted(votesRes.data.includes(id));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch issue data.'); // Set error state
    }
    setLoading(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommenting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post('http://localhost:5000/api/comments', { text: newComment, issueId: id }, config);
      setNewComment('');
      fetchIssueData(); // refresh
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error adding comment');
    }
    setCommenting(false);
  };

  const handleAddSolution = async (e) => {
    e.preventDefault();
    if (!newSolution.trim()) return;
    setSubmittingSolution(true);
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post('http://localhost:5000/api/solutions', { description: newSolution, issueId: id }, config);
      setNewSolution('');
      fetchIssueData();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error adding solution');
    }
    setSubmittingSolution(false);
  };

  const handleVoteSolution = async (solutionId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post(`http://localhost:5000/api/solutions/${solutionId}/vote`, {}, config);
      fetchIssueData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error voting for solution');
    }
  };

  const handleVote = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/issues/${id}/vote`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssue({ ...issue, totalVotes: res.data.totalVotes });
      
      if (res.data.action === 'unvoted') {
        setHasVoted(false);
      } else {
        setHasVoted(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error voting');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (isDeleting) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/issues/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssue(res.data);
      alert('Issue marked as resolved!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDeleteIssue = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Issue and related data deleted successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting issue');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  if (!issue) {
    return <div className="text-center py-16">Issue not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Details & Comments */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">{issue.category}</span>
              {currentUserId === issue.author?._id && issue.status !== 'Resolved' && (
                <button 
                  onClick={() => handleUpdateStatus('Resolved')} 
                  className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200 hover:bg-green-200 transition-colors"
                  title="Mark issue as successfully resolved"
                >
                  <FaCheck size={12}/> Resolve
                </button>
              )}
              {currentUserId === issue.author?._id && (
                <button 
                  onClick={() => setShowDeleteModal(true)} 
                  className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold border border-red-200 hover:bg-red-200 transition-colors"
                  title="Delete this issue and all related data"
                >
                  <FaTrash size={12}/> Delete
                </button>
              )}
            </div>
            {/* Status badge can go here if needed */}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{issue.title}</h1>
          <p className="text-gray-700 whitespace-pre-wrap mb-6">{issue.description}</p>
          
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-1"><FaArrowUp className="text-blue-500" /> {issue.totalVotes} Votes</span>
              <span className="flex items-center gap-1"><FaCommentAlt className="text-gray-400" /> {comments.length} Comments</span>
            </div>
            
            <button 
              onClick={handleVote}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors ${hasVoted ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              <FaArrowUp /> {hasVoted ? 'Unvote' : 'Vote'}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaCommentAlt className="text-gray-400" /> Discussion
          </h3>
          
          <form onSubmit={handleAddComment} className="mb-6 flex gap-2">
            <input 
              type="text" 
              value={newComment} 
              onChange={(e) => setNewComment(e.target.value)} 
              placeholder="Add a comment..." 
              required
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={commenting} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
              {commenting ? '...' : 'Post'}
            </button>
          </form>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {comments.length === 0 ? <p className="text-gray-500 text-center py-4">No comments yet. Start the discussion!</p> : null}
            {comments.map(comment => (
              <div key={comment._id} className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800 text-sm">{comment.author?.name || 'Unknown'}</span>
                  <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 text-sm">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Solutions */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-blue-100 h-fit">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" /> Proposed Solutions
        </h3>
        
        <form onSubmit={handleAddSolution} className="mb-6">
          <textarea 
            value={newSolution} 
            onChange={(e) => setNewSolution(e.target.value)} 
            placeholder="Suggest a viable solution..." 
            required rows={3}
            className="w-full px-4 py-2 rounded-lg border border-white bg-white/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 resize-none"
          />
          <button type="submit" disabled={submittingSolution} className="w-full bg-white text-blue-600 border border-blue-200 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition shadow-sm">
            {submittingSolution ? 'Submitting...' : 'Propose Solution'}
          </button>
        </form>

        <div className="space-y-4">
          {solutions.length === 0 ? <p className="text-gray-500 text-sm text-center">No solutions proposed yet.</p> : null}
          {solutions.map(sol => (
            <div key={sol._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative mt-4">
              <span className="absolute -top-3 -right-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm border border-yellow-200">
                <FaArrowUp className="mr-1"/> {sol.votes}
              </span>
              <p className="text-gray-700 text-sm mb-3 mt-2">{sol.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">{sol.author?.name || 'Unknown'}</span>
                <button onClick={() => handleVoteSolution(sol._id)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition">
                  <FaArrowUp /> Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmationModal 
        isOpen={showDeleteModal}
        title="Delete this Issue?"
        message={isDeleting ? "Deleting..." : "Are you sure you want to permanently delete this issue? All related votes, comments, and solutions will be completely erased. This action cannot be undone."}
        onConfirm={isDeleting ? undefined : handleDeleteIssue}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default IssueDetails;
