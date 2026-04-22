import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: '#F8F7FF', border: '1px solid #E5E4F0',
    borderRadius: '8px', padding: '10px 16px', fontSize: '14px',
    color: '#1A1A2E', outline: 'none', transition: 'border-color 0.15s',
    fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8F7FF' }}>
      {/* Left — keep purple gradient panel as-is */}
      <div style={{ width: '45%', background: '#16161A', borderRight: '1px solid #2A2A35', padding: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#F0EFF5' }}>🎓 LectureTranscribber</div>
        <div>
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#F0EFF5', lineHeight: '1.2', marginBottom: '16px', fontFamily: 'Lora, serif' }}>
            Turn any lecture<br />into study material.
          </h2>
          <p style={{ fontSize: '15px', color: '#8B8A99', lineHeight: '1.6' }}>
            Upload audio → get notes, flashcards, MCQs, a glossary, and a personal tutor chatbot. Instantly.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Notes', 'Flashcards', 'MCQ Quiz', 'Glossary', 'AI Tutor'].map(f => (
            <span key={f} style={{ fontSize: '12px', background: '#2A2A35', color: '#8B8A99', padding: '6px 12px', borderRadius: '999px' }}>{f}</span>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>Welcome back</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '32px' }}>Sign in to your account</p>

          {error && (
            <div style={{ background: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.25)', color: '#FF4D6A', fontSize: '13px', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6B7280', marginBottom: '6px' }}>Email</label>
              <input style={inputStyle} type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#7B61FF'}
                onBlur={e => e.target.style.borderColor = '#E5E4F0'} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6B7280', marginBottom: '6px' }}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#7B61FF'}
                onBlur={e => e.target.style.borderColor = '#E5E4F0'} required />
            </div>
            <button type="submit" disabled={loading}
              style={{ background: '#7B61FF', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.15s', opacity: loading ? 0.6 : 1, fontFamily: 'DM Sans, sans-serif', marginTop: '8px' }}
              onMouseEnter={e => { if (!loading) e.target.style.opacity = '0.85'; }}
              onMouseLeave={e => e.target.style.opacity = loading ? '0.6' : '1'}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ fontSize: '13px', textAlign: 'center', marginTop: '24px', color: '#9CA3AF' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: '#7B61FF', textDecoration: 'none', fontWeight: '500' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
