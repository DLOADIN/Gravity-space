import React, { useState, useEffect } from 'react';
import { ArtistSidebar } from '../components/ArtistSidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';
import { Pencil, Trash2, Plus, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { api } from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  external_link?: string;
  portfolio_type: string;
  created_at: string;
}

export default function ArtistPortfolio() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    external_link: '',
    portfolio_type: 'gallery'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const data = await api.get<{ portfolios: PortfolioItem[] }>(API_ENDPOINTS.portfolio + '/my-portfolio');
      setPortfolioItems(data.portfolios || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      setPortfolioItems([]);
      toast({
        title: 'Error',
        description: 'Failed to fetch portfolio items',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingItem) {
        await api.put(API_ENDPOINTS.portfolio + `/${editingItem.id}`, formData);
        toast({
          title: 'Success',
          description: 'Portfolio item updated successfully',
        });
      } else {
        await api.post(API_ENDPOINTS.portfolio, formData);
        toast({
          title: 'Success',
          description: 'Portfolio item created successfully',
        });
      }
      
      setFormData({ title: '', description: '', image_url: '', external_link: '', portfolio_type: 'gallery' });
      setEditingItem(null);
      fetchPortfolioItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save portfolio item',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      external_link: item.external_link || '',
      portfolio_type: item.portfolio_type
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      await api.delete(API_ENDPOINTS.portfolio + `/${id}`);
      toast({
        title: 'Success',
        description: 'Portfolio item deleted successfully',
      });
      fetchPortfolioItems();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete portfolio item',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', image_url: '', external_link: '', portfolio_type: 'gallery' });
  };

  const getPortfolioTypeColor = (type: string) => {
    switch (type) {
      case 'gallery':
        return 'bg-blue-100 text-blue-800';
      case 'exhibition':
        return 'bg-green-100 text-green-800';
      case 'award':
        return 'bg-yellow-100 text-yellow-800';
      case 'publication':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex">
      <ArtistSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Portfolio</h1>
          <Button onClick={() => setEditingItem(null)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Portfolio Item
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter portfolio item title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter portfolio item description"
                    rows={3}
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
                  <Label htmlFor="external_link">External Link</Label>
                  <Input
                    id="external_link"
                    value={formData.external_link}
                    onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
                    placeholder="Enter external link (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio_type">Type</Label>
                  <Select value={formData.portfolio_type} onValueChange={(value) => setFormData({ ...formData, portfolio_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select portfolio type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gallery">Gallery</SelectItem>
                      <SelectItem value="exhibition">Exhibition</SelectItem>
                      <SelectItem value="award">Award</SelectItem>
                      <SelectItem value="publication">Publication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Portfolio Items Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Portfolio Items</h2>
            <div className="grid grid-cols-1 gap-4">
              {portfolioItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  {item.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPortfolioTypeColor(item.portfolio_type)}`}>
                        {item.portfolio_type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    {item.external_link && (
                      <div className="mb-3">
                        <a
                          href={item.external_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View External Link
                        </a>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {portfolioItems.length === 0 && (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No portfolio items yet</p>
                <p className="text-sm text-gray-400 mt-2">Start building your portfolio by adding your best works</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 