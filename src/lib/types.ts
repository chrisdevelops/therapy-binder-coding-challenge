export type SessionNote = {
  id: string;
  therapist_id: string;
  client_name: string;
  session_date: string; // YYYY-MM-DD
  quick_notes: string;
  duration_minutes: number;
  created_at: string;
};

export type NewSessionNoteInput = Omit<SessionNote, "id" | "created_at">;

export type CreateSessionNoteInput = Omit<NewSessionNoteInput, "therapist_id">;

export type UpdateSessionNoteInput = Partial<CreateSessionNoteInput>;

// UI Component Types
export type ViewMode = 'list' | 'create';

// Form Input Types
export type DurationMinutesInput = number | '';

// Error Types
export type ApiError = Error;

// Hook Return Types
export type UseSessionNotesReturn = {
  notes: SessionNote[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

