import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui-custom/Section";
import { ArtworkCard } from "@/components/ui-custom/ArtworkCard";
import { categories, artworks } from "@/lib/data";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the category based on the slug
  const category = categories.find(cat => cat.slug === slug);
  
  // Filter artworks by the category
  const categoryArtworks = artworks.filter(
    artwork => category && artwork.categoryId === category.id
  );

  // Get featured collections for this category
  const featuredCollections = categoryArtworks.reduce((collections: any[], artwork) => {
    if (!collections.find(c => c.collectionId === artwork.collectionId)) {
      collections.push({
        id: artwork.collectionId,
        title: artwork.collectionName || 'Featured Collection',
        description: 'Curated artworks from this collection',
        imageUrl: artwork.imageUrl,
        pieces: categoryArtworks.filter(a => a.collectionId === artwork.collectionId).length
      });
    }
    return collections;
  }, []).slice(0, 3); // Show top 3 collections

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!category) {
    return (
      <Layout>
        <Section>
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Category Not Found</h2>
            <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
          </div>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-transition">
        <Section className="section-padding py-24 bg-[#FFFFFF]">
          {/* Category Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-6xl font-bold tracking-tight mb-4">{category.name}</h1>
            <p className="text-xl text-gray-600 mb-8">
              {`Explore our collection of ${category.name.toLowerCase()} artwork`}
            </p>
            <Link to={`/categories/${category.slug}/pieces`}>
              <Button size="lg" variant="outline">
                View All Pieces
              </Button>
            </Link>
          </div>

          {/* Collections Section */}
          {featuredCollections.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-semibold mb-8">Featured Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCollections.map((collection) => (
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
          )}

          {/* Featured Pieces Section */}
          <div>
            <h2 className="text-3xl font-semibold mb-8">Featured Pieces</h2>
            {categoryArtworks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {categoryArtworks.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No artworks found in this category.</p>
              </div>
            )}
          </div>
        </Section>
      </div>
    </Layout>
  );
}
