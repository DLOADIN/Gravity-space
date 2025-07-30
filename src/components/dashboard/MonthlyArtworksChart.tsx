import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyArtwork {
  month: string;
  count: number;
}

interface MonthlyArtworksChartProps {
  data: MonthlyArtwork[];
}

export function MonthlyArtworksChart({ data }: MonthlyArtworksChartProps) {
  const chartData = data.map(item => ({
    month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    artworks: item.count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Artwork Additions</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="artworks" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
} 