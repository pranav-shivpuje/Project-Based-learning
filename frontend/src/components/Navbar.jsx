import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  if (!token) return null;

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
        location.pathname === path
          ? 'bg-white/20 text-white'
          : 'text-indigo-100 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-white text-lg tracking-tight">
          <span className="text-xl">🎓</span> LectureTranscribber
        </Link>
        <div className="flex items-center gap-1">
          {navLink('/', 'Dashboard')}
          {navLink('/library', 'Library')}
          {navLink('/upload', 'Upload')}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-indigo-100 text-sm hidden sm:block">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-indigo-100 hover:text-white border border-white/30 hover:border-white/60 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
