import { useState } from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NoteList } from './Notes/NoteList';
import { NoteForm } from './Notes/NoteForm';
import type { ViewMode } from '../lib/types';

export function ViewRenderer() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleCreateSuccess = () => {
    setViewMode('list');
    // NoteList will automatically refetch when it mounts/remounts
  };

  if (viewMode === 'create') {
    return (
      <Box>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setViewMode('list')}
          sx={{ mb: 2 }}
        >
          Back to List
        </Button>
        <NoteForm onSubmitSuccess={handleCreateSuccess} />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Session Notes</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setViewMode('create')}
        >
          Add Note
        </Button>
      </Box>
      <NoteList />
    </Box>
  );
}

