import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!token) return null;

  const navLink = (path, label) => {
    const active = location.pathname === path;
    return (
      <Link to={path} style={{
        fontSize: '14px', color: active ? '#1A1A2E' : '#6B7280', textDecoration: 'none',
        paddingBottom: '4px', borderBottom: active ? '2px solid #7B61FF' : '2px solid transparent',
        transition: 'all 0.15s', fontWeight: active ? '500' : '400',
      }}>
        {label}
      </Link>
    );
  };

  return (
    <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E4F0', height: '64px', position: 'sticky', top: 0, zIndex: 50 }} ref={menuRef}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '18px', color: '#1A1A2E' }}>
          🎓 LectureTranscribber
        </Link>

        {/* Desktop nav links */}
        <div className="nav-center-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {navLink('/', 'Dashboard')}
          {navLink('/library', 'Library')}
          {navLink('/upload', 'Upload')}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '999px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: '#7B61FF', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <button className="nav-logout-desktop" onClick={() => { logout(); navigate('/login'); }}
            style={{ fontSize: '14px', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s', fontFamily: 'DM Sans, sans-serif', minHeight: '44px' }}
            onMouseEnter={e => e.target.style.color = '#FF4D6A'}
            onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
            Logout
          </button>

          {/* Hamburger */}
          <button className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{ minHeight: '44px', minWidth: '44px', justifyContent: 'center', alignItems: 'center' }}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="nav-dropdown">
          <Link to="/">Dashboard</Link>
          <Link to="/library">Library</Link>
          <Link to="/upload">Upload</Link>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ color: '#FF4D6A' }}>Logout</button>
        </div>
      )}
    </nav>
  );
}
