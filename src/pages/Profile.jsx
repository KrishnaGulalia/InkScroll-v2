import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReadingList } from '../hooks/useReadingList';
import { Link } from 'react-router-dom';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { fetchMediaGenres } from '../lib/anilist';

const STATUS_OPTIONS = [
  { value: 'reading', label: 'Reading', color: '#e63946' },
  { value: 'completed', label: 'Completed', color: '#22c55e' },
  { value: 'plan_to_read', label: 'Plan to Read', color: '#3b82f6' },
  { value: 'on_hold', label: 'On Hold', color: '#f59e0b' },
  { value: 'dropped', label: 'Dropped', color: '#6b7494' }
];

export default function Profile() {
  const { profile } = useAuth();
  const { list, loading, fetchMyList, updateStatus, updateProgress, updateRating, removeFromList } = useReadingList();
  
  const [activeTab, setActiveTab] = useState('list');
  const [filter, setFilter] = useState('all');
  const [genresMap, setGenresMap] = useState({});

  useEffect(() => {
    fetchMyList();
  }, [fetchMyList]);

  // Fetch missing genres for stats
  useEffect(() => {
    if (list.length > 0 && activeTab === 'stats') {
      const idsToFetch = list.map(i => i.manga_id).filter(id => !genresMap[id]);
      if (idsToFetch.length > 0) {
        fetchMediaGenres(idsToFetch).then(res => {
          setGenresMap(prev => ({ ...prev, ...res }));
        });
      }
    }
  }, [list, activeTab, genresMap]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-primary pb-20">
      <Banner profile={profile} />
      
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10 -mt-[50px]">
        <UserInfo profile={profile} />
        
        <div className="mt-12 hidden sm:block">
          <StatsRow list={list} filter={filter} setFilter={setFilter} setActiveTab={setActiveTab} />
        </div>
        
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-8 transition-opacity duration-300">
          {activeTab === 'list' && (
            <MyListTab 
              list={list} loading={loading} filter={filter} setFilter={setFilter}
              updateStatus={updateStatus} updateProgress={updateProgress} 
              updateRating={updateRating} removeFromList={removeFromList} 
            />
          )}
          {activeTab === 'stats' && <StatsTab list={list} genresMap={genresMap} />}
          {activeTab === 'activity' && <ActivityTab list={list} />}
        </div>
      </div>
    </div>
  );
}

function Banner({ profile }) {
  return (
    <div className="relative h-[260px] w-full overflow-hidden">
      {/* Animated gradient using CSS keys */}
      <div 
        className="absolute inset-0 bg-[length:200%_200%] animate-shimmer"
        style={{
          background: 'linear-gradient(135deg, #1a0508 0%, #2d0a10 30%, #0d0f1a 60%, #111420 100%)',
          backgroundSize: '400% 400%'
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
      
      <button className="absolute top-20 right-6 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white bg-black/20 hover:bg-black/40 border border-white/10 hover:border-white/20 rounded z-10 transition-colors">
        Edit Cover
      </button>
    </div>
  );
}

function UserInfo({ profile }) {
  const joinDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'Unknown';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-start gap-4 sm:gap-5">
      {/* Avatar overlapping banner */}
      <div 
        className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full bg-secondary shrink-0 relative flex justify-center items-center font-logo font-bold text-2xl sm:text-3xl text-crimson-light"
        style={{
          boxShadow: '0 0 0 2px #0d0f1a, 0 0 0 5px #e63946'
        }}
      >
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-crimson/20 to-crimson/5 flex items-center justify-center">
            {profile.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="mt-2 sm:mt-12 text-left sm:text-left flex-1">
        <h1 className="font-display font-bold text-[26px] text-white leading-tight">
          {profile.display_name || profile.username}
        </h1>
        <p className="font-body text-[14px] text-txt-secondary mt-0.5 tracking-wide">
          @{profile.username}
        </p>
        
        {profile.bio && (
          <p className="font-body text-[14px] text-txt-muted italic mt-3 max-w-xl line-clamp-2">
            {profile.bio}
          </p>
        )}
        
        <p className="text-[11px] text-txt-muted/60 mt-3 font-medium tracking-wide uppercase">
          Member since {joinDate}
        </p>
      </div>
    </div>
  );
}

function StatsRow({ list, filter, setFilter, setActiveTab }) {
  const counts = {
    all: list.length,
    reading: list.filter(i => i.status === 'reading').length,
    completed: list.filter(i => i.status === 'completed').length,
    plan_to_read: list.filter(i => i.status === 'plan_to_read').length,
    on_hold: list.filter(i => i.status === 'on_hold').length,
    dropped: list.filter(i => i.status === 'dropped').length,
  };

  const cards = [
    { label: 'Reading', key: 'reading', color: '#e63946', count: counts.reading },
    { label: 'Completed', key: 'completed', color: '#22c55e', count: counts.completed },
    { label: 'Plan to Read', key: 'plan_to_read', color: '#3b82f6', count: counts.plan_to_read },
    { label: 'On Hold', key: 'on_hold', color: '#f59e0b', count: counts.on_hold },
    { label: 'Dropped', key: 'dropped', color: '#6b7494', count: counts.dropped }
  ];

  const handleCardClick = (key) => {
    setActiveTab('list');
    setFilter(key);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map(c => (
        <button 
          key={c.key} 
          onClick={() => handleCardClick(c.key)}
          className={`flex flex-col items-center justify-center p-4 rounded-xl bg-card border transition-all duration-200 hover:-translate-y-1 ${
            filter === c.key ? 'border-line shadow-lg' : 'border-line hover:border-white/20'
          }`}
          style={{
            boxShadow: filter === c.key ? `0 0 20px -5px ${c.color}20` : 'none',
            borderColor: filter === c.key ? `${c.color}40` : ''
          }}
        >
          <span 
            className="font-logo font-bold text-[32px] leading-none mb-2"
            style={{ color: filter === c.key ? c.color : 'white' }}
          >
            {c.count}
          </span>
          <span className="font-body text-[11px] uppercase tracking-wider text-txt-muted font-bold">
            {c.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'list', label: 'My List' },
    { id: 'activity', label: 'Activity' },
    { id: 'stats', label: 'Stats' },
  ];

  return (
    <div className="mt-10 border-b border-line flex gap-8">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className={`relative pb-3 text-[13px] font-bold tracking-widest uppercase transition-colors ${
            activeTab === t.id ? 'text-white' : 'text-txt-muted hover:text-txt-secondary'
          }`}
        >
          {t.label}
          {activeTab === t.id && (
            <div className="absolute left-0 bottom-0 w-full h-[2px] bg-crimson shadow-[0_0_10px_rgba(230,57,70,0.5)]" />
          )}
        </button>
      ))}
    </div>
  );
}

function MyListTab({ list, loading, filter, setFilter, updateStatus, updateProgress, updateRating, removeFromList }) {
  const filteredList = filter === 'all' ? list : list.filter(i => i.status === filter);

  if (loading && list.length === 0) {
    return <div className="py-20 text-center animate-pulse text-txt-muted">Loading your scroll...</div>;
  }

  if (list.length === 0) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-center">
        {/* Empty state SVG */}
        <svg className="w-32 h-32 text-txt-muted/20 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="font-display text-2xl text-white font-bold mb-2">Your scroll is empty</h3>
        <p className="text-sm font-body text-txt-secondary mb-8">Start discovering titles to build your list.</p>
        <Link to="/" className="px-8 py-3 bg-crimson hover:bg-crimson-light text-white font-bold rounded-lg transition-colors shadow-lg shadow-crimson/20">
          Discover Now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 pt-2 snap-x -mx-4 sm:mx-0 px-4 sm:px-0">
        {['all', ...STATUS_OPTIONS.map(o => o.value)].map(f => {
          const count = f === 'all' ? list.length : list.filter(i => i.status === f).length;
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 snap-start min-h-[36px] px-4 py-2 rounded-full text-[13px] sm:text-sm font-medium transition-colors border flex items-center gap-2 ${
                isActive ? 'bg-card border-line text-white shadow-sm' : 'border-transparent text-txt-muted hover:bg-card/50 hover:text-txt-secondary'
              }`}
            >
              <span className="capitalize">{f.replace(/_/g, ' ')}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold leading-none ${isActive ? 'bg-white/10' : 'bg-card'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredList.map(item => (
          <ListCard 
            key={item.id} 
            item={item} 
            updateStatus={updateStatus} 
            updateProgress={updateProgress} 
            updateRating={updateRating} 
            removeFromList={removeFromList} 
          />
        ))}
        {filteredList.length === 0 && (
          <div className="py-12 text-center text-txt-muted text-sm border border-dashed border-line rounded-xl">
            No items found in this category.
          </div>
        )}
      </div>
    </div>
  );
}

function ListCard({ item, updateStatus, updateProgress, updateRating, removeFromList }) {
  const currStatusObj = STATUS_OPTIONS.find(o => o.value === item.status);
  
  return (
    <div className="group relative flex flex-col sm:flex-row bg-[#0d0f1a] border border-line rounded-xl p-3 gap-4 hover:border-line-hover hover:bg-[#111420] transition-colors overflow-hidden">
      
      {/* Main Info */}
      <div className="flex gap-4 flex-1 min-w-0">
        <Link to={`/manga/${item.manga_id}`} className="shrink-0 block w-[50px] aspect-[2/3] rounded overflow-hidden">
          <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
        </Link>
        <div className="flex-1 min-w-0 py-0.5">
          <Link to={`/manga/${item.manga_id}`} className="text-[14px] font-body font-semibold text-white truncate block hover:text-crimson transition-colors">
            {item.title}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-1.5 py-[2px] bg-white/5 border border-white/10 rounded text-[9px] font-bold text-txt-secondary tracking-wider uppercase">
              {item.country_of_origin}
            </span>
            <span className="text-[11px] text-txt-muted font-medium">
              {new Date(item.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-2.5 sm:gap-6 pt-3 border-t border-line sm:border-0 sm:pt-0 shrink-0">
        
        {/* Status */}
        <div className="relative w-full sm:w-auto">
          <select
            value={item.status}
            onChange={(e) => updateStatus(item.manga_id, e.target.value)}
            className="appearance-none w-full sm:w-auto bg-card border border-line text-[13px] sm:text-[12px] font-medium pl-3 pr-8 min-h-[36px] py-1.5 rounded-lg focus:outline-none cursor-pointer"
            style={{ color: currStatusObj?.color || 'white' }}
          >
            {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-txt-muted">
            <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        {/* Chapter Progress */}
        <div className="flex items-center justify-between sm:justify-start bg-card border border-line rounded-lg overflow-hidden min-h-[36px] sm:h-[32px] w-full sm:w-auto">
          <button 
            onClick={() => updateProgress(item.manga_id, Math.max(0, item.current_chapter - 1))}
            className="px-4 flex-1 sm:flex-none sm:px-2 h-[36px] sm:h-full hover:bg-white/5 text-txt-muted hover:text-white transition-colors border-r border-line flex items-center justify-center"
          >
            <MinusIcon className="w-4 h-4 sm:w-3 sm:h-3" />
          </button>
          <div className="px-3 text-[13px] sm:text-[12px] font-semibold text-white min-w-[90px] text-center font-mono py-1">
            Ch. {item.current_chapter} <span className="text-txt-muted font-normal">/ {item.total_chapters || '?'}</span>
          </div>
          <button 
            onClick={() => updateProgress(item.manga_id, item.current_chapter + 1)}
            className="px-4 flex-1 sm:flex-none sm:px-2 h-[36px] sm:h-full hover:bg-white/5 text-txt-muted hover:text-white transition-colors border-l border-line flex items-center justify-center"
          >
            <PlusIcon className="w-4 h-4 sm:w-3 sm:h-3" />
          </button>
        </div>

        {/* Rating & Delete row */}
        <div className="flex items-center gap-2">
          {/* Rating */}
          <div className="flex flex-1 items-center justify-between sm:justify-end bg-card sm:bg-transparent border border-line sm:border-transparent rounded-lg px-3 sm:px-0 py-1.5 sm:py-0 min-h-[36px] sm:min-h-0 gap-1.5 w-full sm:w-auto">
            <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gold shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <select
              value={item.user_rating || ''}
              onChange={(e) => updateRating(item.manga_id, parseInt(e.target.value) || null)}
              className="bg-transparent text-[14px] sm:text-[13px] flex-1 sm:flex-none w-full sm:w-auto font-mono font-bold text-white focus:outline-none cursor-pointer appearance-none text-right pr-2"
            >
              <option value="" className="bg-[#111420]">-</option>
              {[10,9,8,7,6,5,4,3,2,1].map(n => <option key={n} value={n} className="bg-[#111420]">{n}</option>)}
            </select>
          </div>

          {/* Mobile Delete Icon */}
          <button 
            onClick={() => removeFromList(item.manga_id)}
            className="sm:hidden min-h-[36px] w-[36px] flex items-center justify-center text-txt-muted hover:text-red-500 rounded-lg border border-line bg-card hover:bg-red-500/10 transition-colors shrink-0"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Desktop Delete Overlay */}
      <button 
        onClick={() => removeFromList(item.manga_id)}
        className="hidden sm:flex absolute right-0 top-0 bottom-0 w-12 bg-red-500/90 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-x-full group-hover:translate-x-0"
        title="Remove"
      >
        <TrashIcon className="w-5 h-5" />
      </button>

    </div>
  );
}

function StatsTab({ list, genresMap }) {
  const stats = useMemo(() => {
    const tracked = list.length;
    const chaptersRecord = list.reduce((acc, i) => acc + (i.current_chapter || 0), 0);
    const ratedItems = list.filter(i => i.user_rating);
    const avgRating = ratedItems.length > 0 ? (ratedItems.reduce((acc, i) => acc + i.user_rating, 0) / ratedItems.length).toFixed(1) : '-';
    const completedCount = list.filter(i => i.status === 'completed').length;
    const completionRate = tracked > 0 ? Math.round((completedCount / tracked) * 100) : 0;

    // Calculate favorites from genresMap
    const genreCounts = {};
    list.forEach(i => {
      const gList = genresMap[i.manga_id] || [];
      gList.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
    const sortedGenres = Object.entries(genreCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);

    // Status breakdown
    const bkd = { reading: 0, completed: 0, plan_to_read: 0, on_hold: 0, dropped: 0 };
    list.forEach(i => { if (bkd[i.status] !== undefined) bkd[i.status]++; });

    return { tracked, chaptersRecord, avgRating, completionRate, sortedGenres, bkd };
  }, [list, genresMap]);

  if (list.length === 0) {
    return <div className="py-20 text-center text-txt-muted">Add manga to your list to generate stats.</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top 4 Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Titles Tracked', val: stats.tracked, icon: '📚' },
          { label: 'Chapters Read', val: stats.chaptersRecord, icon: '📜' },
          { label: 'Avg Rating', val: stats.avgRating, icon: '⭐' },
          { label: 'Completion Rate', val: `${stats.completionRate}%`, icon: '📈' }
        ].map((s, i) => (
          <div key={i} className="bg-card border border-line rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <div className="text-2xl mb-2 grayscale opacity-80">{s.icon}</div>
            <div className="font-logo font-bold text-[32px] text-white leading-none tracking-tight mb-1">{s.val}</div>
            <div className="font-body text-[11px] text-txt-secondary uppercase tracking-widest font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Genre Breakdown */}
        <div className="bg-[#0d0f1a] border border-line rounded-2xl p-6">
          <h3 className="font-body text-[13px] font-bold text-white uppercase tracking-widest mb-6">Top Genres</h3>
          {stats.sortedGenres.length > 0 ? (
            <div className="space-y-4">
              {stats.sortedGenres.map(([genre, count], idx) => {
                const percent = Math.round((count / stats.tracked) * 100);
                return (
                  <div key={genre}>
                    <div className="flex justify-between text-[12px] font-semibold mb-1.5">
                      <span className="text-txt-primary">{genre}</span>
                      <span className="text-txt-muted">{count} ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-card rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-crimson-dark to-crimson rounded-full" style={{ width: `${Math.max(percent, 2)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-txt-muted text-sm">Loading genre metrics...</div>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-[#0d0f1a] border border-line rounded-2xl p-6 flex flex-col items-center justify-center">
          <h3 className="font-body text-[13px] font-bold text-white uppercase tracking-widest mb-6 self-start w-full">Status Breakdown</h3>
          
          <div className="relative w-[180px] h-[180px] rounded-full flex items-center justify-center p-2 border-4 border-card/20 shadow-xl"
            style={{
              background: `conic-gradient(
                #e63946 0% ${(stats.bkd.reading / list.length) * 100}%,
                #22c55e ${(stats.bkd.reading / list.length) * 100}% ${((stats.bkd.reading + stats.bkd.completed) / list.length) * 100}%,
                #3b82f6 ${((stats.bkd.reading + stats.bkd.completed) / list.length) * 100}% ${((stats.bkd.reading + stats.bkd.completed + stats.bkd.plan_to_read) / list.length) * 100}%,
                #f59e0b ${((stats.bkd.reading + stats.bkd.completed + stats.bkd.plan_to_read) / list.length) * 100}% ${((stats.bkd.reading + stats.bkd.completed + stats.bkd.plan_to_read + stats.bkd.on_hold) / list.length) * 100}%,
                #6b7494 ${((stats.bkd.reading + stats.bkd.completed + stats.bkd.plan_to_read + stats.bkd.on_hold) / list.length) * 100}% 100%
              )`
            }}
          >
            <div className="w-[125px] h-[125px] rounded-full bg-[#0d0f1a] shadow-inner" />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {[
              { id: 'reading', color: '#e63946' }, { id: 'completed', color: '#22c55e' },
              { id: 'plan_to_read', color: '#3b82f6' }, { id: 'on_hold', color: '#f59e0b' },
              { id: 'dropped', color: '#6b7494' }
            ].map(o => stats.bkd[o.id] > 0 && (
              <div key={o.id} className="flex items-center gap-2 text-[11px] font-bold text-txt-secondary uppercase tracking-widest">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: o.color }} />
                {o.id.replace(/_/g, ' ')} ({stats.bkd[o.id]})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ list }) {
  // Compute basic fake "timeline" sorting by updated_at date
  const activities = useMemo(() => {
    return [...list]
      .sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))
      .filter(i => new Date(i.updated_at).getTime() > 0)
      .slice(0, 50); // limit
  }, [list]);

  if (activities.length === 0) {
    return <div className="py-20 text-center text-txt-muted">No recent activity detected.</div>;
  }

  const timeAgo = (dateStr) => {
    const diffMs = new Date() - new Date(dateStr);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getActionText = (item) => {
    if (item.status === 'reading') return `Started reading`;
    if (item.status === 'completed') return `Finished`;
    if (item.status === 'plan_to_read') return `Added to Plan to Read`;
    if (item.status === 'dropped') return `Dropped`;
    if (item.status === 'on_hold') return `Put on hold`;
    return `Updated`;
  };

  return (
    <div className="max-w-[800px] mx-auto animate-fadeIn relative pl-4 border-l border-line sm:border-0 sm:pl-0 sm:block">
      <div className="space-y-6">
        {activities.map((item, idx) => (
          <div key={`${item.manga_id}-${idx}`} className="flex gap-4 relative">
            <div className="hidden sm:flex flex-col items-center mt-1 scale-x-[-1]">
              <div className="w-2 h-2 rounded-full bg-crimson shadow-[0_0_8px_rgba(230,57,70,0.8)]" />
              {idx !== activities.length -1 && <div className="w-[1px] h-full bg-line mt-2" />}
            </div>
            
            <div className="w-8 h-8 rounded shrink-0 overflow-hidden mt-0.5 border border-white/10 hidden sm:block">
               <img src={item.cover_image} alt="cover" className="w-full h-full object-cover" />
            </div>

            {/* Mobile line timeline node */}
            <div className="sm:hidden absolute -left-[21px] top-4 w-[6px] h-[6px] rounded-full bg-crimson shadow-[0_0_6px_rgba(230,57,70,0.8)]" />

            <div className="flex-1 bg-card hover:bg-[#111420] border border-line p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-4">
                <p className="text-[14px] text-txt-primary leading-tight">
                  <span className="text-txt-secondary">{getActionText(item)}</span>{' '}
                  <Link to={`/manga/${item.manga_id}`} className="font-bold text-crimson hover:underline">
                    {item.title}
                  </Link>
                </p>
                <div className="shrink-0 text-[11px] font-mono font-medium text-txt-muted mt-0.5">
                  {timeAgo(item.updated_at)}
                </div>
              </div>
              
              {item.status === 'reading' && item.current_chapter > 0 && (
                <div className="mt-2 text-xs font-mono font-medium text-txt-muted bg-white/5 inline-flex px-2 py-1 rounded">
                  Progress: {item.current_chapter} {item.total_chapters ? `/ ${item.total_chapters}` : 'chapters'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
