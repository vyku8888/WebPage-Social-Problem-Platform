import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';

const CATEGORIES = [
  'Social Issues (potholes, garbage, water)',
  'Corruption (bribes, misuse of power)',
  'Illegal Activities (drug selling, fraud, scams)',
  'Public Safety (harassment, unsafe areas)',
  'Others'
];

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    location: '',
    description: '',
    severity: 'Medium',
    isAnonymous: false
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!image) {
      setError('An image is required as evidence for citizen reports.');
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    submitData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/reports', submitData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      navigate('/reports-list');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="glass rounded-3xl p-8 shadow-xl border-t-4 border-t-red-500">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Evidence Report</h1>
        <p className="text-gray-500 mb-8">Report sensitive or physical issues requiring direct evidence.</p>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Incident Title</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2"><FaMapMarkerAlt className="inline mr-1 text-red-500"/> Exact Location</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g. 123 Main St, Central Park Entrance"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              required
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Severity Level</label>
              <div className="flex gap-4">
                {['Low', 'Medium', 'High'].map(level => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={level}
                      checked={formData.severity === level}
                      onChange={() => setFormData({...formData, severity: level})}
                      className="text-primary focus:ring-primary"
                    />
                    <span className={level === 'High' ? 'text-red-500 font-bold' : level === 'Medium' ? 'text-orange-500 font-bold' : 'text-yellow-600 font-bold'}>{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2"><FaCamera className="inline mr-1 text-primary"/> Upload Evidence</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primaryLight file:text-primary hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center gap-4 mt-6">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <FaShieldAlt className="text-primary text-xl" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">Report Anonymously</h4>
              <p className="text-xs text-gray-500">Your name will be hidden from the public dashboard for sensitive reports (corruption, drugs).</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primaryDark text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 mt-4"
          >
            {loading ? 'Submitting Report...' : 'Submit Evidence & Earn 10 Credits'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
