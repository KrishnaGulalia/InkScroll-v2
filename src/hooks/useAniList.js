import { useState, useEffect, useCallback } from 'react';
import { fetchMediaList, fetchMediaDetail } from '../lib/anilist';

const SORT_MAP = {
  trending: ['TRENDING_DESC'],
  popular: ['POPULARITY_DESC'],
  score: ['SCORE_DESC'],
  latest: ['START_DATE_DESC'],
};

export function useMediaList() {
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

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const variables = {
      page: filters.page,
      sort: SORT_MAP[filters.sort] || ['TRENDING_DESC'],
    };
    if (filters.genre) variables.genre = filters.genre;
    if (filters.country) variables.country = filters.country;
    if (filters.search) variables.search = filters.search;
    if (filters.status) variables.status = filters.status;

    fetchMediaList(variables)
      .then(result => {
        if (cancelled) return;
        setMedia(prev => filters.page > 1 ? [...prev, ...result.media] : result.media);
        setPageInfo(result.pageInfo);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters]);

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
        if (!cancelled) { setError(err.message); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [id]);

  return { media, loading, error };
}
