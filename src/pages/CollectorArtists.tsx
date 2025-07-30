import React, { useState, useEffect } from 'react';
import { CollectorSidebar } from '../components/CollectorSidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { api } from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api';

interface Artist {
  id: number;
  name: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  created_at: string;
}

export default function CollectorArtists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: '',
    phone: '',
    website: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const data = await api.get<{ artists: Artist[] }>(API_ENDPOINTS.artists);
      setArtists(data.artists);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch artists',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingArtist) {
        await api.put(API_ENDPOINTS.artists + `/${editingArtist.id}`, formData);
        toast({
          title: 'Success',
          description: 'Artist updated successfully',
        });
      } else {
        await api.post(API_ENDPOINTS.artists, formData);
        toast({
          title: 'Success',
          description: 'Artist created successfully',
        });
      }
      
      setFormData({ name: '', bio: '', email: '', phone: '', website: '' });
      setEditingArtist(null);
      fetchArtists();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save artist',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio,
      email: artist.email,
      phone: artist.phone,
      website: artist.website
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this artist?')) return;

    try {
      await api.delete(API_ENDPOINTS.artists + `/${id}`);
      toast({
        title: 'Success',
        description: 'Artist deleted successfully',
      });
      fetchArtists();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete artist',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditingArtist(null);
    setFormData({ name: '', bio: '', email: '', phone: '', website: '' });
  };

  return (
    <div className="flex">
      <CollectorSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Artists</h1>
          <Button onClick={() => setEditingArtist(null)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Artist
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingArtist ? 'Edit Artist' : 'Add New Artist'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter artist name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Enter artist bio"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter artist email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter artist phone"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="Enter artist website"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (editingArtist ? 'Update' : 'Create')}
                  </Button>
                  {editingArtist && (
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Artists</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Phone</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artists.map((artist) => (
                      <tr key={artist.id} className="border-b">
                        <td className="py-2">{artist.name}</td>
                        <td className="py-2">{artist.email}</td>
                        <td className="py-2">{artist.phone}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(artist)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(artist.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 