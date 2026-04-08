import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const SUBJECTS = [
  'ADC (Analog and Digital Communication)',
  'MA (Microcontroller Applications)',
  'ML (Machine Learning)',
  'OOP (Object Oriented Programming)',
  'ISPM (Integrated System Project Management)',
  'ICSR (Indian Constitution and Social Responsibility)',
];

const statusStyle = (s) => ({
  ready:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  failed: 'bg-red-50 text-red-600 border-red-200',
}[s] || 'bg-amber-50 text-amber-700 border-amber-200');

const subjectColor = (s) => {
  const colors = ['bg-violet-100 text-violet-700','bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-orange-100 text-orange-700','bg-pink-100 text-pink-700','bg-cyan-100 text-cyan-700'];
  return colors[SUBJECTS.indexOf(s) % colors.length] || colors[0];
};

export default function LibraryPage() {
  const [lectures, setLectures] = useState([]);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    api.get('/lectures').then(({ data }) => setLectures(data)).catch(console.error);
  }, []);

  const filtered = lectures.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) &&
    (subject === '' || l.subject === subject)
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lecture Library</h1>
        <p className="text-gray-500 mt-1">{lectures.length} lectures · {lectures.filter(l=>l.status==='ready').length} ready</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            placeholder="Search lectures..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={subject} onChange={e => setSubject(e.target.value)}
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500">No lectures found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(l => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">🎙️</div>
                <div>
                  <div className="font-semibold text-gray-900">{l.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${subjectColor(l.subject)}`}>
                      {l.subject.split(' ')[0]}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(l.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusStyle(l.status)}`}>
                  {l.status}
                </span>
                <Link to={`/lecture/${l.id}`} className="bg-indigo-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition font-medium">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
