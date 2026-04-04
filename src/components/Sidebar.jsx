import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  XMarkIcon,
  HomeIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  StarIcon,
  CheckCircleIcon,
  Squares2X2Icon,
  GlobeAsiaAustraliaIcon,
  GlobeAmericasIcon,
  LanguageIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const DISCOVER_LINKS = [
  { label: 'Home', icon: HomeIcon, to: '/' },
  { label: 'Trending', icon: ArrowTrendingUpIcon, to: '/?sort=TRENDING_DESC' },
  { label: 'New Releases', icon: SparklesIcon, to: '/?sort=START_DATE_DESC' },
  { label: 'Top Rated', icon: StarIcon, to: '/?sort=SCORE_DESC' },
  { label: 'Completed', icon: CheckCircleIcon, to: '/?status=FINISHED' },
];

const BROWSE_LINKS = [
  { label: 'All', icon: Squares2X2Icon, to: '/?type=ALL' },
  { label: 'Manhwa (KR)', icon: GlobeAsiaAustraliaIcon, to: '/?country=KR' },
  { label: 'Manga (JP)', icon: LanguageIcon, to: '/?country=JP' },
  { label: 'Manhua (CN)', icon: GlobeAmericasIcon, to: '/?country=CN' },
  { label: 'Webtoon', icon: ArrowsUpDownIcon, to: '/?format=WEBTOON' },
];

const GENRES = [
  'Action', 'Romance', 'Fantasy', 'Horror', 'Comedy', 
  'Drama', 'Adventure', 'Mystery', 'Sci-Fi', 'Slice of Life', 
  'Sports', 'Supernatural', 'Psychological', 'Historical'
];

export default function Sidebar({ isOpen, onClose }) {
  const [genresOpen, setGenresOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.search;
    return location.search === path.replace('/?', '?');
  };

  const NavItem = ({ item }) => {
    const active = isActive(item.to);
    const Icon = item.icon;
    
    return (
      <Link
        to={item.to}
        onClick={onClose}
        className={`flex items-center px-5 py-3 min-h-[48px] font-body text-[14px] sm:text-[15px] transition-all border-l-[3px] ${
          active
            ? 'text-crimson border-crimson bg-crimson/5 font-bold'
            : 'text-txt-secondary border-transparent hover:text-txt-primary hover:border-crimson hover:bg-white/5 font-medium'
        }`}
      >
        <Icon className="w-[18px] h-[18px] mr-3" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-full sm:w-[280px] bg-secondary border-r border-line z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header content / Logo / Close */}
        <div className="flex items-center justify-between p-4 border-b border-line shrink-0">
          <Link to="/" onClick={onClose} className="flex items-center gap-2 px-1">
            <img src="/logo.svg" alt="Logo" className="w-6 h-6" />
            <span className="font-logo text-xl font-bold tracking-widest text-[#eef0f8] mt-1">INKSCROLL</span>
          </Link>
          <button 
            onClick={onClose}
            className="p-2 text-txt-secondary hover:text-txt-primary hover:bg-white/5 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable nav items */}
        <div className="flex-1 overflow-y-auto py-4 hide-scrollbar">
          
          {/* DISCOVER */}
          <div className="mb-6">
            <h3 className="px-6 pb-2 text-[11px] font-body tracking-[0.1em] uppercase text-txt-muted font-bold">Discover</h3>
            <div className="flex flex-col">
              {DISCOVER_LINKS.map(link => <NavItem key={link.label} item={link} />)}
            </div>
          </div>

          {/* BROWSE BY TYPE */}
          <div className="mb-6">
            <h3 className="px-6 pb-2 text-[11px] font-body tracking-[0.1em] uppercase text-txt-muted font-bold">Browse By Type</h3>
            <div className="flex flex-col">
              {BROWSE_LINKS.map(link => <NavItem key={link.label} item={link} />)}
            </div>
          </div>

          {/* GENRES (Collapsible) */}
          <div className="mb-6">
            <button 
              onClick={() => setGenresOpen(!genresOpen)}
              className="w-full flex items-center justify-between px-6 py-2 min-h-[44px] cursor-pointer group focus:outline-none"
            >
              <h3 className="text-[11px] font-body tracking-[0.1em] uppercase text-txt-muted font-bold group-hover:text-txt-secondary transition-colors">Genres</h3>
              <ChevronDownIcon className={`w-4 h-4 text-txt-muted transition-transform duration-300 ${genresOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`flex justify-start flex-wrap gap-2 px-5 pt-2 overflow-hidden transition-all duration-300 ${genresOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              {GENRES.map(genre => (
                <Link
                  key={genre}
                  to={`/?genre=${encodeURIComponent(genre)}`}
                  onClick={onClose}
                  className="px-4 py-2 flex items-center justify-center min-h-[40px] rounded-lg bg-card border border-line text-[13px] font-medium text-txt-secondary hover:text-txt-primary hover:border-line-hover transition-colors font-body"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
