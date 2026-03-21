import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExclamationCircle } from 'react-icons/fa';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/reports');
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports", err);
      }
      setLoading(false);
    };
    fetchReports();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Citizen Reports & Evidence</h1>
        <p className="text-gray-500">View all real-world issues reported with photographic evidence.</p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">No reports submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map(report => (
            <div key={report._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="h-48 w-full bg-gray-100 relative">
                {/* Image is served statically from the Express backend port 5000 */}
                <img 
                  src={report.imageUrl.startsWith('http') ? report.imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${report.imageUrl}`} 
                  alt={report.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image+Found'; }}
                />
                <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                  report.severity === 'High' ? 'bg-red-500 text-white' : 
                  report.severity === 'Medium' ? 'bg-orange-500 text-white' : 'bg-yellow-400 text-yellow-900'
                }`}>
                  {report.severity} Severity
                </span>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
                    {report.category}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FaExclamationCircle /> {report.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm font-medium text-gray-500 mb-3">📍 {report.location}</p>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">{report.description}</p>
                
                <div className="text-xs text-gray-400 pt-3 border-t border-gray-100">
                  Reported by {report.isAnonymous ? <span className="text-gray-600 italic">Anonymous Citizen 🛡️</span> : <span className="font-semibold text-gray-600">{report.reporter?.name || 'Citizen'}</span>} on {new Date(report.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsList;
