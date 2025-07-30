const API_URL = 'http://localhost:4000';

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const resp = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!resp.ok) throw new Error('Upload failed');
  return resp.json();
}

export async function fetchFiles() {
  const resp = await fetch(`${API_URL}/files`);
  if (!resp.ok) throw new Error('Cannot fetch files');
  return resp.json();
}