import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Palette, Users, FolderOpen, DollarSign } from 'lucide-react';

interface StatsCardsProps {
  totalArtworks: number;
  totalArtists: number;
  totalCategories: number;
  totalValue: number;
}

export function StatsCards({ totalArtworks, totalArtists, totalCategories, totalValue }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Artworks',
      value: totalArtworks,
      icon: Palette,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Artists',
      value: totalArtists,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Categories',
      value: totalCategories,
      icon: FolderOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Collection Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 