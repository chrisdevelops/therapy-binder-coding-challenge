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

