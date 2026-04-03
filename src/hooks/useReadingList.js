import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useReadingList() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyList = useCallback(async () => {
    if (!user) return [];
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('reading_list')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;
      setList(data || []);
      return data || [];
    } catch (err) {
      console.error('Error fetching reading list:', err);
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToList = async (manga, status = 'reading') => {
    if (!user) throw new Error('Must be logged in to add to list');
    
    const title = manga.title?.english || manga.title?.romaji || manga.title?.native || 'Unknown Title';
    const cover_image = manga.coverImage?.extraLarge || manga.coverImage?.large || manga.coverImage?.medium || null;
    const item = {
      user_id: user.id,
      manga_id: manga.id,
      title,
      cover_image,
      country_of_origin: manga.countryOfOrigin,
      status,
      total_chapters: manga.chapters || null,
      current_chapter: 0,
      user_rating: null,
      updated_at: new Date().toISOString()
    };

    try {
      const { data, error: insertError } = await supabase
        .from('reading_list')
        .upsert(item, { onConflict: 'user_id,manga_id' })
        .select()
        .single();

      if (insertError) throw insertError;
      
      setList(prev => {
        const exists = prev.find(i => i.manga_id === manga.id);
        if (exists) return prev.map(i => i.manga_id === manga.id ? data : i);
        return [data, ...prev];
      });
      return data;
    } catch (err) {
      console.error('Error adding to list:', err);
      throw err;
    }
  };

  const removeFromList = async (mangaId) => {
    if (!user) return;
    try {
      const { error: delError } = await supabase
        .from('reading_list')
        .delete()
        .eq('user_id', user.id)
        .eq('manga_id', mangaId);

      if (delError) throw delError;
      setList(prev => prev.filter(i => i.manga_id !== mangaId));
    } catch (err) {
      console.error('Error removing from list:', err);
      throw err;
    }
  };

  const updateStatus = async (mangaId, status) => {
    if (!user) return;
    try {
      const { data, error: updError } = await supabase
        .from('reading_list')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('manga_id', mangaId)
        .select()
        .single();

      if (updError) throw updError;
      setList(prev => prev.map(i => i.manga_id === mangaId ? data : i));
      return data;
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  const updateProgress = async (mangaId, chapter) => {
    if (!user) return;
    try {
      const { data, error: updError } = await supabase
        .from('reading_list')
        .update({ current_chapter: chapter, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('manga_id', mangaId)
        .select()
        .single();

      if (updError) throw updError;
      setList(prev => prev.map(i => i.manga_id === mangaId ? data : i));
      return data;
    } catch (err) {
      console.error('Error updating progress:', err);
      throw err;
    }
  };

  const updateRating = async (mangaId, rating) => {
    if (!user) return;
    try {
      const { data, error: updError } = await supabase
        .from('reading_list')
        .update({ user_rating: rating, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('manga_id', mangaId)
        .select()
        .single();

      if (updError) throw updError;
      setList(prev => prev.map(i => i.manga_id === mangaId ? data : i));
      return data;
    } catch (err) {
      console.error('Error updating rating:', err);
      throw err;
    }
  };

  const getListStatus = (mangaId) => {
    const item = list.find(i => i.manga_id === mangaId);
    return item ? item.status : null;
  };

  const getListItem = (mangaId) => {
    return list.find(i => i.manga_id === mangaId) || null;
  };

  return {
    list,
    loading,
    error,
    fetchMyList,
    addToList,
    removeFromList,
    updateStatus,
    updateProgress,
    updateRating,
    getListStatus,
    getListItem
  };
}
