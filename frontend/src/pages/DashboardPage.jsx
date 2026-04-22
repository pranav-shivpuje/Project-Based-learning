import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SUBJECT_COLORS = { ADC: '#7B61FF', MA: '#00E5A0', ML: '#F59E0B', OOP: '#FF4D6A', ISPM: '#3B82F6', ICSR: '#EC4899' };

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

function SkeletonCard() {
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '20px' }}>
      <div className="skeleton" style={{ height: '14px', width: '60px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '8px' }} />
      <div className="skeleton" style={{ height: '12px', width: '40%' }} />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/lectures').then(({ data }) => { setLectures(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const ready = lectures.filter(l => l.status === 'ready').length;
  const processing = lectures.filter(l => !['ready', 'failed'].includes(l.status)).length;
  const recent = lectures.slice(0, 4);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', position: 'relative' }}>
      {/* Radial glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(123,97,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div className="dashboard-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>Your study hub · {lectures.length} lectures</p>
        </div>
        <Link to="/upload" className="dashboard-upload-btn" style={{ background: '#7B61FF', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', transition: 'opacity 0.15s', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}>
          + Upload Lecture
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '48px' }}>
        {[
          { label: 'Total Lectures', value: lectures.length, border: '#7B61FF' },
          { label: 'Ready to Study', value: ready, border: '#00E5A0' },
          { label: 'Processing', value: processing, border: '#6B7280' },
        ].map(s => (
          <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderLeft: `3px solid ${s.border}`, borderRadius: '12px', padding: '24px' }}>
            <div style={{ fontSize: '40px', fontWeight: '700', color: '#1A1A2E', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Recent Lectures</span>
        <Link to="/library" style={{ fontSize: '13px', color: '#7B61FF', textDecoration: 'none', fontWeight: '500' }}>View all →</Link>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : recent.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: '80px' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ margin: '0 auto 20px' }}>
            <rect x="10" y="20" width="60" height="45" rx="4" stroke="#E5E4F0" strokeWidth="2" fill="none"/>
            <path d="M10 32h60" stroke="#E5E4F0" strokeWidth="2"/>
            <path d="M25 20V15a5 5 0 0110 0v5M45 20V15a5 5 0 0110 0v5" stroke="#E5E4F0" strokeWidth="2"/>
            <path d="M25 45h30M25 53h20" stroke="#E5E4F0" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: '20px', fontWeight: '600', color: '#1A1A2E', marginBottom: '8px' }}>No lectures yet</p>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Upload your first lecture audio to get started</p>
          <Link to="/upload" style={{ background: '#7B61FF', color: '#fff', textDecoration: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
            Upload Lecture
          </Link>
        </div>
      ) : (
        <div className="lectures-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {recent.map(l => {
            const abbr = l.subject?.split(' ')[0];
            const color = SUBJECT_COLORS[abbr] || '#7B61FF';
            return (
              <Link key={l.id} to={`/lecture/${l.id}`} style={{ textDecoration: 'none', display: 'block', background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '20px', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#C4C2E0'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E4F0'}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '600', background: '#E5E4F0', color: '#6B7280', padding: '4px 10px', borderRadius: '999px' }}>{abbr}</span>
                  <span style={{ fontSize: '12px', color: l.status === 'ready' ? '#00E5A0' : l.status === 'failed' ? '#FF4D6A' : '#F59E0B', fontWeight: '500' }}>
                    ● {l.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A2E', marginBottom: '6px', lineHeight: '1.4' }}>{l.title}</h3>
                <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>
                  {new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <div style={{ width: '100%', height: '4px', background: '#E5E4F0', borderRadius: '999px', marginBottom: '6px' }}>
                  <div style={{ width: '0%', height: '100%', background: color, borderRadius: '999px' }} />
                </div>
                <p style={{ fontSize: '11px', color: '#9CA3AF' }}>0% studied</p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
