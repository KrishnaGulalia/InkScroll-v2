import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useReadingList } from '../hooks/useReadingList';
import { CheckCircleIcon, PlusIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AddToListButton({ media }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    getListStatus, 
    getListItem, 
    addToList, 
    updateStatus, 
    removeFromList,
    updateProgress 
  } = useReadingList();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // If media isn't fully loaded yet
  if (!media || !media.id) return null;

  const status = getListStatus(media.id);
  const listItem = getListItem(media.id);

  const STATUS_OPTIONS = [
    { value: 'reading', label: 'Reading' },
    { value: 'plan_to_read', label: 'Plan to Read' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'dropped', label: 'Dropped' }
  ];

  const handleClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectStatus = async (val) => {
    try {
      if (!status) await addToList(media, val);
      else await updateStatus(media.id, val);
    } catch (err) {
      console.error(err);
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative z-50 w-full sm:w-auto">
      <button 
        onClick={handleClick}
        className={`w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-lg font-bold text-sm sm:text-base border transition-all flex items-center justify-center gap-2 min-h-[48px] sm:min-h-[44px] ${
          status 
            ? 'bg-card border border-line hover:border-line-hover text-white shadow-sm'
            : 'bg-transparent border border-white/20 hover:border-white/40 text-white/80 hover:text-white hover:bg-white/5'
        }`}
      >
        {status ? (
          <>
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span className="capitalize">{status.replace(/_/g, ' ')}</span>
            <ChevronDownIcon className="w-4 h-4 ml-2 text-txt-muted" />
          </>
        ) : (
          <>
            <PlusIcon className="w-5 h-5" />
            Add to List
          </>
        )}
      </button>

      {/* Current Progress Inline (shown if logged in and in list) */}
      {status && listItem && (
        <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
          <span className="text-[11px] sm:text-xs text-txt-muted uppercase font-bold tracking-widest hidden sm:inline-block">Progress:</span>
          <div className="flex items-center gap-2 bg-primary/80 backdrop-blur-md border border-line rounded-lg px-2 py-1">
            <span className="text-xs sm:text-sm font-mono text-white whitespace-nowrap">{listItem.current_chapter} <span className="text-txt-muted text-xs">/ {media.chapters || '?'}</span></span>
            <button 
              onClick={() => updateProgress(media.id, listItem.current_chapter + 1)}
              className="text-crimson hover:text-crimson-light p-1 rounded hover:bg-crimson/10 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Status Dropdown */}
      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none" onClick={() => setDropdownOpen(false)} />
          <div className="fixed sm:absolute bottom-0 sm:bottom-auto sm:top-full left-0 right-0 sm:right-auto mt-0 sm:mt-2 w-full sm:w-[180px] bg-[#111420] border-t sm:border border-white/10 rounded-t-2xl sm:rounded-xl shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.8)] sm:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] z-[110] overflow-hidden animate-slideUp sm:animate-fadeIn py-2 sm:py-1 pb-[env(safe-area-inset-bottom,16px)] sm:pb-1">
            {STATUS_OPTIONS.map(opt => (
              <button 
                key={opt.value}
                onClick={() => handleSelectStatus(opt.value)}
                className={`w-full text-left px-6 sm:px-4 py-4 sm:py-2.5 text-base sm:text-sm transition-colors min-h-[48px] sm:min-h-0 ${
                  status === opt.value ? 'bg-crimson/10 text-crimson font-medium' : 'text-txt-primary hover:bg-white/5'
                }`}
              >
                {opt.label}
              </button>
            ))}
            
            {status && (
              <>
                <div className="h-px bg-line my-1 mx-4 sm:mx-0" />
                <button 
                  onClick={async () => { await removeFromList(media.id); setDropdownOpen(false); }}
                  className="w-full text-left px-6 sm:px-4 py-4 sm:py-2.5 text-base sm:text-sm text-red-500 hover:bg-red-500/10 flex items-center justify-between transition-colors min-h-[48px] sm:min-h-0"
                >
                  Remove
                  <TrashIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
