import React, { useState, useEffect } from 'react';
import { CollectorSidebar } from '../components/CollectorSidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { api } from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api';

interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  artist_id: number;
  category_name: string;
  artist_name: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface Artist {
  id: number;
  name: string;
}

export default function CollectorArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    artist_id: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchArtworks();
    fetchCategories();
    fetchArtists();
  }, []);

  const fetchArtworks = async () => {
    try {
      const data = await api.get<{ artworks: Artwork[] }>(API_ENDPOINTS.artworks);
      setArtworks(data.artworks);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch artworks',
        variant: 'destructive',
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get<{ categories: Category[] }>(API_ENDPOINTS.categories);
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArtists = async () => {
    try {
      const data = await api.get<{ artists: Artist[] }>(API_ENDPOINTS.artists);
      setArtists(data.artists);
    } catch (error) {
      console.error('Failed to fetch artists:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
        artist_id: formData.artist_id ? parseInt(formData.artist_id) : null,
      };
      
      if (editingArtwork) {
        await api.put(API_ENDPOINTS.artworks + `/${editingArtwork.id}`, payload);
        toast({
          title: 'Success',
          description: 'Artwork updated successfully',
        });
      } else {
        await api.post(API_ENDPOINTS.artworks, payload);
        toast({
          title: 'Success',
          description: 'Artwork created successfully',
        });
      }
      
      setFormData({ title: '', description: '', price: '', image_url: '', category_id: '', artist_id: '' });
      setEditingArtwork(null);
      fetchArtworks();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save artwork',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      description: artwork.description,
      price: artwork.price.toString(),
      image_url: artwork.image_url,
      category_id: artwork.category_id?.toString() || '',
      artist_id: artwork.artist_id?.toString() || ''
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    try {
      await api.delete(API_ENDPOINTS.artworks + `/${id}`);
      toast({
        title: 'Success',
        description: 'Artwork deleted successfully',
      });
      fetchArtworks();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete artwork',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditingArtwork(null);
    setFormData({ title: '', description: '', price: '', image_url: '', category_id: '', artist_id: '' });
  };

  return (
    <div className="flex">
      <CollectorSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Artworks</h1>
          <Button onClick={() => setEditingArtwork(null)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Artwork
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter artwork title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter artwork description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Enter artwork price"
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="artist">Artist</Label>
                  <Select value={formData.artist_id} onValueChange={(value) => setFormData({ ...formData, artist_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an artist" />
                    </SelectTrigger>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id.toString()}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (editingArtwork ? 'Update' : 'Create')}
                  </Button>
                  {editingArtwork && (
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
              <CardTitle>All Artworks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Title</th>
                      <th className="text-left py-2">Category</th>
                      <th className="text-left py-2">Artist</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artworks.map((artwork) => (
                      <tr key={artwork.id} className="border-b">
                        <td className="py-2">{artwork.title}</td>
                        <td className="py-2">{artwork.category_name || 'N/A'}</td>
                        <td className="py-2">{artwork.artist_name || 'N/A'}</td>
                        <td className="py-2">${artwork.price}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(artwork)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(artwork.id)}
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