import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, Container, Box, Typography, createTheme } from '@mui/material';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f7fbfd' }
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif'
  }
});

function App() {
  const [refresh, setRefresh] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ py: 5 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
            CyberXplore Secure File Upload Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Upload and manage your documents. Files are scanned automatically for malware.
          </Typography>
        </Box>
        <FileUpload onUpload={() => setRefresh(r => !r)} />
        <Dashboard key={+refresh} />
      </Container>
    </ThemeProvider>
  );
}

export default App;