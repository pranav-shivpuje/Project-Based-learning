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
  const [form, setForm] = useState({ title: '', subject: SUBJECTS[0] });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputStyle = {
    width: '100%', background: '#F8F7FF', border: '1px solid #E5E4F0',
    borderRadius: '8px', padding: '10px 16px', fontSize: '14px',
    color: '#1A1A2E', outline: 'none', transition: 'border-color 0.15s',
    fontFamily: 'DM Sans, sans-serif',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select an audio file.');
    setError(''); setLoading(true); setStatus('Uploading...');
    const formData = new FormData();
    formData.append('audio', file);
    formData.append('title', form.title);
    formData.append('subject', form.subject);
    try {
      const { data } = await api.post('/lectures/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus('Uploaded! Redirecting...');
      setTimeout(() => navigate(`/lecture/${data.lectureId}`), 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      setStatus(''); setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>Upload a Lecture</h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>We'll transcribe it and generate notes, flashcards, MCQs and more.</p>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '32px' }}>
        {error && (
          <div style={{ background: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.25)', color: '#FF4D6A', fontSize: '13px', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        {status && (
          <div style={{ background: 'rgba(123,97,255,0.08)', border: '1px solid rgba(123,97,255,0.2)', color: '#7B61FF', fontSize: '13px', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> {status}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6B7280', marginBottom: '6px' }}>Lecture Title</label>
            <input style={inputStyle} placeholder="e.g. Introduction to Binary Trees"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#7B61FF'}
              onBlur={e => e.target.style.borderColor = '#E5E4F0'} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6B7280', marginBottom: '6px' }}>Subject</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#7B61FF'}
              onBlur={e => e.target.style.borderColor = '#E5E4F0'}>
              {SUBJECTS.map(s => <option key={s} style={{ background: '#FFFFFF' }}>{s}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6B7280', marginBottom: '6px' }}>Audio File</label>
            <div
              onClick={() => document.getElementById('audioInput').click()}
              onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
              onDragOver={e => e.preventDefault()}
              style={{ border: `2px dashed ${file ? '#7B61FF' : '#E5E4F0'}`, borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: 'pointer', background: file ? 'rgba(123,97,255,0.04)' : 'transparent', transition: 'all 0.15s' }}>
              <input type="file" accept=".mp3,.wav,.m4a,.mp4" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} id="audioInput" />
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{file ? '🎵' : '🎙️'}</div>
              {file ? (
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#7B61FF' }}>{file.name}</p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>Drop your audio file here</p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>.mp3, .wav, .m4a, .mp4 — up to 500MB</p>
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ background: '#7B61FF', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.15s', opacity: loading ? 0.6 : 1, fontFamily: 'DM Sans, sans-serif' }}>
            {loading ? 'Uploading...' : 'Upload & Process'}
          </button>
        </form>
      </div>
    </div>
  );
}
