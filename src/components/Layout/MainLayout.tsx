import { Box } from '@mui/material';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: '24px',
          marginBottom: '80px', // Space for fixed footer
          border: '1px solid #1976d2',
          borderTop: 'none',
          borderBottom: 'none',
          marginX: 'auto',
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

