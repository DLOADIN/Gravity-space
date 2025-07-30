import React, { useState, useEffect } from 'react';
import { ArtistSidebar } from '../components/ArtistSidebar';
import { StatsCards } from '../components/dashboard/StatsCards';
import { ArtworksByCategoryChart } from '../components/dashboard/ArtworksByCategoryChart';
import { MonthlyArtworksChart } from '../components/dashboard/MonthlyArtworksChart';
import { RecentArtworksTable } from '../components/dashboard/RecentArtworksTable';
import { useToast } from '../components/ui/use-toast';
import { api } from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api';

interface ArtistDashboardStats {
  total_artworks: number;
  total_sales: number;
  total_earnings: number;
  artworks_by_category: Array<{
    category_name: string;
    artwork_count: number;
  }>;
  recent_artworks: Array<{
    title: string;
    price: number;
    category_name: string;
    status: string;
    created_at: string;
  }>;
  monthly_sales: Array<{
    month: string;
    count: number;
  }>;
}

export default function ArtistDashboard() {
  const [stats, setStats] = useState<ArtistDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArtistDashboardStats();
  }, []);

  const fetchArtistDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<ArtistDashboardStats>(API_ENDPOINTS.dashboard.artistStats);
      setStats(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch artist dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex">
        <ArtistSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading artist dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <ArtistSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Artist Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your artistic journey.</p>
        </div>

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="mb-8">
              <StatsCards
                totalArtworks={stats.total_artworks}
                totalArtists={stats.total_sales}
                totalCategories={0} // Not relevant for artists
                totalValue={stats.total_earnings}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ArtworksByCategoryChart data={stats.artworks_by_category} />
              <MonthlyArtworksChart data={stats.monthly_sales} />
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