import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SUBJECTS = [
  'ADC (Analog and Digital Communication)',
  'MA (Microcontroller Applications)',
  'ML (Machine Learning)',
  'OOP (Object Oriented Programming)',
  'ISPM (Integrated System Project Management)',
  'ICSR (Indian Constitution and Social Responsibility)',
];

export default function UploadPage() {
  const [form, setForm] = useState({ title: '', subject: 'Biology' });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an audio file.');
    setError('');
    setLoading(true);
    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('title', form.title);
    formData.append('subject', form.subject);

    try {
      const { data } = await api.post('/lectures/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Uploaded! Redirecting...');
      setTimeout(() => navigate(`/lecture/${data.lectureId}`), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      setStatus('');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload a Lecture</h1>
        <p className="text-gray-500 mt-1">We'll transcribe it and generate flashcards + notes automatically.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}
        {status && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm px-4 py-3 rounded-lg mb-5 flex items-center gap-2">
            <span className="animate-spin">⏳</span> {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lecture Title</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="e.g. Introduction to Photosynthesis"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
              value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
            >
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audio File</label>
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${file ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
              onClick={() => document.getElementById('audioInput').click()}
            >
              <input type="file" accept=".mp3,.wav,.m4a" onChange={e => setFile(e.target.files[0])} className="hidden" id="audioInput" />
              <div className="text-3xl mb-2">{file ? '🎵' : '🎙️'}</div>
              {file ? (
                <div>
                  <p className="font-medium text-indigo-700">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 font-medium">Drop your audio file here</p>
                  <p className="text-xs text-gray-400 mt-1">or click to browse — .mp3, .wav, .m4a (max 100MB)</p>
                </div>
              )}
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
            type="submit" disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload & Process'}
          </button>
        </form>
      </div>
    </div>
  );
}
