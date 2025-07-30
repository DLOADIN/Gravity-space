import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { api } from '@/lib/api-client'
import { API_ENDPOINTS } from '@/config/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ShoppingCart, Heart } from 'lucide-react'

export default function ArtworkDetails() {
  const { id, slug } = useParams()
  const { user } = useAuth()
  const { addToCart, state } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const navigate = useNavigate()

  const { data: artwork, isLoading } = useQuery<Artwork>({
    queryKey: ['artwork', id],
    queryFn: async () => {
      const response = await api.get<any>(`${API_ENDPOINTS.artworks}/${id}`)
      // Convert price from string to number
      return {
        ...response,
        price: Number(response.price),
      }
    },
  })

  // Verify that the current slug matches the artwork's title
  const expectedSlug = artwork?.title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')

  // If the slug doesn't match, redirect to the correct URL
  useEffect(() => {
    if (artwork && slug !== expectedSlug) {
      navigate(`/artwork/${id}/${expectedSlug}`)
    }
  }, [artwork, id, slug, expectedSlug])

  const isInCart = state.items.some((item) => item.artwork.id === id)

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-[600px] bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!artwork) {
    return (
      <Layout>
        <div className="container py-8">
          <Card className="p-6 text-center">
            <h1 className="text-2xl font-semibold mb-2">Artwork Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The artwork you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/browse">Browse Other Artworks</Link>
            </Button>
          </Card>
        </div>
      </Layout>
    )
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to add items to cart')
      return
    }
    addToCart(artwork, 1)
    toast.success('Added to cart')
  }

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please sign in to add items to wishlist')
      return
    }
    setIsWishlisted(!isWishlisted)
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    )
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square relative rounded-lg overflow-hidden">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Link
                  to={`/artists/${artwork.artist.id}`}
                  className="hover:text-primary"
                >
                  By {artwork.artist.name}
                </Link>
                <span>•</span>
                <Link
                  to={`/categories/${artwork.category.id}`}
                  className="hover:text-primary"
                >
                  {artwork.category.name}
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">
                  ${artwork.price.toLocaleString()}
                </p>
                {artwork.originalPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    ${artwork.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={isWishlisted ? 'fill-primary' : ''}
                  />
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {artwork.description}
              </p>
            </div>

            <Separator />

            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={artwork.artist.profileImageURL} />
                <AvatarFallback>
                  {artwork.artist.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  to={`/artists/${artwork.artist.id}`}
                  className="font-medium hover:text-primary"
                >
                  {artwork.artist.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {artwork.artist.bio}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={isInCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isInCart ? 'Added to Cart' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 