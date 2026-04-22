import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const SUBJECTS = ['ADC (Analog and Digital Communication)', 'MA (Microcontroller Applications)', 'ML (Machine Learning)', 'OOP (Object Oriented Programming)', 'ISPM (Integrated System Project Management)', 'ICSR (Indian Constitution and Social Responsibility)'];
const SUBJECT_COLORS = { ADC: '#7B61FF', MA: '#00E5A0', ML: '#F59E0B', OOP: '#FF4D6A', ISPM: '#3B82F6', ICSR: '#EC4899' };

export default function LibraryPage() {
  const [lectures, setLectures] = useState([]);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/lectures').then(({ data }) => { setLectures(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = lectures.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) && (subject === '' || l.subject === subject)
  );

  const inputStyle = { background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '8px', padding: '9px 16px', fontSize: '14px', color: '#1A1A2E', outline: 'none', transition: 'border-color 0.15s', fontFamily: 'DM Sans, sans-serif' };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>Lecture Library</h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>{lectures.length} lectures · {lectures.filter(l => l.status === 'ready').length} ready</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '14px' }}>🔍</span>
          <input style={{ ...inputStyle, width: '100%', paddingLeft: '36px' }} placeholder="Search lectures..."
            value={search} onChange={e => setSearch(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#7B61FF'}
            onBlur={e => e.target.style.borderColor = '#E5E4F0'} />
        </div>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={subject} onChange={e => setSubject(e.target.value)}>
          <option value="" style={{ background: '#FFFFFF' }}>All Subjects</option>
          {SUBJECTS.map(s => <option key={s} style={{ background: '#FFFFFF' }}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="skeleton" style={{ width: '44px', height: '44px', borderRadius: '8px', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: '14px', width: '50%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '12px', width: '30%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px' }}>
          <p style={{ fontSize: '16px', color: '#6B7280' }}>No lectures found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(l => {
            const abbr = l.subject?.split(' ')[0];
            const color = SUBJECT_COLORS[abbr] || '#7B61FF';
            return (
              <div key={l.id} style={{ background: '#FFFFFF', border: '1px solid #E5E4F0', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#C4C2E0'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E4F0'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color, flexShrink: 0 }}>
                    {abbr}
                  </div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A2E', marginBottom: '3px' }}>{l.title}</p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      {l.subject?.split('(')[1]?.replace(')', '') || l.subject} · {new Date(l.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: l.status === 'ready' ? '#00E5A0' : l.status === 'failed' ? '#FF4D6A' : '#F59E0B' }}>
                    ● {l.status}
                  </span>
                  <Link to={`/lecture/${l.id}`} style={{ background: '#7B61FF', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '500', padding: '7px 16px', borderRadius: '8px', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => e.target.style.opacity = '0.85'}
                    onMouseLeave={e => e.target.style.opacity = '1'}>
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
