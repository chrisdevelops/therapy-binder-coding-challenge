import { supabase } from './supabase';
import { THERAPIST_ID } from './constants';
import type { SessionNote, NewSessionNoteInput } from './types';

export async function getSessionNotes(): Promise<SessionNote[]> {
  const { data, error } = await supabase
    .from('session_notes')
    .select('*')
    .order('session_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch session notes: ${error.message}`);
  }

  return data || [];
}

export async function createSessionNote(
  input: Omit<NewSessionNoteInput, 'therapist_id'>
): Promise<SessionNote> {
  const payload: NewSessionNoteInput = {
    therapist_id: THERAPIST_ID,
    client_name: input.client_name,
    session_date: input.session_date,
    quick_notes: input.quick_notes,
    duration_minutes: input.duration_minutes,
  };

  const { data, error } = await supabase
    .from('session_notes')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create session note: ${error.message}`);
  }

  return data;
}

export async function updateSessionNote(
  id: string,
  input: Omit<NewSessionNoteInput, 'therapist_id'>
): Promise<SessionNote> {
  const payload: Partial<NewSessionNoteInput> = {
    client_name: input.client_name,
    session_date: input.session_date,
    quick_notes: input.quick_notes,
    duration_minutes: input.duration_minutes,
  };

  const { data, error } = await supabase
    .from('session_notes')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update session note: ${error.message}`);
  }

  return data;
}

export async function deleteSessionNote(id: string): Promise<void> {
  const { error } = await supabase
    .from('session_notes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete session note: ${error.message}`);
  }
}

