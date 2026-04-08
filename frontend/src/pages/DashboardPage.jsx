import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const statusStyle = (s) => ({
  ready:       { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  failed:      { dot: 'bg-red-400',     badge: 'bg-red-50 text-red-600 border-red-200' },
  transcribed: { dot: 'bg-blue-400',    badge: 'bg-blue-50 text-blue-700 border-blue-200' },
}[s] || { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border-amber-200' });

const subjectColor = (s) => {
  const colors = ['bg-violet-100 text-violet-700','bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-orange-100 text-orange-700','bg-pink-100 text-pink-700','bg-cyan-100 text-cyan-700'];
  return colors[s?.charCodeAt(0) % colors.length] || colors[0];
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    api.get('/lectures').then(({ data }) => setLectures(data)).catch(console.error);
  }, []);

  const recent = lectures.slice(0, 4);
  const ready = lectures.filter(l => l.status === 'ready').length;
  const processing = lectures.filter(l => !['ready','failed'].includes(l.status)).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back</p>
        <h1 className="text-3xl font-bold mb-1">{user?.name} 👋</h1>
        <p className="text-indigo-200">Your AI-powered lecture study hub</p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 mt-5 bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition shadow"
        >
          <span className="text-lg">+</span> Upload New Lecture
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Lectures', value: lectures.length, icon: '📚', color: 'from-indigo-500 to-indigo-600' },
          { label: 'Ready to Study', value: ready, icon: '✅', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Processing', value: processing, icon: '⚙️', color: 'from-amber-500 to-amber-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Lectures</h2>
        <Link to="/library" className="text-sm text-indigo-600 hover:underline font-medium">View all →</Link>
      </div>

      {recent.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">🎙️</div>
          <p className="text-gray-500 font-medium">No lectures yet</p>
          <p className="text-gray-400 text-sm mt-1">Upload your first lecture to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recent.map(l => {
            const s = statusStyle(l.status);
            return (
              <Link key={l.id} to={`/lecture/${l.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition shadow-sm group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${subjectColor(l.subject)}`}>
                    {l.subject.split(' ')[0]}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${s.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {l.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{l.title}</h3>
                <p className="text-xs text-gray-400 mt-2">{new Date(l.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
