import React, { useState, useEffect } from 'react';
import { uploadFile, downloadFile } from './api';
import { io, Socket } from 'socket.io-client';
import { Button } from "./components/ui/button";
import { AuthService } from "./sdk/services/AuthService";
import { OpenAPI } from "./sdk/core/OpenAPI";
import GoogleCallback from './components/GoogleCallback';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GoogleLoginButton from './components/GoogleLoginButton';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // On mount, check for token in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      OpenAPI.TOKEN = storedToken;
    }
  }, []);

  useEffect(() => {
    if (token) {
      AuthService.authControllerListFiles().then((res: any) => setFiles(res.files || []));
      // Set up socket.io for real-time updates
      const socket: Socket = io('http://localhost:3000');
      socket.on('fileUploaded', (payload: { filename: string }) => {
        setFiles((prev) => prev.includes(payload.filename) ? prev : [...prev, payload.filename]);
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
        OpenAPI.TOKEN = res.access_token;
      } else {
        setMessage(res.message || 'Login failed');
      }
    } catch (err: any) {
      setMessage('Login failed');
      console.error('Login error:', err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file && token) {
      const res = await uploadFile(file, token);
      // Remove 'local only' or similar from the message
      let cleanMsg = res.message?.replace(/\s*\(local only\)/gi, '').trim();
      setMessage(cleanMsg);
      if (res.filename) setFiles((prev) => prev.includes(res.filename) ? prev : [...prev, res.filename]);
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
    <Router>
      {/* full-bleed gradient background */}
      <div className="min-h-screen w-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Content constrained for readability, but background fills the screen */}
        <div className="container mx-auto px-8">
          <header className="w-full py-4 flex items-center gap-4 bg-white/80 dark:bg-gray-900/80 shadow-md">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-blue-400 dark:from-pink-700 dark:to-blue-700 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-tight">Full Stack Webapp Demo</h1>
              <p className="text-gray-500 dark:text-gray-300 text-sm">Modern file management with Google & password login</p>
            </div>
          </header>
          <main className="w-full py-12 flex flex-col gap-8">
            {!token ? (
              <div className="w-full flex flex-col gap-8">
                <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-xl">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 shadow-sm text-base dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 shadow-sm text-base dark:bg-gray-800 dark:text-white"
                  />
                  <Button type="submit" className="w-full py-2 text-lg font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-md transition">Login</Button>
                </form>
                <div className="flex items-center w-full max-w-xl">
                  <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700" />
                  <span className="mx-3 text-gray-400 text-sm">or</span>
                  <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700" />
                </div>
                <div className="w-full max-w-xl">
                  <GoogleLoginButton />
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-8">
                <div className="flex justify-between items-center mb-4 w-full max-w-2xl">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Welcome!</span>
                  <Button onClick={() => {
                    setToken(null);
                    OpenAPI.TOKEN = undefined;
                  }} variant="destructive" className="rounded-lg px-4 py-1 text-base">Logout</Button>
                </div>
                <form onSubmit={handleUpload} className="flex gap-2 items-center mb-4 w-full max-w-2xl">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                    className="border border-gray-300 rounded-lg px-2 py-1 bg-white/90 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
                  />
                  <Button type="submit" className="rounded-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-pink-500 transition">Upload</Button>
                </form>
                <h2 className="mb-2 text-lg font-bold text-gray-800 dark:text-gray-200 w-full max-w-2xl">Your Files</h2>
                <ul className="space-y-2 max-h-96 overflow-y-auto pr-1 w-full max-w-2xl">
                  {files.length === 0 && <li className="text-gray-400 italic">No files uploaded yet.</li>}
                  {files.map((f) => (
                    <li key={f} className="flex items-center justify-between bg-white/90 dark:bg-gray-800 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition border border-gray-200 dark:border-gray-700 w-full">
                      <span className="truncate max-w-[600px] text-gray-700 dark:text-gray-100">{f}</span>
                      <Button size="sm" variant="outline" className="rounded-md px-3 py-1 text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-700" onClick={() => handleDownload(f)}>
                        Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {message && <div className="mt-6 text-center text-green-600 font-medium bg-green-50 dark:bg-green-900 dark:text-green-200 rounded-lg py-2 px-4 shadow-sm w-full max-w-2xl">{message}</div>}
          </main>
          <Routes>
            <Route path="/google/callback" element={<GoogleCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
