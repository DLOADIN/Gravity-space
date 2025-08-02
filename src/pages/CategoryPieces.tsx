import { useParams } from "react-router-dom";
import { Section } from "@/components/ui-custom/Section";
import { categories } from "@/lib/data";
import { useEffect } from "react";
import { Link } from "react-router-dom";

// Category descriptions
const categoryDescriptions: Record<string, string> = {
  'paintings': 'Immerse yourself in a world of color, texture, and emotion. Our paintings collection showcases masterpieces that tell stories, evoke feelings, and transform spaces. From bold abstract expressions to delicate watercolors, discover artworks that speak to your soul.',
  'sculptures': 'Experience art in three dimensions. Our sculptures collection brings form and space to life, creating dynamic pieces that interact with their environment. Each piece is a testament to the artist\'s mastery of materials and their ability to capture movement in stillness.',
  'arts-and-crafts': 'Celebrate the beauty of handmade artistry. Our Arts & Crafts collection features unique pieces that blend traditional techniques with contemporary design. Each creation tells a story of skill, passion, and the human touch.',
  'photography': 'Capture moments that transcend time. Our photography collection presents stunning visual narratives that freeze emotions, tell stories, and document the extraordinary in the ordinary. Discover perspectives that will change how you see the world.',
  'fashion-design': 'Where art meets wearability. Our Fashion Design collection showcases innovative pieces that push boundaries and redefine style. Experience the intersection of creativity and functionality in wearable art.',
  'performative-art': 'Art that comes alive. Our Performative Art collection captures the energy and emotion of live performances, bringing the stage to your space. Experience the power of movement, sound, and expression in visual form.',
  'digital-art': 'Step into the future of artistic expression. Our Digital Art collection showcases cutting-edge creations that blend technology and creativity. From mesmerizing animations to thought-provoking digital installations, discover art that pushes boundaries.',
  'animation': 'Where imagination comes to life. Our Animation collection brings stories to life through motion and artistry. Experience the magic of animated worlds, characters, and narratives that captivate and inspire.',
  'web-design': 'Digital experiences that inspire. Our Web Design collection showcases innovative interfaces and digital experiences that blend aesthetics with functionality. Discover how design shapes our digital world.',
  'drawing': 'The power of the line. Our Drawing collection celebrates the fundamental art of mark-making. From intricate sketches to bold illustrations, experience the raw beauty of pencil, ink, and charcoal.',
  'jewelry': 'Wearable masterpieces. Our Jewelry collection features unique pieces that blend artistry with adornment. Each creation is a statement of style and craftsmanship, designed to be treasured.',
  'printmaking': 'The art of multiples. Our Printmaking collection showcases the beauty of traditional and contemporary print techniques. Discover how artists create unique impressions through various printmaking methods.',
  'literature': 'Words that paint pictures. Our Literature collection celebrates the art of storytelling through beautifully crafted books, poetry, and written works. Experience how words can create worlds and evoke emotions.'
};

export default function CategoryPieces() {
  const { slug } = useParams();
  
  // Find the category based on the slug
  const category = categories.find(cat => cat.slug === slug);

  const getCollectionContent = (slug: string) => {
    switch(slug) {
      case 'paintings':
        return [
          {
            id: 'nocturne-collection',
            name: 'Nocturne Collection',
            image: '/assets/images/noturne.jpg',
            description: 'A mesmerizing collection of nocturnal seascapes and moonlit scenes',
            pieces: 14
          },
          {
            id: 'still-life-collection',
            name: 'Contemporary Still Life',
            image: '/assets/images/contemporary.jpg',
            description: 'Bold impasto techniques and vibrant colors',
            pieces: 16
          }
        ];
      case 'sculptures':
        return [
          {
            id: 'modern-forms',
            name: 'Modern Forms',
            image: '/assets/images/sculptures.jpg',
            description: 'Contemporary sculptural expressions in various materials',
            pieces: 12
          },
          {
            id: 'classical-revival',
            name: 'Classical Revival',
            image: '/assets/images/download (35).jpg',
            description: 'Traditional techniques with a modern twist',
            pieces: 15
          }
        ];
      case 'arts-and-crafts':
        return [
          {
            id: 'artisan-series',
            name: 'Artisan Series',
            image: '/assets/images/arts and craft.jpg',
            description: 'Handcrafted pieces showcasing traditional techniques',
            pieces: 18
          },
          {
            id: 'modern-craft',
            name: 'Modern Craft',
            image: '/assets/images/download(24).jpg',
            description: 'Contemporary interpretations of traditional crafts',
            pieces: 14
          }
        ];
      case 'photography':
        return [
          {
            id: 'urban-perspectives',
            name: 'Urban Perspectives',
            image: '/assets/images/download(3).jpg',
            description: 'City life through an artistic lens',
            pieces: 20
          },
          {
            id: 'natural-world',
            name: 'Natural World',
            image: '/assets/images/Vintage black and white photos for scrapbooking, journaling, decoration - B&W early Authentic European 19300s-1990s.jpg',
            description: 'Capturing the beauty of nature',
            pieces: 16
          }
        ];
      case 'fashion-design':
        return [
          {
            id: 'avant-garde',
            name: 'Avant-Garde',
            image: '/assets/images/download(32).jpg',
            description: 'Pushing the boundaries of fashion',
            pieces: 15
          },
          {
            id: 'sustainable-fashion',
            name: 'Sustainable Fashion',
            image: '/assets/images/fashion collection.jpg',
            description: 'Eco-conscious design innovations',
            pieces: 12
          }
        ];
      case 'performative-art':
        return [
          {
            id: 'movement-series',
            name: 'Movement Series',
            image: '/assets/images/performative art.jpg',
            description: 'Capturing the essence of motion',
            pieces: 14
          },
          {
            id: 'stage-presence',
            name: 'Stage Presence',
            image: '/assets/images/download(1).jpg.jpg',
            description: 'The art of performance captured',
            pieces: 16
          }
        ];
      case 'digital-art':
        return [
          {
            id: 'digital-futures',
            name: 'Digital Futures',
            image: '/assets/images/digital art.jpg',
            description: 'Forward-thinking digital creations',
            pieces: 18
          },
          {
            id: 'pixel-perfect',
            name: 'Pixel Perfect',
            image: '/assets/images/ACTIVEGLOW.jpg',
            description: 'Precision in digital artistry',
            pieces: 15
          }
        ];
      case 'animation':
        return [
          {
            id: 'motion-stories',
            name: 'Motion Stories',
            image: '/assets/images/animation.jpg',
            description: 'Narratives brought to life',
            pieces: 12
          },
          {
            id: 'animated-worlds',
            name: 'Animated Worlds',
            image: '/assets/images/animated.jpg',
            description: 'Creating new realities through animation',
            pieces: 14
          }
        ];
      case 'web-design':
        return [
          {
            id: 'user-experience',
            name: 'User Experience',
            image: '/assets/images/web design icon.jpg',
            description: 'Design that delights and functions',
            pieces: 16
          },
          {
            id: 'digital-interfaces',
            name: 'Digital Interfaces',
            image: '/assets/images/Studio AAA - Design assets and free graphic design resources.jpg',
            description: 'Beautiful and intuitive web experiences',
            pieces: 15
          }
        ];
      case 'drawing':
        return [
          {
            id: 'sketch-series',
            name: 'Sketch Series',
            image: '/assets/images/drawing.jpg',
            description: 'The art of mark-making',
            pieces: 20
          },
          {
            id: 'illustration-collection',
            name: 'Illustration Collection',
            image: '/assets/images/drawing icon.jpg',
            description: 'Stories told through drawing',
            pieces: 18
          }
        ];
      case 'jewelry':
        return [
          {
            id: 'contemporary-gems',
            name: 'Contemporary Gems',
            image: '/assets/images/download (1).jpg',
            description: 'Modern jewelry design',
            pieces: 14
          },
          {
            id: 'artisan-jewelry',
            name: 'Artisan Jewelry',
            image: '/assets/images/cloth piece.jpg',
            description: 'Handcrafted wearable art',
            pieces: 16
          }
        ];
      case 'printmaking':
        return [
          {
            id: 'modern-impressions',
            name: 'Modern Impressions',
            image: '/assets/images/printmaking.jpg',
            description: 'Contemporary print techniques',
            pieces: 15
          },
          {
            id: 'traditional-prints',
            name: 'Traditional Prints',
            image: '/assets/images/printmaking icon.jpg',
            description: 'Classic printmaking methods',
            pieces: 12
          }
        ];
      case 'literature':
        return [
          {
            id: 'poetry-collection',
            name: 'Poetry Collection',
            image: '/assets/images/literature.jpg',
            description: 'Words that paint pictures',
            pieces: 16
          },
          {
            id: 'prose-works',
            name: 'Prose Works',
            image: '/assets/images/literature icon.jpg',
            description: 'Stories that captivate',
            pieces: 14
          }
        ];
      default:
        return [];
    }
  };

  const collections = getCollectionContent(category?.slug || '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!category) {
    return (
      <Section>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Category Not Found</h2>
          <p className="text-muted-foreground">The requested category does not exist.</p>
        </div>
      </Section>
    );
  }

  return (
    <div className="page-transition">
      <Section 
        contentClassName="flex flex-col gap-16"
        className="section-padding py-24 bg-white"
      >
        {/* Category Header */}
        <div className="max-w-7xl mx-auto w-full text-center">
          <h1 className="text-8xl font-bold tracking-tight mb-8">{category.name}</h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-16">
            {categoryDescriptions[category.slug] || category.description}
          </p>
        </div>

        {/* Featured Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
          {collections.map((collection) => (
            <Link 
              key={collection.id}
              to={`/collections/${category.slug}/${collection.id}`}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
            >
              <img 
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="font-medium text-3xl text-white mb-4">{collection.name}</h3>
                <p className="text-lg text-white/90 mb-4">{collection.description}</p>
                <span className="text-sm text-white/80">{collection.pieces} pieces</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
} 