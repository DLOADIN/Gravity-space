
import { Layout } from "@/components/layout/Layout";
import { Section } from "@/components/ui-custom/Section";
import { CategoryCard } from "@/components/ui-custom/CategoryCard";
import { categories } from "@/lib/data";
import { useEffect } from "react";

export default function Categories() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Section title="Browse by Category" subtitle="Explore our extensive collection of artwork categories">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Section>
    </Layout>
  );
}
