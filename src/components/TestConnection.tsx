import React, { useState } from 'react';
import { Button } from './ui/button';
import { api } from '../lib/api-client';

export function TestConnection() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const testConnection = async () => {
    try {
      setMessage('');
      setError('');
      const data = await api.get<{ message: string }>('/test');
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Test Backend Connection</h3>
      <Button onClick={testConnection} className="mb-2">
        Test Connection
      </Button>
      {message && (
        <div className="text-green-600 mb-2">
          Success: {message}
        </div>
      )}
      {error && (
        <div className="text-red-600 mb-2">
          Error: {error}
        </div>
      )}
    </div>
  );
} 