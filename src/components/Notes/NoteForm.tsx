import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material';
import { createSessionNote } from '../../lib/api';
import type { CreateSessionNoteInput, DurationMinutesInput } from '../../lib/types';

interface NoteFormProps {
  onSubmitSuccess: () => void;
}

export function NoteForm({ onSubmitSuccess }: NoteFormProps) {
  const [clientName, setClientName] = useState<string>('');
  const [sessionDate, setSessionDate] = useState<string>('');
  const [quickNotes, setQuickNotes] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<DurationMinutesInput>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Helper function to check if date is in the future
  const isDateInFuture = (dateString: string): boolean => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today to allow today's date
    return selectedDate > today;
  };

  const validateForm = (): boolean => {
    if (!clientName.trim()) {
      setError('Client name is required');
      return false;
    }

    if (!sessionDate) {
      setError('Session date is required');
      return false;
    }

    // Validate that the date is not in the future
    if (isDateInFuture(sessionDate)) {
      setError('Session date cannot be in the future');
      return false;
    }

    if (!quickNotes.trim()) {
      setError('Quick notes are required');
      return false;
    }

    if (quickNotes.length > 500) {
      setError('Quick notes must be 500 characters or less');
      return false;
    }

    if (durationMinutes === '' || durationMinutes < 15 || durationMinutes > 120) {
      setError('Duration must be between 15 and 120 minutes');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const input: CreateSessionNoteInput = {
        client_name: clientName.trim(),
        session_date: sessionDate,
        quick_notes: quickNotes.trim(),
        duration_minutes: durationMinutes as number,
      };
      await createSessionNote(input);

      // Reset form
      setClientName('');
      setSessionDate('');
      setQuickNotes('');
      setDurationMinutes('');
      setError(null);
      onSubmitSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create session note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create Session Note
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        margin="normal"
        required
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Session Date"
        type="date"
        value={sessionDate}
        onChange={(e) => setSessionDate(e.target.value)}
        margin="normal"
        required
        disabled={loading}
        inputProps={{
          max: new Date().toISOString().split('T')[0], // Set max date to today
        }}
        InputLabelProps={{
          shrink: true,
        }}
        helperText="Session date cannot be in the future"
        error={isDateInFuture(sessionDate)}
      />

      <TextField
        fullWidth
        label="Quick Notes"
        value={quickNotes}
        onChange={(e) => setQuickNotes(e.target.value)}
        margin="normal"
        required
        multiline
        rows={4}
        disabled={loading}
        helperText={`${quickNotes.length}/500 characters`}
        error={quickNotes.length > 500}
      />

      <TextField
        fullWidth
        label="Duration (minutes)"
        type="number"
        value={durationMinutes}
        onChange={(e) => {
          const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
          setDurationMinutes(val);
        }}
        margin="normal"
        required
        disabled={loading}
        inputProps={{
          min: 15,
          max: 120,
        }}
        helperText="Must be between 15 and 120 minutes"
        error={durationMinutes !== '' && (durationMinutes < 15 || durationMinutes > 120)}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Create Note'}
      </Button>
    </Box>
  );
}

