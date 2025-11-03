import { Toolbar, Typography } from '@mui/material';

export function Header() {
  return (
    <>
      <Toolbar>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>
            Therapy Session
          </Typography>
          
        </Toolbar>
 
    </>
  );
}

