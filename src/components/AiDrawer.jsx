import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAIRecommendations } from '../lib/ai';
import { fetchMediaList } from '../lib/anilist';

const SUGGESTIONS = [
  'Something like Solo Leveling',
  'Dark romance manhwa',
  'Short completed manga',
  'Underrated gems',
];

function MiniCard({ media }) {
  const title = media.title?.english || media.title?.romaji || '';
  return (
    <Link
      to={`/manga/${media.id}`}
      className="group shrink-0 w-[120px] sm:w-[140px] block"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-lg sm:rounded-xl bg-card ring-1 ring-white/5 transition-all duration-300 group-hover:ring-crimson/30 group-hover:shadow-lg group-hover:shadow-crimson/10 group-hover:-translate-y-1">
        <img
          src={media.coverImage?.large || media.coverImage?.extraLarge}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <h4 className="text-[11px] sm:text-xs font-medium text-txt-primary mt-1.5 sm:mt-2 line-clamp-2 group-hover:text-crimson transition-colors">{title}</h4>
      <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
        {media.averageScore && (
          <span className="text-[10px] text-gold font-semibold">★ {(media.averageScore / 10).toFixed(1)}</span>
        )}
        <span className="text-[10px] text-txt-muted">{media.countryOfOrigin}</span>
      </div>
    </Link>
  );
}

function ShimmerCard() {
  return (
    <div className="shrink-0 w-[120px] sm:w-[140px]">
      <div className="aspect-[2/3] shimmer-bg rounded-lg sm:rounded-xl" />
      <div className="mt-1.5 sm:mt-2 h-3 shimmer-bg rounded w-3/4" />
      <div className="mt-1 h-2.5 shimmer-bg rounded w-1/2" />
    </div>
  );
}

export default function AiDrawer() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState('');
  const inputRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target) && !e.target.closest('#ai-fab')) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleSubmit = async (text) => {
    const prompt = text || query;
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setPhase('thinking');

    try {
      const titles = await getAIRecommendations(prompt);
      setPhase('searching');

      const searches = titles.map(async (title) => {
        try {
          const page = await fetchMediaList({ search: title, page: 1 });
          return page.media?.[0] || null;
        } catch {
          return null;
        }
      });

      const mediaResults = (await Promise.all(searches)).filter(Boolean);

      const seen = new Set();
      const unique = mediaResults.filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });

      setResults(unique);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setPhase('');
    }
  };

  return (
    <>
      {/* Floating AI FAB */}
      <button
        id="ai-fab"
        onClick={() => setOpen(true)}
        className="fixed right-4 sm:right-6 z-50 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-crimson hover:bg-crimson-hover text-white shadow-lg shadow-crimson/30 hover:shadow-crimson/50 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-pulseGlow"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        aria-label="AI Recommendations"
      >
        <span className="text-lg sm:text-xl font-bold">✦</span>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 z-[70] h-[70vh] sm:h-[480px] max-h-[85vh] bg-secondary border-t border-line rounded-t-2xl shadow-2xl shadow-black/60 transition-transform duration-300 ease-out flex flex-col ${open ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pb-2 sm:pb-3 shrink-0">
          <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-txt-primary">
            <span className="text-crimson text-lg sm:text-xl">✦</span>
            Ask AI
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="text-txt-muted hover:text-txt-primary transition-colors p-2 rounded-lg hover:bg-elevated min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Input */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 shrink-0">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you in the mood for?"
                className="w-full px-4 sm:px-5 py-3 sm:py-3.5 pr-12 sm:pr-14 bg-elevated border border-line rounded-xl text-sm text-txt-primary placeholder-txt-muted focus:outline-none focus:border-crimson/40 focus:ring-1 focus:ring-crimson/20 transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-crimson/10 hover:bg-crimson/20 rounded-lg text-crimson disabled:text-txt-muted disabled:bg-transparent transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Suggested prompts */}
        {!loading && results.length === 0 && !error && (
          <div className="px-4 sm:px-6 pb-3 sm:pb-4 shrink-0">
            <p className="text-[10px] text-txt-muted uppercase tracking-widest mb-2 sm:mb-2.5 font-medium">Try asking</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); handleSubmit(s); }}
                  className="text-[11px] sm:text-xs px-3 sm:px-4 py-2 rounded-full bg-elevated text-txt-secondary hover:text-crimson hover:bg-crimson/10 border border-line hover:border-crimson/20 transition-all duration-200 min-h-[36px]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
          {/* Loading state */}
          {loading && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 py-2">
                <div className="w-4 h-4 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin" />
                <span className="text-sm text-txt-secondary">
                  {phase === 'thinking' ? 'AI is thinking...' : 'Searching AniList...'}
                </span>
              </div>
              <div className="flex gap-3 sm:gap-4 overflow-hidden">
                {[1, 2, 3].map((i) => (
                  <ShimmerCard key={i} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="py-6 text-center">
              <p className="text-crimson/80 text-sm">{error}</p>
              <button
                onClick={() => handleSubmit()}
                className="mt-3 text-xs text-crimson hover:text-crimson-light underline transition-colors min-h-[44px]"
              >
                Try again
              </button>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div>
              <p className="text-[10px] text-txt-muted uppercase tracking-widest mb-2 sm:mb-3 font-medium">
                {results.length} recommendation{results.length !== 1 ? 's' : ''}
              </p>
              <div className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                {results.map((media) => (
                  <MiniCard key={media.id} media={media} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
