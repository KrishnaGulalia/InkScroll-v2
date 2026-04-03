import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMediaList, fetchMediaDetail } from '../lib/anilist';

const SORT_MAP = {
  trending: ['TRENDING_DESC'],
  popular: ['POPULARITY_DESC'],
  score: ['SCORE_DESC'],
  latest: ['START_DATE_DESC'],
};

export function useMediaList(options = {}) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, currentPage: 1 });
  const [filters, setFilters] = useState({
    page: 1,
    sort: 'trending',
    genre: null,
    country: null,
    search: '',
    status: null,
  });

  // Debounced filters — actual API call uses these
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const debounceRef = useRef(null);

  // Debounce filter changes (400ms for search, immediate for others)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // If only the search text changed, debounce it
    const isSearchChange = filters.search !== debouncedFilters.search;
    const delayMs = isSearchChange ? 400 : 50;

    debounceRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, delayMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters]);

  // Fetch whenever debounced filters change
  useEffect(() => {
    if (options.skip) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const variables = {
      page: debouncedFilters.page,
      sort: SORT_MAP[debouncedFilters.sort] || ['TRENDING_DESC'],
    };
    if (debouncedFilters.genre) variables.genre = debouncedFilters.genre;
    if (debouncedFilters.country) variables.country = debouncedFilters.country;
    if (debouncedFilters.search) variables.search = debouncedFilters.search;
    if (debouncedFilters.status) variables.status = debouncedFilters.status;

    fetchMediaList(variables)
      .then(result => {
        if (cancelled) return;
        setMedia(prev => debouncedFilters.page > 1 ? [...prev, ...(result?.media || [])] : (result?.media || []));
        setPageInfo(result?.pageInfo || { hasNextPage: false, currentPage: 1 });
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        console.error('[useMediaList] Fetch error:', err.message);
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedFilters, options.skip]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const loadMore = useCallback(() => {
    if (pageInfo.hasNextPage) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pageInfo.hasNextPage]);

  return { media, loading, error, pageInfo, filters, updateFilters, loadMore };
}

export function useMediaDetail(id) {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMediaDetail(id)
      .then(data => {
        if (!cancelled) { setMedia(data); setLoading(false); }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('[useMediaDetail] Fetch error:', err.message);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [id]);

  return { media, loading, error };
}
