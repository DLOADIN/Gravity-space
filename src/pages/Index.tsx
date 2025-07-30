import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/ui-custom/Hero'
import { Section } from '@/components/ui-custom/Section'
import { CollectionCard } from '@/components/ui-custom/CollectionCard'
import { ArtistCard } from '@/components/ui-custom/ArtistCard'
import { CategoryCard } from '@/components/ui-custom/CategoryCard'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { featuredArtists, categories } from '@/lib/data'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

// Collection data
const collections = [
  {
    title: "#style #art",
    description: "Contemporary fashion and artistic expression",
    imageUrl: "/assets/images/download (46).jpg"
  },
  {
    title: "Artist",
    description: "Celebrating creative visionaries",
    imageUrl: "/assets/images/download (45).jpg"
  },
  {
    title: "Avenue",
    description: "Creative content and design excellence",
    imageUrl: "/assets/images/e90dd457-abf3-40d6-86bc-270fda5e5fc7.jpg"
  }
]

const ARTWORKS = [
  // Nocturne Collection Pieces
  {
    id: 'n1',
    title: "ACTIVEGLOW",
    artist: "Elena Moonlight",
    price: 120,
    image: "/assets/images/N1.jpg",
    description: "Abstract blue waves with textured impasto technique"
  },
  {
    id: 'n2',
    title: "Blue Nude",
    artist: "Katrina Case",
    price: 95,
    image: "/assets/images/Blue Nude (2020) Oil painting by Katrina Case.jpg",
    description: "Oil painting, 2020"
  },
  {
    id: 'n3',
    title: "Humpback Whale",
    artist: "Elena Moonlight",
    price: 145,
    image: "/assets/images/N3.jpg",
    description: "Original oil painting with impasto technique, 6'' x 6''"
  },
  {
    id: 'n4',
    title: "Blue Waves",
    artist: "Jérôme Karsenti",
    price: 110,
    image: "/assets/images/N4.jpg",
    description: "Contemporary blue abstract waves"
  },
  {
    id: 'n5',
    title: "Venice Seascape",
    artist: "Kind of Cyan",
    price: 130,
    image: "/assets/images/Kind of Cyan - Venice Seascape Triptych, Blue Lido Island Reflections, Contemporary Cyanotype.jpg",
    description: "Blue Lido Island Reflections, Contemporary Cyanotype"
  },
  // Contemporary Still Life Collection Pieces
  {
    id: 'c1',
    title: "Market Day",
    artist: "Marcus Rivera",
    price: 110,
    image: "/assets/images/contemporary.jpg",
    description: "Contemporary still life of a traditional Rwandan market"
  },
  {
    id: 'c2',
    title: "Kitchen Stories",
    artist: "Marcus Rivera",
    price: 100,
    image: "/assets/images/contemporary.jpg",
    description: "Modern interpretation of traditional kitchen scenes"
  },
  {
    id: 'c3',
    title: "Harvest Time",
    artist: "Marcus Rivera",
    price: 125,
    image: "/assets/images/contemporary.jpg",
    description: "Abstract representation of agricultural life"
  },
  {
    id: 'c4',
    title: "Family Table",
    artist: "Marcus Rivera",
    price: 105,
    image: "/assets/images/contemporary.jpg",
    description: "Contemporary take on family dining traditions"
  },
  {
    id: 'c5',
    title: "Spice Market",
    artist: "Marcus Rivera",
    price: 115,
    image: "/assets/images/contemporary.jpg",
    description: "Vibrant depiction of local spice markets"
  },
  // Paintings Collection Pieces
  {
    id: 'p1',
    title: "Mountain Sunrise",
    artist: "Elena Moonlight",
    price: 130,
    image: "/assets/images/noturne.jpg",
    description: "Impressionist painting of Rwanda's mountains"
  },
  {
    id: 'p2',
    title: "Market Colors",
    artist: "Marcus Rivera",
    price: 110,
    image: "/assets/images/contemporary.jpg",
    description: "Colorful depiction of local market scenes"
  },
  {
    id: 'p3',
    title: "Village Life",
    artist: "Elena Moonlight",
    price: 115,
    image: "/assets/images/noturne.jpg",
    description: "Traditional village scenes in modern style"
  },
  {
    id: 'p4',
    title: "Coffee Harvest",
    artist: "Marcus Rivera",
    price: 120,
    image: "/assets/images/contemporary.jpg",
    description: "Celebration of Rwanda's coffee culture"
  },
  {
    id: 'p5',
    title: "City Rhythms",
    artist: "Elena Moonlight",
    price: 135,
    image: "/assets/images/noturne.jpg",
    description: "Urban life in contemporary Rwanda"
  }
];

export default function Index() {
  return (
    <Layout>
      <div className="page-transition">
        <Hero />
        
        {/* Artworks Grid */}
        <Section className="section-padding py-24 bg-white">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Browse All Artworks</h2>
              <p className="text-xl text-gray-600">Explore our complete collection of artworks</p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6">
                {ARTWORKS.length} {ARTWORKS.length === 1 ? 'Piece' : 'Pieces'} Available
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ARTWORKS.map((piece) => (
                  <Card key={piece.id} className="group overflow-hidden">
                    <CardHeader className="aspect-square bg-gray-100 flex items-center justify-center">
                      <img
                        src={piece.image}
                        alt={piece.title}
                        className="w-full h-full object-cover"
                      />
                    </CardHeader>
                    <CardContent className="pt-6">
                      <h4 className="font-medium text-lg mb-1">{piece.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{piece.artist}</p>
                      <p className="font-medium text-primary">
                        ${piece.price.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Collections */}
        <Section 
          contentClassName="flex flex-col gap-12"
          className="section-padding py-24 bg-[#FFFFFF]"
        >
          <div className="flex flex-col lg:flex-row gap-16 items-start bg-[#FFFFFF] min-h-[800px]">
            <div className="relative w-full lg:w-[600px] flex-shrink-0 overflow-hidden">
              <img 
                src="/assets/images/download.jpg" 
                alt="Collection Feature"
                className="w-full h-[800px] object-cover scale-110 object-left rounded-lg bg-[#FFFFFF]"
              />
            </div>

            <div className="flex flex-col gap-16 flex-1 bg-[#FFFFFF]">
              <div className="lg:pt-48">
                <h2 className="text-7xl font-bold tracking-tight mb-8">Collections</h2>
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Step into the world of phtographic art which blends traditional mastery with modern vision. Where one piece expresses so much using so little.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full bg-[#FFFFFF] mt-auto">
                {collections.map(collection => (
                  <CollectionCard 
                    key={collection.title}
                    title={collection.title}
                    description={collection.description}
                    imageUrl={collection.imageUrl}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>
        
        {/* Browse by Category */}
        <Section 
          contentClassName="flex flex-col gap-16"
          className="section-padding py-24 bg-[#FFFFFF]"
        >
          <div className="flex flex-col min-h-[800px]">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col lg:flex-row gap-12 items-start">
                <div className="flex-1">
                  <h2 className="text-7xl font-bold tracking-tight mb-8">Browse by Category</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                    Browse our curated collections by selecting your preferred category—whether you're drawn to bold abstract paintings, serene landscapes, striking portraits, or contemporary photography. Start your journey here, and let art that speaks to you find its way to your space.
                  </p>
                </div>
                <div className="w-full lg:w-[500px] h-[500px] flex-shrink-0 bg-[#FFFFFF] rounded-lg flex items-center justify-center">
                  <Link 
                    to="/categories/pieces/animation"
                    className="w-[500px] h-[500px] relative group"
                  >
                    <img 
                      src="/assets/images/animated.jpg"
                      alt="Animation"
                      className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center rounded-lg bg-black/60">
                      <h3 className="font-medium text-lg text-white mb-2">Animation</h3>
                      <p className="text-sm text-white/90">Explore animated artworks</p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
                <Link 
                  to="/categories/pieces/digital-art"
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                >
                  <img 
                    src="/assets/images/digital art.jpg"
                    alt="Digital Art"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="font-medium text-lg text-white mb-2">Digital Art</h3>
                    <p className="text-sm text-white/90">Digital creations and NFTs</p>
                  </div>
                </Link>
                <Link 
                  to="/categories/pieces/sculptures"
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                >
                  <img 
                    src="/assets/images/sculptures.jpg"
                    alt="Sculptures"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="font-medium text-lg text-white mb-2">Sculptures</h3>
                    <p className="text-sm text-white/90">3D artworks and sculptures</p>
                  </div>
                </Link>
                <Link 
                  to="/categories/pieces/literature"
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                >
                  <img 
                    src="/assets/images/literature.jpg"
                    alt="Literature"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="font-medium text-lg text-white mb-2">Literature</h3>
                    <p className="text-sm text-white/90">Written artistry and poetry</p>
                  </div>
                </Link>
                <Link 
                  to="/categories/pieces/fashion-design"
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                >
                  <img 
                    src="/assets/images/fashion design.jpg"
                    alt="Fashion Design"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="font-medium text-lg text-white mb-2">Fashion Design</h3>
                    <p className="text-sm text-white/90">Contemporary fashion art and design</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Section>
        
        {/* Upcoming Events Section */}
        <Section className="section-padding py-24 bg-white">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-xl text-gray-600">Join us for these exciting art events</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Main Event */}
              <Link to="/events/art-exhibition-2024" className="group">
                <div className="relative aspect-[16/18] rounded-xl overflow-hidden">
                  <img 
                    src="/assets/images/event.jpg"
                    alt="Art Exhibition 2024"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">Art Exhibition 2024</h3>
                    <p className="text-white/90">April 15-20, 2024</p>
                  </div>
                </div>
              </Link>

              {/* Side Events Grid */}
              <div className="grid grid-cols-2 gap-2">
                <Link to="/events/spring-arts-festival" className="group">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img 
                      src="/assets/images/event 3.jpg"
                      alt="Spring Arts Festival"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-bold text-white mb-1">Spring Arts Festival</h3>
                      <p className="text-sm text-white/90">May 5-7, 2024</p>
                    </div>
                  </div>
                </Link>

                <Link to="/events/digital-art-summit" className="group">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img 
                      src="/assets/images/event 4.jpg"
                      alt="Digital Art Summit"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-bold text-white mb-1">Digital Art Summit</h3>
                      <p className="text-sm text-white/90">June 12-14, 2024</p>
                    </div>
                  </div>
                </Link>

                <Link to="/events/masters-showcase" className="group">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img 
                      src="/assets/images/event 5.jpg"
                      alt="Masters Showcase"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-bold text-white mb-1">Masters Showcase</h3>
                      <p className="text-sm text-white/90">July 8-10, 2024</p>
                    </div>
                  </div>
                </Link>

                <Link to="/events/young-artists-platform" className="group">
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img 
                      src="/assets/images/fa2882a4-de42-4778-afd9-905a72467f8c.jpg"
                      alt="Young Artists Platform"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-lg font-bold text-white mb-1">Young Artists Platform</h3>
                      <p className="text-sm text-white/90">August 20-22, 2024</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </Layout>
  )
}
