import { Layout } from '@/components/layout/Layout'
import { Section } from '@/components/ui-custom/Section'
import { useParams } from 'react-router-dom'

// This would typically come from an API
const getCategoryData = (slug: string) => {
  // Mock data - replace with actual API call
  return {
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: "Explore our curated collection",
    collections: [
      {
        id: "1",
        title: "Spring Collection",
        description: "Fresh and vibrant pieces",
        imageUrl: "/assets/images/collection1.jpg",
        pieces: 12
      },
      // Add more collections as needed
    ],
    featuredPieces: [
      {
        id: "1",
        title: "Abstract Harmony",
        artist: "Artist Name",
        imageUrl: "/assets/images/artwork1.jpg",
        price: "$1,200"
      },
      // Add more pieces as needed
    ]
  }
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const category = getCategoryData(slug || '')

  return (
    <Layout>
      <div className="page-transition">
        <Section className="section-padding py-24 bg-[#FFFFFF]">
          {/* Category Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-6xl font-bold tracking-tight mb-4">{category.name}</h1>
            <p className="text-xl text-gray-600">{category.description}</p>
          </div>

          {/* Collections Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-semibold mb-8">Featured Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.collections.map((collection) => (
                <div 
                  key={collection.id}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                >
                  <img 
                    src={collection.imageUrl}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="font-medium text-xl text-white mb-2">{collection.title}</h3>
                    <p className="text-sm text-white/90">{collection.description}</p>
                    <p className="text-sm text-white/90 mt-2">{collection.pieces} pieces</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Pieces Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-8">Featured Pieces</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {category.featuredPieces.map((piece) => (
                <div 
                  key={piece.id}
                  className="group"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                    <img 
                      src={piece.imageUrl}
                      alt={piece.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-medium text-lg mb-1">{piece.title}</h3>
                  <p className="text-sm text-gray-600">{piece.artist}</p>
                  <p className="text-sm font-medium mt-2">{piece.price}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </Layout>
  )
} 