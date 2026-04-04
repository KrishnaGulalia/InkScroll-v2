import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMediaDetail } from '../hooks/useAniList';
import { DetailSkeleton } from '../components/Loader';
import WhereToRead from '../components/WhereToRead';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AddToListButton from '../components/AddToListButton';

const COUNTRY_LABEL = { JP: '🇯🇵 Manga', KR: '🇰🇷 Manhwa', CN: '🇨🇳 Manhua', TW: '🇹🇼 Manhua' };

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'tags', label: 'Tags' },
  { key: 'related', label: 'Related' },
  { key: 'read', label: 'Where to Read' },
];

export default function Detail() {
  const { id } = useParams();
  const { media, loading, error } = useMediaDetail(id);
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) return <DetailSkeleton />;
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16 gap-4 px-4">
      <p className="text-crimson text-base sm:text-lg">Failed to load</p>
      <p className="text-txt-muted text-xs sm:text-sm text-center">{error}</p>
      <Link to="/" className="text-crimson hover:underline text-sm min-h-[44px] flex items-center">← Back to Home</Link>
    </div>
  );
  if (!media) return null;

  const title = media.title?.english || media.title?.romaji || '';

  // Sort tags by rank, filter out spoilers
  const sortedTags = media.tags
    ?.filter((t) => !t.isMediaSpoiler)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 20) || [];

  return (
    <div className="min-h-screen animate-fadeIn overflow-x-hidden">
      {/* Banner */}
      <div className="relative h-[200px] sm:h-[300px] md:h-[380px]">
        {media.bannerImage ? (
          <img src={media.bannerImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: media.coverImage?.color || '#171b2e' }} />
        )}
        {/* Heavy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent hidden sm:block" />
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-primary to-transparent" />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-[60px] sm:top-[76px] left-3 sm:left-6 lg:left-8 z-20 flex items-center gap-1.5 sm:gap-2 text-txt-secondary hover:text-txt-primary transition-colors text-xs sm:text-sm bg-primary/30 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 rounded-lg border border-line min-h-[40px] sm:min-h-[44px]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      {/* Main content */}
      <div className="relative max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:-mt-36 md:-mt-44 z-10">
        {/* Mobile: centered cover + title below. Desktop: side by side */}
        <div className="flex flex-col items-center sm:items-start md:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Cover */}
          <div className="shrink-0 -mt-20 sm:mt-0 relative z-20">
            <img
              src={media.coverImage?.extraLarge}
              alt={title}
              className="w-[130px] sm:w-[180px] md:w-[220px] rounded-xl sm:rounded-2xl shadow-2xl shadow-black/80 border border-white/10 mx-auto sm:mx-0"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left pt-0 sm:pt-4 md:pt-6 w-full">
            <h1 className="font-display text-[22px] sm:text-2xl md:text-3xl lg:text-4xl font-bold text-txt-primary leading-tight tracking-wide italic">
              {title}
            </h1>
            {media.title?.native && (
              <p className="text-txt-muted text-xs sm:text-sm mt-1 sm:mt-1.5">{media.title.native}</p>
            )}

            {/* Score + Popularity — 2x2 grid on mobile, row on desktop */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-3 sm:mt-5">
              {media.averageScore && (
                <span className="flex items-center gap-1 sm:gap-1.5 bg-gold/15 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-gold font-bold text-xs sm:text-sm border border-gold/20">
                  <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-display text-lg sm:text-xl italic">{(media.averageScore / 10).toFixed(1)}</span>
                </span>
              )}
              {media.popularity && (
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-elevated text-txt-secondary text-[11px] sm:text-xs border border-line">
                  ♥ {media.popularity.toLocaleString()} users
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-3 sm:mt-3">
              <StatPill label={media.status?.replace(/_/g, ' ')} />
              {media.chapters && <StatPill label={`${media.chapters} ch`} />}
              {media.startDate?.year && <StatPill label={media.startDate.year} />}
              <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-crimson/15 text-crimson text-[11px] sm:text-xs font-semibold border border-crimson/20">
                {COUNTRY_LABEL[media.countryOfOrigin] || media.countryOfOrigin}
              </span>
            </div>

            {/* Genres */}
            <div className="flex overflow-x-auto hide-scrollbar sm:flex-wrap justify-start sm:justify-start gap-1.5 sm:gap-2 mt-4 sm:mt-4 pb-1 sm:pb-0 px-2 sm:px-0">
              {media.genres?.map((g) => (
                <span key={g} className="shrink-0 px-3 sm:px-3 py-1 sm:py-1 rounded-full bg-white/5 border border-line text-[12px] sm:text-xs text-txt-secondary whitespace-nowrap">
                  {g}
                </span>
              ))}
            </div>

            {/* Reading List Actions */}
            <div className="mt-5 sm:mt-6 flex justify-center sm:justify-start w-full relative px-2 sm:px-0">
              <AddToListButton media={media} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 sm:mt-8 md:mt-10 border-b border-line">
          <div className="flex gap-0 sm:gap-1 overflow-x-auto hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 sm:px-5 py-3 sm:py-3 text-[13px] sm:text-sm font-medium transition-all duration-200 whitespace-nowrap min-h-[44px] ${
                  activeTab === tab.key
                    ? 'text-crimson tab-active'
                    : 'text-txt-muted hover:text-txt-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-5 sm:mt-8 pb-16 sm:pb-20 animate-fadeIn" key={activeTab}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 sm:space-y-10">
              {/* Synopsis */}
              {media.description && (
                <section>
                  <h2 className="text-base sm:text-lg font-semibold text-txt-primary mb-2 sm:mb-3">Synopsis</h2>
                  <p className="text-txt-secondary leading-relaxed max-w-3xl text-xs sm:text-sm whitespace-pre-line">
                    {media.description.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')}
                  </p>
                </section>
              )}

              {/* Characters */}
              {media.characters?.nodes?.length > 0 && (
                <section>
                  <h2 className="text-base sm:text-lg font-semibold text-txt-primary mb-3 sm:mb-4">Characters</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-4">
                    {media.characters.nodes.map((c) => (
                      <div key={c.name.full} className="text-center group">
                        <div className="aspect-[2/3] overflow-hidden rounded-lg sm:rounded-xl bg-card ring-1 ring-white/5 transition-all duration-300 group-hover:ring-crimson/30 group-hover:shadow-lg group-hover:shadow-crimson/10">
                          <img
                            src={c.image.medium}
                            alt={c.name.full}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-txt-muted mt-1.5 sm:mt-2 line-clamp-1 group-hover:text-txt-secondary transition-colors">
                          {c.name.full}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Staff */}
              {media.staff?.nodes?.length > 0 && (
                <section>
                  <h2 className="text-base sm:text-lg font-semibold text-txt-primary mb-3 sm:mb-4">Staff</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    {media.staff.nodes.map((p) => (
                      <div key={p.name.full} className="flex items-center gap-2.5 sm:gap-3 bg-card/50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-line hover:border-line-hover transition-all group">
                        <img
                          src={p.image.medium}
                          alt={p.name.full}
                          className="w-10 sm:w-12 h-10 sm:h-12 object-cover rounded-lg bg-elevated ring-1 ring-white/10 shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-txt-primary truncate">{p.name.full}</p>
                          <p className="text-[11px] sm:text-xs text-txt-muted truncate">{p.primaryOccupations?.[0]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <div>
              {sortedTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {sortedTags.map((t) => (
                    <span
                      key={t.name}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all hover:scale-105 cursor-default"
                      style={{
                        backgroundColor: `rgba(230, 57, 70, ${Math.max(0.05, t.rank / 200)})`,
                        color: t.rank > 60 ? 'rgba(238,240,248,0.85)' : 'rgba(238,240,248,0.5)',
                        borderWidth: '1px',
                        borderColor: `rgba(230, 57, 70, ${Math.max(0.05, t.rank / 300)})`,
                      }}
                    >
                      {t.name}
                      <span className="text-crimson/70 ml-1.5 sm:ml-2 font-display text-sm sm:text-base">{t.rank}%</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-txt-muted text-xs sm:text-sm text-center py-10 sm:py-12">No tags available for this title.</p>
              )}
            </div>
          )}

          {/* Related Tab — horizontal scroll on mobile, grid on desktop */}
          {activeTab === 'related' && (
            <div>
              {media.relations?.nodes?.length > 0 ? (
                <>
                  {/* Mobile: horizontal scroll */}
                  <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 sm:hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
                    {media.relations.nodes.map((r) => {
                      const Wrapper = r.type === 'MANGA' ? Link : 'div';
                      const wrapperProps = r.type === 'MANGA' ? { to: `/manga/${r.id}` } : {};
                      return (
                        <Wrapper key={r.id} {...wrapperProps} className="group shrink-0 w-[110px]">
                          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-card ring-1 ring-white/5 group-hover:ring-crimson/30 transition-all">
                            <img
                              src={r.coverImage?.medium}
                              alt={r.title?.english || r.title?.romaji}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <p className="text-[11px] text-txt-muted mt-1.5 line-clamp-2">{r.title?.english || r.title?.romaji}</p>
                          <p className="text-[10px] text-txt-muted/60 uppercase mt-0.5">{r.format}</p>
                        </Wrapper>
                      );
                    })}
                  </div>

                  {/* Desktop: grid */}
                  <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {media.relations.nodes.map((r) => {
                      const Wrapper = r.type === 'MANGA' ? Link : 'div';
                      const wrapperProps = r.type === 'MANGA' ? { to: `/manga/${r.id}` } : {};
                      return (
                        <Wrapper key={r.id} {...wrapperProps} className="group">
                          <div className="aspect-[2/3] overflow-hidden rounded-xl bg-card ring-1 ring-white/5 transition-all duration-300 group-hover:ring-crimson/30 group-hover:shadow-lg group-hover:shadow-crimson/10 group-hover:-translate-y-1">
                            <img
                              src={r.coverImage?.medium}
                              alt={r.title?.english || r.title?.romaji}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                          <p className="text-xs text-txt-muted mt-2 line-clamp-2 group-hover:text-txt-secondary transition-colors">
                            {r.title?.english || r.title?.romaji}
                          </p>
                          <p className="text-[10px] text-txt-muted/60 uppercase mt-0.5">{r.format}</p>
                        </Wrapper>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-txt-muted text-xs sm:text-sm text-center py-10 sm:py-12">No related titles found.</p>
              )}
            </div>
          )}

          {/* Where to Read Tab */}
          {activeTab === 'read' && (
            <WhereToRead
              title={title}
              countryOfOrigin={media.countryOfOrigin}
              externalLinks={media.externalLinks || []}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatPill({ label }) {
  if (!label) return null;
  return (
    <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-elevated text-txt-muted text-[11px] sm:text-xs border border-line capitalize">
      {label}
    </span>
  );
}
