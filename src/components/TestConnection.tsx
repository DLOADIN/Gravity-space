import React, { useState } from 'react';
import { Button } from './ui/button';
import { api } from '../lib/api-client';

export function TestConnection() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState<any>(null);

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

  const testDashboardStats = async () => {
    try {
      setError('');
      const data = await api.get<any>('/dashboard/stats/test');
      setDashboardData(data);
      setMessage('Dashboard stats test successful!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dashboard stats test failed');
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Test Backend Connection</h3>
      <div className="space-y-2">
        <Button onClick={testConnection} className="mr-2">
          Test Basic Connection
        </Button>
        <Button onClick={testDashboardStats} variant="outline">
          Test Dashboard Stats
        </Button>
      </div>
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
      {dashboardData && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Dashboard Data:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(dashboardData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 