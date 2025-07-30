import React, { useState, DragEvent } from 'react';
import { Button, Typography, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadFile } from '../api';

export default function FileUpload({ onUpload }: { onUpload: () => void }) {
  const [selected, setSelected] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; success: boolean } | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelected(e.target.files[0]);
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelected(e.dataTransfer.files[0]);
    }
  };
  const onUploadClick = async () => {
    if (!selected) return;
    setUploading(true);
    try {
      await uploadFile(selected);
      setMsg({ text: 'File uploaded!', success: true });
      setSelected(null);
      onUpload();
    } catch {
      setMsg({ text: 'Failed to upload.', success: false });
    }
    setUploading(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center',
        border: '2px dashed #1976d2',
        bgcolor: '#f5fafc',
        cursor: 'pointer',
        transition: 'border .2s',
        ':hover': { border: '2px solid #1976d2' }
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={onDrop}
    >
      <UploadFileIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        Drag &amp; drop, or click to browse
      </Typography>
      <input
        type="file"
        accept=".pdf,.docx,.jpg,.png"
        style={{ display: 'none' }}
        id="file-input"
        onChange={onFileChange}
      />
      <label htmlFor="file-input">
        <Button variant="outlined" component="span" sx={{ mt: 1 }}>
          Choose File
        </Button>
      </label>
      {selected && (
        <Typography sx={{ mt: 2, fontStyle: 'italic' }}>
          {selected.name}
        </Typography>
      )}
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        onClick={onUploadClick}
        disabled={!selected || uploading}
      >
        {uploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
      <Snackbar
        open={!!msg}
        autoHideDuration={2500}
        onClose={() => setMsg(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setMsg(null)}
          severity={msg?.success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {msg?.text}
        </Alert>
      </Snackbar>
    </Paper>
  );
}