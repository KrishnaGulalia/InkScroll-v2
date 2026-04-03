import { Link } from 'react-router-dom';

const COUNTRY_FLAG = { JP: '🇯🇵', KR: '🇰🇷', CN: '🇨🇳', TW: '🇹🇼' };

export default function MediaCard({ media, index = 0, size = 'default' }) {
  const title = media.title?.english || media.title?.romaji || '';

  // Responsive widths: mobile=150, tablet=180, desktop=200 for large; or grid-based for default
  const sizeClasses = {
    large: 'w-[150px] sm:w-[180px] lg:w-[200px]',
    default: 'w-full',
  };

  return (
    <Link
      to={`/manga/${media.id}`}
      className={`group block shrink-0 ${sizeClasses[size] || sizeClasses.default} animate-fadeInUp`}
      style={{ animationDelay: `${Math.min(index * 40, 500)}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg sm:rounded-xl bg-card glow-crimson transition-transform duration-350 ease-out group-hover:-translate-y-2">
        {/* Cover image */}
        <img
          src={media.coverImage?.extraLarge || media.coverImage?.large}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Bottom gradient overlay for title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Score badge — top right */}
        {media.averageScore && (
          <div className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 bg-gold text-primary text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-lg">
            ★ {(media.averageScore / 10).toFixed(1)}
          </div>
        )}

        {/* Country flag badge — top left */}
        <div className="absolute top-1.5 sm:top-2.5 left-1.5 sm:left-2.5 bg-primary/70 backdrop-blur-sm text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-white/10">
          {COUNTRY_FLAG[media.countryOfOrigin] || media.countryOfOrigin}
        </div>

        {/* Hover overlay — View button (desktop only) */}
        <div className="absolute inset-0 bg-crimson/0 group-hover:bg-crimson/10 transition-colors duration-300 hidden sm:flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-crimson/90 backdrop-blur-sm text-white text-xs font-semibold px-5 py-2 rounded-full shadow-lg">
            ▶ View
          </span>
        </div>

        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>

      {/* Genre tags below card */}
      <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2 px-0.5">
        {media.genres?.slice(0, 2).map((g) => (
          <span key={g} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-elevated text-txt-muted">
            {g}
          </span>
        ))}
      </div>
    </Link>
  );
}
