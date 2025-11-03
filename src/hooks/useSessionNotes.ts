import { useState, useEffect } from 'react';
import { getSessionNotes } from '../lib/api';
import type { UseSessionNotesReturn, SessionNote } from '../lib/types';

export function useSessionNotes(): UseSessionNotesReturn {
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotes = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessionNotes();
      setNotes(data);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Failed to fetch session notes');
      setError(error);
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchNotes();
  }, []);

  return {
    notes,
    loading,
    error,
    refetch: fetchNotes,
  };
}

