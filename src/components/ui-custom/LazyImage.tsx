
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  aspectRatio?: string
  containerClassName?: string
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  aspectRatio = '1/1',
  containerClassName,
  ...props 
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState('')

  useEffect(() => {
    setLoaded(false)
    
    const img = new Image()
    img.src = src
    
    img.onload = () => {
      setImageSrc(src)
      setLoaded(true)
    }
    
    return () => {
      img.onload = null
    }
  }, [src])

  return (
    <div 
      className={cn(
        "relative bg-muted overflow-hidden",
        containerClassName
      )}
      style={{ aspectRatio }}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            className
          )}
          {...props}
        />
      )}
    </div>
  )
}
