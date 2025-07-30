import React, { useState, useEffect } from 'react';
import { ArtistSidebar } from '../components/ArtistSidebar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../components/ui/use-toast';
import { Search, ShoppingCart, Eye } from 'lucide-react';
import { api } from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api';

interface MarketplaceArtwork {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category_name: string;
  artist_name: string;
  seller_name: string;
  status: string;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ArtistMarketplace() {
  const [artworks, setArtworks] = useState<MarketplaceArtwork[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<MarketplaceArtwork[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMarketplaceArtworks();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterArtworks();
  }, [artworks, searchTerm, selectedCategory, priceRange]);

  const fetchMarketplaceArtworks = async () => {
    try {
      setIsLoading(true);
      const data = await api.get<{ artworks: MarketplaceArtwork[] }>(API_ENDPOINTS.marketplace + '/available');
      setArtworks(data.artworks);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch marketplace artworks',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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

  const filterArtworks = () => {
    let filtered = artworks.filter(artwork => artwork.status === 'available');

    if (searchTerm) {
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(artwork => artwork.category_name === selectedCategory);
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(artwork => {
        if (max) {
          return artwork.price >= min && artwork.price <= max;
        }
        return artwork.price >= min;
      });
    }

    setFilteredArtworks(filtered);
  };

  const handlePurchase = async (artworkId: number, price: number) => {
    if (!confirm(`Are you sure you want to purchase this artwork for $${price.toLocaleString()}?`)) {
      return;
    }

    try {
      await api.post(API_ENDPOINTS.transactions, {
        artwork_id: artworkId,
        amount: price,
        payment_method: 'credit_card',
        notes: 'Purchase from marketplace'
      });

      toast({
        title: 'Success',
        description: 'Purchase completed successfully!',
      });

      fetchMarketplaceArtworks();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete purchase',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex">
        <ArtistSidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading marketplace...</div>
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
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-600">Discover and purchase amazing artworks from other artists and collectors</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search artworks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Prices</SelectItem>
                    <SelectItem value="0-1000">Under $1,000</SelectItem>
                    <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="10000-">Over $10,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setPriceRange('');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden">
              {artwork.image_url && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{artwork.title}</h3>
                  <Badge variant="outline">{artwork.category_name}</Badge>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {artwork.description}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  by <span className="font-medium">{artwork.artist_name}</span>
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">
                    ${artwork.price.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePurchase(artwork.id, artwork.price)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Buy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No artworks found matching your criteria</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
} 