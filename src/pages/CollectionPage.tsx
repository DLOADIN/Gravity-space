import { useParams } from "react-router-dom";
import { Section } from "@/components/ui-custom/Section";
import { categories } from "@/lib/data";
import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

// Placeholder pieces structure
const PLACEHOLDER_PIECES = {
  'nocturne': [
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
    }
  ],
  'contemporary': [
    {
      id: 'c1',
      title: "Market Day",
      price: 110, // $110
      description: "Contemporary still life of a traditional Rwandan market"
    },
    {
      id: 'c2',
      title: "Kitchen Stories",
      price: 100, // $100
      description: "Modern interpretation of traditional kitchen scenes"
    },
    {
      id: 'c3',
      title: "Harvest Time",
      price: 125, // $125
      description: "Abstract representation of agricultural life"
    },
    {
      id: 'c4',
      title: "Family Table",
      price: 105, // $105
      description: "Contemporary take on family dining traditions"
    },
    {
      id: 'c5',
      title: "Spice Market",
      price: 115, // $115
      description: "Vibrant depiction of local spice markets"
    }
  ],
  'paintings': [
    {
      id: 'p1',
      title: "Mountain Sunrise",
      price: 130, // $130
      description: "Impressionist painting of Rwanda's mountains"
    },
    {
      id: 'p2',
      title: "Market Colors",
      price: 110, // $110
      description: "Colorful depiction of local market scenes"
    },
    {
      id: 'p3',
      title: "Village Life",
      price: 115, // $115
      description: "Traditional village scenes in modern style"
    },
    {
      id: 'p4',
      title: "Coffee Harvest",
      price: 120, // $120
      description: "Celebration of Rwanda's coffee culture"
    },
    {
      id: 'p5',
      title: "City Rhythms",
      price: 135, // $135
      description: "Urban life in contemporary Rwanda"
    }
  ]
};

export default function CollectionPage() {
  const { categorySlug, collectionId } = useParams<{ categorySlug: string; collectionId: string }>();

  // Find the category
  const category = categories.find(cat => cat.slug === categorySlug);
  
  // Get collection details based on the category
  const getCollectionDetails = () => {
    if (categorySlug === 'paintings') {
      switch(collectionId) {
        case 'nocturne-collection':
          return {
            name: "Nocturne Collection",
            description: "A mesmerizing collection of nocturnal seascapes and moonlit scenes that capture the ethereal beauty of nighttime landscapes. Each piece tells a story of tranquility and mystery.",
            image: "/assets/images/noturne.jpg",
            artist: "Elena Moonlight",
            artistBio: "Specializing in nocturnal scenes and atmospheric landscapes"
          };
        case 'still-life-collection':
          return {
            name: "Contemporary Still Life",
            description: "Bold impasto techniques and vibrant colors bring new life to traditional still life subjects. This collection challenges conventional perspectives on everyday objects.",
            image: "/assets/images/contemporary.jpg",
            artist: "Marcus Rivera",
            artistBio: "Contemporary artist known for bold color choices and innovative techniques"
          };
        default:
          return null;
      }
    }
    // Add more categories and their collections here
    return null;
  };

  // Get collection details
  const collectionDetails = getCollectionDetails();

  // Collection info to display (use either existing details or generate placeholder)
  const collection = collectionDetails || {
    name: collectionId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: `A curated collection of exceptional ${category?.name.toLowerCase() || 'artworks'} that showcase the finest pieces in this category.`,
    image: category?.imageUrl || '/assets/images/placeholder.svg',
    artist: "Artist Name",
    artistBio: "Artist biography and specialization"
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-transition">
      <Section className="section-padding py-24 bg-[#FFFFFF]">
        {/* Collection Header */}
        <div className="max-w-7xl mx-auto w-full text-center mb-16">
          <h1 className="text-[120px] font-bold tracking-tight mb-6 leading-none">
            {collection.name}
          </h1>
          <div className="mb-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-2">By {collection.artist}</h2>
            <p className="text-lg text-gray-600">{collection.artistBio}</p>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {collection.description}
          </p>
        </div>

        {/* Pieces Grid */}
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-2">Collection Pieces</h2>
            <p className="text-gray-600">5 pieces in collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PLACEHOLDER_PIECES[categorySlug].map((piece) => (
              <Card key={piece.id} className="group overflow-hidden">
                <CardHeader className="aspect-square bg-gray-100 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gray-100">
                    <img
                      src={piece.image}
                      alt={piece.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        console.error(`Failed to load image: ${piece.image}`);
                        target.src = '/assets/images/noturne.jpg'; // Fallback image
                      }}
                    />
                  </div>
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
      </Section>
    </div>
  );
} 