import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReadingList } from '../hooks/useReadingList';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = [
  { value: 'reading', label: 'Reading' },
  { value: 'completed', label: 'Completed' },
  { value: 'plan_to_read', label: 'Plan to Read' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'dropped', label: 'Dropped' }
];

export default function Profile() {
  const { user, profile } = useAuth();
  const { list, loading, fetchMyList, updateStatus, updateProgress, updateRating, removeFromList } = useReadingList();
  
  const [activeTab, setActiveTab] = useState('list');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyList();
  }, [fetchMyList]);

  const stats = {
    all: list.length,
    reading: list.filter(i => i.status === 'reading').length,
    completed: list.filter(i => i.status === 'completed').length,
    plan_to_read: list.filter(i => i.status === 'plan_to_read').length,
    on_hold: list.filter(i => i.status === 'on_hold').length,
    dropped: list.filter(i => i.status === 'dropped').length,
  };

  const filteredList = filter === 'all' ? list : list.filter(i => i.status === filter);

  const getTypeLabel = (country) => {
    if (country === 'KR') return 'MANHWA';
    if (country === 'CN') return 'MANHUA';
    return 'MANGA';
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-primary">
      {/* Banner */}
      <div className="h-[200px] bg-gradient-to-r from-secondary via-crimson/20 to-crimson/40 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 -mt-12 relative z-10 pb-20">
        
        {/* Profile Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-[90px] h-[90px] rounded-full border-[3px] border-crimson bg-secondary shadow-lg overflow-hidden shrink-0 flex items-center justify-center text-2xl font-bold font-logo text-crimson-light">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.username?.charAt(0).toUpperCase()
              )}
            </div>
            
            {/* Name Details */}
            <div className="pb-1">
              <h1 className="font-logo text-2xl sm:text-3xl font-bold tracking-wide text-white">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-txt-muted text-sm font-medium tracking-wide">
                @{profile.username}
              </p>
            </div>
          </div>

          <Link
            to="/settings"
            className="px-5 py-2.5 bg-card hover:bg-elevated border border-line hover:border-line-hover text-txt-primary font-medium text-sm rounded-lg transition-colors flex justify-center w-full sm:w-auto"
          >
            Edit Profile
          </Link>
        </div>

        {/* Bio & Stats */}
        {profile.bio && (
          <p className="text-txt-secondary text-[15px] max-w-2xl text-center sm:text-left mb-6 whitespace-pre-wrap">
            {profile.bio}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-10">
          <button onClick={() => setFilter('reading')} className="px-4 py-1.5 rounded-full bg-crimson/10 border border-crimson/30 text-crimson text-sm font-medium hover:bg-crimson/20 transition-colors">
            {stats.reading} Reading
          </button>
          <button onClick={() => setFilter('completed')} className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-sm font-medium hover:bg-green-500/20 transition-colors">
            {stats.completed} Completed
          </button>
          <button onClick={() => setFilter('plan_to_read')} className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-500 text-sm font-medium hover:bg-blue-500/20 transition-colors">
            {stats.plan_to_read} Plan to Read
          </button>
          <button onClick={() => setFilter('on_hold')} className="px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm font-medium hover:bg-yellow-500/20 transition-colors">
            {stats.on_hold} On Hold
          </button>
        </div>

        {/* Major Tabs */}
        <div className="flex gap-8 border-b border-line mb-6">
          {['list', 'activity', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold tracking-widest uppercase transition-colors relative ${
                activeTab === tab ? 'text-crimson' : 'text-txt-muted hover:text-txt-secondary'
              }`}
            >
              {tab === 'list' ? 'My List' : tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-crimson" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'list' && (
          <div>
            {/* Filter Sub-nav */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
              {['all', ...STATUS_OPTIONS.map(o => o.value)].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    filter === f 
                      ? 'bg-card border-line text-white shadow-sm' 
                      : 'border-transparent text-txt-muted hover:bg-card/50 hover:text-txt-secondary'
                  }`}
                >
                  {f === 'all' ? 'All' : STATUS_OPTIONS.find(o => o.value === f)?.label}
                  <span className="ml-2 px-1.5 py-0.5 rounded-md bg-secondary text-[11px] font-bold">
                    {stats[f]}
                  </span>
                </button>
              ))}
            </div>

            {/* List Table/Grid */}
            {loading ? (
              <p className="text-txt-muted p-10 text-center animate-pulse">Loading list...</p>
            ) : filteredList.length === 0 ? (
              <div className="py-20 text-center bg-card/30 border border-line border-dashed rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                  <div className="text-2xl opacity-50">📚</div>
                </div>
                <h3 className="text-lg font-logo text-txt-primary mb-2">Your list is empty</h3>
                <p className="text-txt-muted mb-6 text-sm">Start discovering new manga to build your collection!</p>
                <Link to="/" className="px-6 py-2.5 bg-crimson hover:bg-crimson-light text-white font-medium rounded-lg transition-colors">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredList.map(item => (
                  <div key={item.id} className="group relative flex items-center gap-4 p-3 pr-4 bg-card hover:bg-elevated border border-line rounded-xl transition-all">
                    {/* Cover */}
                    <Link to={`/manga/${item.manga_id}`} className="shrink-0">
                      <img src={item.cover_image} alt={item.title} className="w-[44px] sm:w-[50px] aspect-[2/3] object-cover rounded shadow-md" />
                    </Link>

                    {/* Meta */}
                    <div className="flex-1 min-w-0 pr-4">
                      <Link to={`/manga/${item.manga_id}`} className="text-[15px] sm:text-base font-bold text-white line-clamp-1 hover:text-crimson transition-colors">
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold tracking-widest uppercase bg-secondary px-1.5 py-0.5 rounded text-txt-muted border border-line">
                          {getTypeLabel(item.country_of_origin)}
                        </span>
                        <span className="text-xs text-txt-muted whitespace-nowrap">
                          {new Date(item.added_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <select 
                          value={item.user_rating || ''}
                          onChange={(e) => updateRating(item.manga_id, parseInt(e.target.value))}
                          className="bg-transparent text-white font-medium focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-secondary">-</option>
                          {[10,9,8,7,6,5,4,3,2,1].map(n => <option key={n} value={n} className="bg-secondary">{n}</option>)}
                        </select>
                      </div>

                      {/* Progress */}
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-txt-secondary">
                          <span className="text-white font-medium">{item.current_chapter}</span> / {item.total_chapters || '?'}
                        </span>
                        <button 
                          onClick={() => updateProgress(item.manga_id, item.current_chapter + 1)}
                          className="p-1 hover:bg-secondary border border-line hover:border-line-hover rounded transition-colors text-txt-muted hover:text-white"
                          title="+1 Chapter"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Status */}
                      <select 
                        value={item.status}
                        onChange={(e) => updateStatus(item.manga_id, e.target.value)}
                        className="bg-secondary border border-line text-txt-primary text-[13px] px-3 py-1.5 rounded-lg focus:outline-none min-w-[120px] cursor-pointer"
                      >
                        {STATUS_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Delete logic overlay */}
                    <button 
                      onClick={() => removeFromList(item.manga_id)}
                      className="absolute right-0 top-0 bottom-0 px-4 bg-red-500/10 border-l border-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-xl flex items-center justify-center hover:bg-red-500 hover:text-white"
                      title="Remove from list"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab !== 'list' && (
          <div className="py-20 text-center bg-card/20 border border-line border-dashed rounded-2xl">
            <h3 className="text-lg font-logo text-txt-primary mb-2">Coming Soon</h3>
            <p className="text-txt-muted text-sm capitalize">{activeTab} tab is currently under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
}
