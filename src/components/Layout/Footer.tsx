import { Box, Typography } from '@mui/material';

export function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#ff9800',
        color: '#000',
        padding: '16px',
        textAlign: 'center',
        width: '100%',
        position: 'fixed',
        bottom: 0,
        left: 0,
      }}
    >
      <Typography variant="body1">Some goofy footer text</Typography>
    </Box>
  );
}

