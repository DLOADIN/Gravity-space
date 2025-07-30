import React, { useState, useEffect } from 'react';
import { CollectorSidebar } from '../components/CollectorSidebar';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ArtworksByCategoryChart } from '../components/dashboard/ArtworksByCategoryChart';
import { MonthlyArtworksChart } from '../components/dashboard/MonthlyArtworksChart';
import { RecentArtworksTable } from '../components/dashboard/RecentArtworksTable';
import { useToast } from '../components/ui/use-toast';
import { api } from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api';

interface DashboardStats {
  total_categories: number;
  total_artists: number;
  total_artworks: number;
  total_value: number;
  artworks_by_category: Array<{
    category_name: string;
    artwork_count: number;
  }>;
  recent_artworks: Array<{
    title: string;
    price: number;
    category_name: string;
    artist_name: string;
    created_at: string;
  }>;
  monthly_artworks: Array<{
    month: string;
    count: number;
  }>;
}

export default function CollectorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<DashboardStats>(API_ENDPOINTS.dashboard.stats);
      setStats(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex">
        <CollectorSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <CollectorSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Collector Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your art collection.</p>
        </div>

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="mb-8">
              <StatsCards
                totalArtworks={stats.total_artworks}
                totalArtists={stats.total_artists}
                totalCategories={stats.total_categories}
                totalValue={stats.total_value}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ArtworksByCategoryChart data={stats.artworks_by_category} />
              <MonthlyArtworksChart data={stats.monthly_artworks} />
            </div>

            {/* Recent Artworks */}
            <div className="mb-8">
              <RecentArtworksTable artworks={stats.recent_artworks} />
            </div>
          </>
        )}

        {!stats && (
          <div className="text-center py-12">
            <p className="text-gray-500">No data available. Start by adding some artworks!</p>
          </div>
        )}
      </div>
    </div>
  );
} 