import { getReadingSources, groupSourcesByType } from '../data/readingSources';

const TYPE_STYLES = {
  official: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  aggregator: {
    bg: 'bg-gold/5',
    border: 'border-gold/20',
    text: 'text-gold',
    badge: 'bg-gold/15 text-gold',
  },
  scanlation: {
    bg: 'bg-crimson/5',
    border: 'border-crimson/20',
    text: 'text-crimson',
    badge: 'bg-crimson/15 text-crimson',
  },
};

export default function WhereToRead({ title, countryOfOrigin, externalLinks = [] }) {
  const sources = getReadingSources(title, countryOfOrigin, externalLinks);
  const groups = groupSourcesByType(sources);

  if (groups.length === 0) {
    return (
      <div className="text-center py-10 sm:py-12">
        <p className="text-txt-muted text-xs sm:text-sm">No reading sources found for this title.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {groups.map((group) => {
        const styles = TYPE_STYLES[group.sources[0]?.type] || TYPE_STYLES.official;
        return (
          <div key={group.label}>
            {/* Section label */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${styles.badge}`}>
                {group.label}
              </span>
              <div className="flex-1 h-px bg-line" />
            </div>

            {/* Source cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {group.sources.map((source) => (
                <a
                  key={source.name + source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl ${styles.bg} border ${styles.border} hover:border-opacity-50 transition-all duration-200 group hover:scale-[1.02] hover:shadow-lg min-h-[48px]`}
                >
                  {/* Icon */}
                  <span className="text-lg sm:text-xl shrink-0">
                    {source.iconUrl ? (
                      <img src={source.iconUrl} alt="" className="w-4 sm:w-5 h-4 sm:h-5" />
                    ) : (
                      source.icon
                    )}
                  </span>

                  {/* Name */}
                  <span className="flex-1 text-xs sm:text-sm font-medium text-txt-primary truncate">
                    {source.name}
                  </span>

                  {/* Arrow */}
                  <span className={`text-[11px] sm:text-xs font-medium ${styles.text} flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity shrink-0`}>
                    Search
                    <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      {/* Disclaimer */}
      <p className="text-[10px] sm:text-[11px] text-txt-muted text-center pt-3 sm:pt-4 border-t border-line">
        Links open search results on external sites. For personal use only.
      </p>
    </div>
  );
}
