import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ searchQuery, onSearchChange }) {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const debounceRef = useRef(null);
  const mobileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  // Focus mobile input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-[60px] bg-primary/80 backdrop-blur-xl border-b border-line">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => { onSearchChange(''); setMobileSearchOpen(false); }}
            className="flex items-center gap-2 shrink-0 group min-h-[44px]"
          >
            <img src="/logo.png" alt="InkScroll" className="h-8 sm:h-9 w-auto" />
            <span className="hidden sm:inline font-heading text-lg sm:text-xl font-bold tracking-[0.15em] uppercase">
              <span className="text-white group-hover:text-white/90 transition-colors">Ink</span>
              <span className="text-crimson group-hover:text-crimson-light transition-colors">Scroll</span>
            </span>
          </Link>

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
              className="w-full pl-11 pr-10 py-2.5 bg-elevated border border-line rounded-full text-sm text-txt-primary placeholder-txt-muted focus:outline-none focus:border-crimson/40 focus:ring-1 focus:ring-crimson/20 transition-all"
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
            className="sm:hidden text-txt-secondary hover:text-txt-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
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
              className="w-full pl-10 pr-10 py-3 bg-elevated border border-line rounded-full text-sm text-txt-primary placeholder-txt-muted focus:outline-none focus:border-crimson/40 transition-all"
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
