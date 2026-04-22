import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await api.post('/auth/signup', form); navigate('/login'); }
    catch (err) { setError(err.response?.data?.error || 'Signup failed'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: '#F8F7FF', border: '1px solid #E5E4F0',
    borderRadius: '8px', padding: '10px 16px', fontSize: '14px',
    color: '#1A1A2E', outline: 'none', transition: 'border-color 0.15s',
    fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F7FF', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E' }}>Create your account</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Start turning lectures into study material</p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '32px' }}>
          {error && (
            <div style={{ background: 'rgba(255,77,106,0.08)', border: '1px solid rgba(255,77,106,0.25)', color: '#FF4D6A', fontSize: '13px', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6B7280', marginBottom: '6px' }}>{f.label}</label>
                <input style={inputStyle} type={f.type} placeholder={f.placeholder}
                  value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  onFocus={e => e.target.style.borderColor = '#7B61FF'}
                  onBlur={e => e.target.style.borderColor = '#E5E4F0'} required />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#6B7280', marginBottom: '6px' }}>I am a...</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <button type="submit" disabled={loading}
              style={{ background: '#7B61FF', color: '#fff', border: 'none', borderRadius: '8px', padding: '11px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.15s', opacity: loading ? 0.6 : 1, fontFamily: 'DM Sans, sans-serif', marginTop: '8px' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ fontSize: '13px', textAlign: 'center', marginTop: '20px', color: '#9CA3AF' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7B61FF', textDecoration: 'none', fontWeight: '500' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
