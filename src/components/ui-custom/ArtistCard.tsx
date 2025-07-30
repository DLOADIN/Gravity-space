
import { Link } from 'react-router-dom'
import { Artist } from '@/lib/data'
import { LazyImage } from './LazyImage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ArtistCardProps {
  artist: Artist
  variant?: 'default' | 'compact'
  className?: string
}

export function ArtistCard({ 
  artist, 
  variant = 'default',
  className 
}: ArtistCardProps) {
  
  if (variant === 'compact') {
    return (
      <Link 
        to={`/artists/${artist.id}`}
        className={cn(
          "flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors",
          className
        )}
      >
        <LazyImage 
          src={artist.profileImage || ''} 
          alt={artist.name}
          aspectRatio="1/1"
          containerClassName="h-12 w-12 rounded-full overflow-hidden"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{artist.name}</h4>
          <p className="text-xs text-muted-foreground">{artist.artworks.length} artworks</p>
        </div>
      </Link>
    )
  }
  
  // Default card
  return (
    <div 
      className={cn(
        "overflow-hidden rounded-lg hover-lift bg-white shadow-subtle",
        className
      )}
    >
      <Link to={`/artists/${artist.id}`}>
        <LazyImage 
          src={artist.profileImage || ''} 
          alt={artist.name}
          aspectRatio="1/1"
          containerClassName="w-full"
        />
        
        <div className="p-5">
          <h3 className="font-medium text-lg mb-2">{artist.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {artist.bio}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-3 text-sm">
              <span>{artist.artworks.length} artworks</span>
              <span>•</span>
              <span>{artist.followers} followers</span>
            </div>
            
            <Button variant="outline" size="sm">View Profile</Button>
          </div>
        </div>
      </Link>
    </div>
  )
}
