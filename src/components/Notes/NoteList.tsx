import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteSessionNote } from '../../lib/api';
import { useSessionNotes } from '../../hooks/useSessionNotes';

export function NoteList() {
  // Use the hook to fetch notes
  const { notes, loading, refetch } = useSessionNotes();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;

    setDeletingId(confirmDeleteId);
    setConfirmDeleteId(null);
    try {
      await deleteSessionNote(confirmDeleteId);
      // Refetch notes after successful deletion
      refetch();
    } catch (error) {
      console.error('Failed to delete note:', error);
      setDeleteError('Failed to delete note. Please try again.');
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setDeleteError(null);
  };

  const noteToDelete = notes.find((note) => note.id === confirmDeleteId);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (notes.length === 0) {
    return (
      <Alert severity="info">No session notes found. Create your first note to get started.</Alert>
    );
  }

  return (
    <Grid container spacing={2}>
      {notes.map((note) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={note.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                <Typography variant="h6" component="h3">
                  {note.client_name}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteClick(note.id)}
                  disabled={deletingId === note.id || !!confirmDeleteId}
                  aria-label="delete note"
                >
                  {deletingId === note.id ? <CircularProgress size={20} /> : <DeleteIcon />}
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date: {new Date(note.session_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Duration: {note.duration_minutes} minutes
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {note.quick_notes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Dialog
        open={!!confirmDeleteId}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Session Note
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {deleteError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            ) : null}
            Are you sure you want to delete the session note for{' '}
            <strong>{noteToDelete?.client_name}</strong> from{' '}
            {noteToDelete ? new Date(noteToDelete.session_date).toLocaleDateString() : ''}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={!!deletingId}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={!!deletingId}
            autoFocus
          >
            {deletingId ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

