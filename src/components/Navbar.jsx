import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Navbar({ searchQuery, onSearchChange, onMenuClick }) {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const debounceRef = useRef(null);
  const mobileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, profile, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  // Focus mobile input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

  // Track scroll position — navbar becomes solid after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(value);
      if (location.pathname !== '/') navigate('/');
    }, 500);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
    setMobileSearchOpen(false);
  };

  // On homepage at top: fully transparent. After scroll or on other pages: frosted glass
  const isHomePage = location.pathname === '/';
  const showTransparent = isHomePage && !scrolled;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-[60px] transition-all duration-500 ease-out"
        style={{
          background: showTransparent
            ? 'transparent'
            : 'rgba(7, 8, 15, 0.75)',
          backdropFilter: showTransparent
            ? 'blur(0px)'
            : 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: showTransparent
            ? 'blur(0px)'
            : 'blur(24px) saturate(1.4)',
          borderBottom: showTransparent
            ? '1px solid transparent'
            : '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3 sm:gap-4">
          {/* Left section: Hamburger + Logo */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onMenuClick}
              className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Open Sidebar"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <Link
              to="/"
              onClick={() => { onSearchChange(''); setMobileSearchOpen(false); }}
              className="flex items-center gap-2 shrink-0 group min-h-[44px] pl-1"
            >
              <img src="/logo.png" alt="InkScroll" className="h-8 sm:h-9 w-auto" />
              <span className="hidden sm:inline font-logo text-lg sm:text-xl font-bold tracking-[0.15em] uppercase">
                <span className="text-white group-hover:text-white/90 transition-colors">Ink</span>
                <span className="text-crimson group-hover:text-crimson-light transition-colors">Scroll</span>
              </span>
            </Link>
          </div>

          {/* Desktop search bar */}
          <div className="relative w-full max-w-[420px] hidden sm:block">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search manga, manhwa, manhua..."
              value={localQuery}
              onChange={handleChange}
              id="navbar-search"
              className="w-full pl-11 pr-10 py-2.5 bg-elevated border border-line rounded-full text-sm text-txt-primary placeholder-txt-muted focus:outline-none focus:border-crimson/40 focus:ring-1 focus:ring-crimson/20 transition-all font-body"
            />
            {localQuery && (
              <button onClick={handleClear} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-txt-muted hover:text-txt-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Mobile search toggle */}
          <button
            className="sm:hidden text-white/80 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label="Search"
          >
            {mobileSearchOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>

          {/* Auth Section */}
          <div className="flex items-center gap-3 pr-1">
            {!user ? (
              <Link 
                to="/auth" 
                className="flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-white/20 hover:border-crimson hover:text-crimson transition-colors rounded-full text-xs sm:text-sm font-medium focus:outline-none whitespace-nowrap min-h-[36px] sm:min-h-[40px]"
              >
                Sign In
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-[34px] h-[34px] rounded-full border-2 border-transparent hover:border-crimson transition-all overflow-hidden flex items-center justify-center bg-crimson shadow-md text-white font-logo font-bold"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    profile?.username?.charAt(0).toUpperCase() || 'U'
                  )}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#111420] border border-white/10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden animate-fadeIn font-body text-sm z-[60]">
                    <div className="p-4 border-b border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-crimson overflow-hidden flex items-center justify-center shrink-0">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-logo font-bold">
                            {profile?.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{profile?.display_name || profile?.username}</p>
                        <p className="text-txt-muted text-xs truncate">@{profile?.username}</p>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-txt-secondary hover:text-white hover:bg-white/5 transition-colors">
                        My Profile
                      </Link>
                      <Link to="/profile?tab=list" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-txt-secondary hover:text-white hover:bg-white/5 transition-colors">
                        My List
                      </Link>
                      <Link to="/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-txt-secondary hover:text-white hover:bg-white/5 transition-colors">
                        Settings
                      </Link>
                    </div>

                    <div className="py-2 border-t border-white/10">
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }} 
                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile full-width search overlay */}
      {mobileSearchOpen && (
        <div className="fixed top-14 left-0 right-0 z-50 sm:hidden bg-primary/95 backdrop-blur-xl border-b border-line px-3 py-3 animate-fadeIn">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search manga, manhwa, manhua..."
              value={localQuery}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 bg-elevated border border-line rounded-full text-sm text-txt-primary placeholder-txt-muted focus:outline-none focus:border-crimson/40 transition-all font-body"
            />
            {localQuery && (
              <button onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-txt-muted hover:text-txt-primary min-h-[44px] min-w-[44px] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
