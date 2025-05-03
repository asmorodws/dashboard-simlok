import useSWR from 'swr';
import { supabase } from '../lib/supabaseClient';
import { CACHE_KEYS, CACHE_DURATIONS } from '../utils/cacheConfig';

// Fetcher function for SWR
const fetchSubmissions = async () => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export function useSubmissions() {
  const { data, error, mutate } = useSWR(
    CACHE_KEYS.SUBMISSIONS, 
    fetchSubmissions, 
    {
      revalidateOnFocus: false,
      dedupingInterval: CACHE_DURATIONS.SHORT,
      refreshInterval: CACHE_DURATIONS.SHORT,
    }
  );

  return {
    submissions: data,
    isLoading: !error && !data,
    isError: error,
    mutate, // Function to manually revalidate data
  };
}
