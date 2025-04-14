import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export function BackendStatus() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHello() {
      setLoading(true);
      const response = await api.get<{ message: string }>('/hello');
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setMessage(response.data.message);
      }
      
      setLoading(false);
    }

    fetchHello();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Backend Connection Status</h2>
      {loading ? (
        <p>Connecting to backend...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div>
          <p>Backend says: <span className="font-bold">{message}</span></p>
          <p className="text-green-500 mt-2">✓ Connected successfully!</p>
        </div>
      )}
    </div>
  );
} 