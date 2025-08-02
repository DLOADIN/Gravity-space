import { Section } from '@/components/ui-custom/Section'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const categories = [
  {
    id: "1",
    name: "Paintings",
    description: "Traditional & contemporary painting",
    imageUrl: "/assets/images/painting.jpg",
    slug: "paintings"
  },
  {
    id: "2",
    name: "Sculptures",
    description: "3D artworks and sculptures",
    imageUrl: "/assets/images/download (23).jpg",
    slug: "sculptures"
  },
  {
    id: "3",
    name: "Performative Art",
    description: "Live art performances",
    imageUrl: "/assets/images/download (36).jpg",
    slug: "performative-art"
  },
  {
    id: "4",
    name: "Digital Art",
    description: "Digital creations and NFTs",
    imageUrl: "/assets/images/digital art.jpg",
    slug: "digital-art"
  },
  {
    id: "5",
    name: "Animation",
    description: "Animated artworks",
    imageUrl: "/assets/images/download (22).jpg",
    slug: "animation"
  },
  {
    id: "6",
    name: "Fashion Design",
    description: "Contemporary fashion",
    imageUrl: "/assets/images/download (3).jpg",
    slug: "fashion-design"
  },
  {
    id: "7",
    name: "Web Design",
    description: "Digital web experiences",
    imageUrl: "/assets/images/web design icon.jpg",
    slug: "web-design"
  },
  {
    id: "8",
    name: "Drawing",
    description: "Sketches and illustrations",
    imageUrl: "/assets/images/drawing.jpg",
    slug: "drawing"
  },
  {
    id: "9",
    name: "Arts & Crafts",
    description: "Handmade creations",
    imageUrl: "/assets/images/arts and craft.jpg",
    slug: "arts-and-crafts"
  },
  {
    id: "10",
    name: "Jewelry",
    description: "Artistic jewelry pieces",
    imageUrl: "/assets/images/download (1).jpg",
    slug: "jewelry"
  },
  {
    id: "11",
    name: "Photography",
    description: "Photographic art",
    imageUrl: "/assets/images/download (30).jpg",
    slug: "photography"
  },
  {
    id: "12",
    name: "Printmaking",
    description: "Print and press art",
    imageUrl: "/assets/images/printmaking icon.jpg",
    slug: "printmaking"
  },
  {
    id: "13",
    name: "Literature",
    description: "Written artistry",
    imageUrl: "/assets/images/literature.jpg",
    slug: "literature"
  }
]

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="page-transition">
      <Section 
        contentClassName="flex flex-col gap-16"
        className="section-padding py-24 bg-[#FFFFFF]"
      >
        {/* Search Section */}
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-7xl font-bold tracking-tight text-center mb-16">Explore Art</h1>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              type="search"
              placeholder="Search for art categories..."
              className="w-full pl-12 pr-4 py-6 text-lg rounded-full border-2 border-gray-200 focus:border-black transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <Link 
              key={category.id}
              to={`/categories/pieces/${category.slug}`}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            >
              <img 
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="font-medium text-lg text-white mb-2">{category.name}</h3>
                <p className="text-sm text-white/90">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No categories found matching your search.</p>
          </div>
        )}
      </Section>
    </div>
  )
} 