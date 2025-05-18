import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OpenAPI } from '../sdk/core/OpenAPI';

export default function GoogleCallback() {
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const name = params.get('name');
    if (token) {
      localStorage.setItem('token', token);
      if (name) localStorage.setItem('username', name);
      OpenAPI.TOKEN = token;
      window.location.href = '/'; // Redirect to main upload screen
    }
  }, []);

  return <div>Logging you in via Google...</div>;
}
