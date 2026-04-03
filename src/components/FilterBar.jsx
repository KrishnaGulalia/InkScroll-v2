import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TYPES = [
  { label: 'All', value: 'ALL' },
  { label: 'Manhwa', value: 'KR', param: 'country' },
  { label: 'Manga', value: 'JP', param: 'country' },
  { label: 'Manhua', value: 'CN', param: 'country' }
];

const GENRES = [
  'All Genres', 'Action', 'Romance', 'Fantasy', 'Horror', 'Comedy',
  'Drama', 'Adventure', 'Mystery', 'Sci-Fi', 'Slice of Life',
  'Sports', 'Supernatural', 'Psychological', 'Historical'
];

const STATUSES = [
  { label: 'All Status', value: 'ALL' },
  { label: 'Releasing', value: 'RELEASING' },
  { label: 'Finished', value: 'FINISHED' },
  { label: 'Not Yet Released', value: 'NOT_YET_RELEASED' },
  { label: 'Hiatus', value: 'HIATUS' }
];

const SORTS = [
  { label: 'Trending', value: 'TRENDING_DESC' },
  { label: 'Most Popular', value: 'POPULARITY_DESC' },
  { label: 'Top Rated', value: 'SCORE_DESC' },
  { label: 'New Releases', value: 'START_DATE_DESC' },
  { label: 'A to Z', value: 'TITLE_ROMAJI' },
  { label: 'Z to A', value: 'TITLE_ROMAJI_DESC' }
];

function CustomDropdown({ options, value, onChange, placeholder, width = 'w-40' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find((opt) => 
    typeof opt === 'string' ? opt === value : opt.value === value
  )?.label || (typeof value === 'string' && value !== 'ALL' && value !== 'All Genres' ? value : placeholder);

  return (
    <div className={`relative ${width}`} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#111420] border border-white/10 rounded-[10px] text-[13px] font-body text-txt-primary hover:border-line-hover transition-colors"
      >
        <span className="truncate pr-2">{selectedLabel}</span>
        <ChevronDownIcon className={`w-3.5 h-3.5 text-txt-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-[#111420] border border-white/10 rounded-[10px] py-1.5 z-50 shadow-xl shadow-black/40 max-h-60 overflow-y-auto hide-scrollbar animate-fadeIn">
          {options.map((opt) => {
            const isString = typeof opt === 'string';
            const optValue = isString ? opt : opt.value;
            const optLabel = isString ? opt : opt.label;
            const isActive = value === optValue;

            return (
              <button
                key={optValue}
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-[13px] font-body transition-colors ${
                  isActive ? 'bg-crimson/10 text-crimson font-medium' : 'text-txt-secondary hover:bg-crimson/10 hover:text-txt-primary'
                }`}
              >
                {optLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FilterBar({ filters, onFilterChange, onClear, resultsCount }) {
  // Translate filters prop to local UI state representations
  const activeType = filters.country || 'ALL'; 
  const activeGenre = filters.genre || 'All Genres';
  const activeStatus = filters.status || 'ALL';
  const activeSort = filters.sort?.[0] || 'TRENDING_DESC';

  const hasActiveFilters = activeType !== 'ALL' || activeGenre !== 'All Genres' || activeStatus !== 'ALL' || activeSort !== 'TRENDING_DESC';

  return (
    <div className="flex flex-col gap-4 w-full animate-fadeIn mb-6">
      
      {/* Top Row: Type Pills & Results Count (if any) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-elevated/40 border border-line rounded-full">
          {TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => onFilterChange('country', type.value === 'ALL' ? null : type.value)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium font-body transition-all duration-200 ${
                activeType === type.value 
                  ? 'bg-crimson text-white shadow-md shadow-crimson/20' 
                  : 'text-txt-secondary hover:text-txt-primary'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        {resultsCount !== undefined && (
          <div className="text-[13px] font-body text-txt-muted font-medium px-2">
            {resultsCount.toLocaleString()} result{resultsCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Bottom Row: Dropdowns */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full">
        <CustomDropdown 
          options={GENRES} 
          value={activeGenre} 
          onChange={(val) => onFilterChange('genre', val === 'All Genres' ? null : val)} 
          placeholder="All Genres"
          width="w-full sm:w-44"
        />
        <CustomDropdown 
          options={STATUSES} 
          value={activeStatus} 
          onChange={(val) => onFilterChange('status', val === 'ALL' ? null : val)} 
          placeholder="All Status"
          width="w-full sm:w-40"
        />
        <CustomDropdown 
          options={SORTS} 
          value={activeSort} 
          onChange={(val) => onFilterChange('sort', val === 'ALL' ? null : [val])} 
          placeholder="Trending"
          width="w-full sm:w-44"
        />

        {hasActiveFilters && (
          <button 
            onClick={onClear}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 px-4 py-2 text-[13px] font-body font-medium text-crimson hover:text-crimson-light hover:bg-crimson/5 rounded-lg transition-colors ml-auto sm:ml-0 border border-crimson/20 sm:border-transparent mt-1 sm:mt-0"
          >
            <XMarkIcon className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>
      
    </div>
  );
}
