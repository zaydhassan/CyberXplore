import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper,
  Chip, Typography, TablePagination, CircularProgress
} from '@mui/material';
import { fetchFiles } from '../api';

function statusColor(status: string, result: string | null) {
  if (status === 'pending') return 'warning';
  if (result === 'infected') return 'error';
  if (result === 'clean') return 'success';
  return 'default';
}

export default function Dashboard() {
  const [files, setFiles] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchFiles();
        if (active) setFiles(data);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Uploaded Files
      </Typography>
      <TableContainer sx={{ maxHeight: 360 }}>
        <Table size="small" stickyHeader>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Filename</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell>Scanned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : (
              files.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(file => (
                <TableRow key={file._id} hover>
                  <TableCell>
                    <Typography fontWeight={500}>{file.filename}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={file.status.toUpperCase()}
                      color={statusColor(file.status, file.result)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={file.result ? file.result.toUpperCase() : '-'}
                      color={statusColor(file.status, file.result)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {file.scannedAt ? new Date(file.scannedAt).toLocaleString() : '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        count={files.length}
        page={page}
        onPageChange={(_, pg) => setPage(pg)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
        component="div"
        sx={{ mt: 1 }}
      />
    </Paper>
  );
}