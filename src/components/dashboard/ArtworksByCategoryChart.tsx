import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ArtworksByCategory {
  category_name: string;
  artwork_count: number;
}

interface ArtworksByCategoryChartProps {
  data: ArtworksByCategory[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function ArtworksByCategoryChart({ data }: ArtworksByCategoryChartProps) {
  const chartData = data.map(item => ({
    name: item.category_name || 'Uncategorized',
    value: item.artwork_count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artworks by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
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