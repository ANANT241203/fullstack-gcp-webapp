import React, { useState, useEffect } from 'react';
import { googleLogin, uploadFile, downloadFile } from './api';
import { io, Socket } from 'socket.io-client';
import { Button } from "./components/ui/button";
import { AuthService } from "./sdk/services/AuthService";
import { OpenAPI } from "./sdk/core/OpenAPI";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      AuthService.authControllerListFiles().then((res: any) => setFiles(res.files || []));
      // Set up socket.io for real-time updates
      const socket: Socket = io('http://localhost:3000');
      socket.on('fileUploaded', (payload: { filename: string }) => {
        setFiles((prev) => [...prev, payload.filename]);
        setMessage(`File uploaded: ${payload.filename}`);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await AuthService.authControllerLogin(username, password);
      if (res.access_token) {
        setToken(res.access_token);
        setMessage('Login successful');
        OpenAPI.TOKEN = res.access_token; // <-- Add this line
      } else {
        setMessage(res.message || 'Login failed');
      }
    } catch (err: any) {
      setMessage('Login failed');
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    const res = await googleLogin('dummy-google-token');
    if (res.access_token) {
      setToken(res.access_token);
      setMessage('Google login successful');
      OpenAPI.TOKEN = res.access_token; // <-- Add this line
    } else {
      setMessage(res.message || 'Google login failed');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file && token) {
      const res = await uploadFile(file, token);
      setMessage(res.message);
      if (res.filename) setFiles((prev) => [...prev, res.filename]);
    }
  };

  const handleDownload = async (filename: string) => {
    if (!token) return;
    const res = await downloadFile(filename, token);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Full Stack Webapp Demo</h1>
      {!token ? (
        <>
          <form onSubmit={handleLogin} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border rounded px-2 py-1"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border rounded px-2 py-1"
            />
            <Button type="submit">Login</Button>
          </form>
          <Button onClick={handleGoogleLogin} className="mt-2" variant="secondary">
            Login with Google (Mock)
          </Button>
        </>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <Button onClick={() => {
              setToken(null);
              OpenAPI.TOKEN = undefined; // <-- Add this line
            }} variant="destructive">Logout</Button>
          </div>
          <form onSubmit={handleUpload} className="flex gap-2 items-center">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
              className="border rounded px-2 py-1"
            />
            <Button type="submit">Upload</Button>
          </form>
          <h2 className="mt-4 mb-2 text-lg font-semibold">Files</h2>
          <ul className="space-y-1">
            {files.map((f) => (
              <li key={f} className="flex items-center gap-2">
                {f}
                <Button size="sm" variant="outline" onClick={() => handleDownload(f)}>
                  Download
                </Button>
              </li>
            ))}
          </ul>
        </>
      )}
      {message && <div className="mt-4 text-green-600">{message}</div>}
    </div>
  );
}

export default App;
