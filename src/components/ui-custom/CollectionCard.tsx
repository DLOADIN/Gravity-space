import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LazyImage } from './LazyImage'

interface CollectionCardProps {
  title: string
  description: string
  imageUrl: string
  className?: string
}

export function CollectionCard({ 
  title, 
  description, 
  imageUrl,
  className 
}: CollectionCardProps) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-lg shadow-subtle hover-lift",
        className
      )}
    >
      <Link to={`/collections/${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="relative w-[300px] h-[300px] mx-auto">
          <LazyImage 
            src={imageUrl} 
            alt={title}
            aspectRatio="1/1"
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
            <h3 className="font-medium text-lg text-white mb-2">{title}</h3>
            <p className="text-sm text-white/90">{description}</p>
          </div>
        </div>
      </Link>
    </div>
  )
} 