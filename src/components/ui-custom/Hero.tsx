import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeroProps {
  className?: string
}

export function Hero({ 
  className,
}: HeroProps) {
  return (
    <div 
      className={cn(
        "relative min-h-[100vh] flex items-center py-12 md:py-20 overflow-hidden",
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/assets/images/download (29).jpg"
          alt="Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#f07128]/90" /> {/* Semi-transparent overlay */}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="max-w-2xl mx-auto lg:mx-0 lg:pl-6 text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium mb-4">
              Discover Unique Artworks
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 tracking-tight text-white">
              Discover and collect exceptional artwork
            </h1>
            
            <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
              Explore a curated selection of contemporary art from emerging and established artists around the world.
            </p>
          </div>

          <div className="relative w-full max-w-[600px] mx-auto lg:mx-0 lg:ml-auto lg:-mr-12 h-[100vh] lg:h-[120vh]">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-l-2xl lg:rounded-r-none shadow-2xl" />
            <img 
              src="/assets/images/download (29).jpg"
              alt="Featured Artwork"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%] rounded-l-2xl lg:rounded-r-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
