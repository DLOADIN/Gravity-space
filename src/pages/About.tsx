import { useEffect } from "react";
import { Section } from "@/components/ui-custom/Section";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
      <div className="page-transition">
        {/* Hero section */}
        <div className="relative overflow-hidden bg-accent py-24 md:py-32">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1590598016834-a0286dde4d7d?auto=format&fit=crop&w=1200&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'contrast(1.2) brightness(0.8)'
            }} />
          </div>
          <div className="container px-6 mx-auto relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                About Us
              </h1>
              <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                Learn more about our organization and what drives us forward.
              </p>
            </div>
          </div>
        </div>

        {/* About Us */}
        <Section>
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium mb-4">
              About Us
            </span>
            <h2 className="text-3xl font-semibold mb-6">
              Who We Are
            </h2>
            <p className="text-muted-foreground mb-6">
              We are a dedicated team of professionals committed to excellence in everything we do. Our organization brings together diverse talents and perspectives to create innovative solutions and deliver exceptional results.
            </p>
            <p className="text-muted-foreground mb-6">
              With years of experience and a passion for continuous improvement, we strive to make a positive impact in our industry and the communities we serve.
            </p>
          </div>
        </Section>

        {/* Our Mission */}
        <Section className="bg-[#FEF7CD] py-20">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 bg-[#FEC6A1] text-accent-foreground rounded-full text-xs font-medium mb-4">
              Our Mission
            </span>
            <h2 className="text-3xl font-semibold mb-6">
              What We Stand For
            </h2>
            <p className="text-muted-foreground mb-4">
              Our mission is to empower organizations and individuals through innovative solutions and exceptional service. We believe in creating lasting value for our clients and stakeholders.
            </p>
            <p className="text-muted-foreground mb-4">
              We are committed to excellence, integrity, and continuous improvement in everything we do. Our goal is to make a positive impact in our industry and the communities we serve.
            </p>
          </div>
        </Section>

        {/* Our Vision */}
        <Section>
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium mb-4">
              Our Vision
            </span>
            <h2 className="text-3xl font-semibold mb-6">
              Where We're Going
            </h2>
            <p className="text-muted-foreground mb-6">
              We envision a future where our organization leads the industry in innovation and excellence. Our vision is to be the trusted partner of choice for organizations seeking transformative solutions.
            </p>
            <p className="text-muted-foreground mb-6">
              Through continuous growth and adaptation, we aim to expand our impact globally while maintaining our commitment to quality and customer satisfaction.
            </p>
          </div>
        </Section>
      </div>
  );
}
