const API_URL = 'http://localhost:3000/auth';

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function googleLogin(token: string) {
  const res = await fetch(`${API_URL}/google-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function uploadFile(file: File, token: string) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.json();
}

export async function listFiles(token: string) {
  const res = await fetch(`${API_URL}/files`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function downloadFile(filename: string, token: string) {
  const res = await fetch(`${API_URL}/files/${filename}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res;
}
