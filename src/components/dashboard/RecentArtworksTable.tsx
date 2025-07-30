import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface RecentArtwork {
  title: string;
  price: number;
  category_name: string;
  artist_name: string;
  created_at: string;
}

interface RecentArtworksTableProps {
  artworks: RecentArtwork[];
}

export function RecentArtworksTable({ artworks }: RecentArtworksTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Artworks</CardTitle>
      </CardHeader>
      <CardContent>
        {artworks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Title</th>
                  <th className="text-left py-2 font-medium">Artist</th>
                  <th className="text-left py-2 font-medium">Category</th>
                  <th className="text-left py-2 font-medium">Price</th>
                  <th className="text-left py-2 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {artworks.map((artwork, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{artwork.title}</td>
                    <td className="py-2">{artwork.artist_name || 'Unknown'}</td>
                    <td className="py-2">
                      <Badge variant="secondary">
                        {artwork.category_name || 'Uncategorized'}
                      </Badge>
                    </td>
                    <td className="py-2">${artwork.price.toLocaleString()}</td>
                    <td className="py-2 text-sm text-gray-500">
                      {new Date(artwork.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent artworks
          </div>
        )}
      </CardContent>
    </Card>
  );
} 