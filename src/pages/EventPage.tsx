import { useParams } from "react-router-dom";
import { Section } from "@/components/ui-custom/Section";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin } from "lucide-react";

// Event data structure
const events = {
  'art-exhibition-2024': {
    title: "Art Exhibition 2025",
    subtitle: "Contemporary Visions",
    date: "May 15-20, 2025",
    time: "10:00 AM - 8:00 PM",
    location: "Kigali Convention Centre, Kigali, Rwanda",
    image: "/assets/images/event.jpg",
    description: "Join us for a groundbreaking exhibition featuring works from emerging and established artists. Experience diverse perspectives through various mediums including paintings, sculptures, and digital art.",
    highlights: [
      "Over 200 artworks from 50 international artists",
      "Live art demonstrations",
      "Artist meet and greets",
      "Guided tours available"
    ],
    featuredArtists: [
      {
        name: "Baby Basquiat",
        role: "Contemporary Artist",
        image: "/assets/images/baby-basquiat.jpg"
      },
      {
        name: "Luidji",
        role: "Digital Artist",
        image: "/assets/images/luidji.jpg"
      },
      {
        name: "Bop Daddy",
        role: "Mixed Media Artist",
        image: "/assets/images/bop-daddy.jpg"
      }
    ]
  },
  'spring-arts-festival': {
    title: "Spring Arts Festival",
    subtitle: "Celebrating Creative Renewal",
    date: "June 5-7, 2025",
    time: "11:00 AM - 9:00 PM",
    location: "Kigali Cultural Village, Kigali, Rwanda",
    image: "/assets/images/event 3.jpg",
    description: "Welcome spring with a vibrant celebration of arts and culture. This outdoor festival brings together artists, performers, and art enthusiasts in a dynamic showcase of creativity.",
    highlights: [
      "Interactive art installations",
      "Live music performances",
      "Art workshops for all ages",
      "Local artisan market"
    ],
    featuredArtists: [
      {
        name: "Baby Basquiat",
        role: "Contemporary Artist",
        image: "/assets/images/baby-basquiat.jpg"
      },
      {
        name: "Luidji",
        role: "Digital Artist",
        image: "/assets/images/luidji.jpg"
      },
      {
        name: "Bop Daddy",
        role: "Mixed Media Artist",
        image: "/assets/images/bop-daddy.jpg"
      }
    ]
  },
  'digital-art-summit': {
    title: "Digital Art Summit",
    subtitle: "The Future of Digital Creation",
    date: "July 12-14, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Kigali Innovation City, Kigali, Rwanda",
    image: "/assets/images/event 4.jpg",
    description: "Explore the intersection of art and technology at this cutting-edge summit. Learn from industry leaders and witness the latest innovations in digital art creation.",
    highlights: [
      "VR art exhibitions",
      "NFT marketplace showcase",
      "Digital art workshops",
      "Industry networking events"
    ],
    featuredArtists: [
      {
        name: "Baby Basquiat",
        role: "Contemporary Artist",
        image: "/assets/images/baby-basquiat.jpg"
      },
      {
        name: "Luidji",
        role: "Digital Artist",
        image: "/assets/images/luidji.jpg"
      },
      {
        name: "Bop Daddy",
        role: "Mixed Media Artist",
        image: "/assets/images/bop-daddy.jpg"
      }
    ]
  },
  'masters-showcase': {
    title: "Masters Showcase",
    subtitle: "Timeless Artistry",
    date: "August 8-10, 2025",
    time: "10:00 AM - 7:00 PM",
    location: "Rwanda Art Museum, Kigali, Rwanda",
    image: "/assets/images/event 5.jpg",
    description: "Experience the mastery of traditional art forms in this exclusive showcase. Featuring renowned artists who have perfected their craft through decades of dedication.",
    highlights: [
      "Classical art demonstrations",
      "Master class sessions",
      "Traditional techniques workshop",
      "Private collection viewings"
    ],
    featuredArtists: [
      {
        name: "Baby Basquiat",
        role: "Contemporary Artist",
        image: "/assets/images/baby-basquiat.jpg"
      },
      {
        name: "Luidji",
        role: "Digital Artist",
        image: "/assets/images/luidji.jpg"
      },
      {
        name: "Bop Daddy",
        role: "Mixed Media Artist",
        image: "/assets/images/bop-daddy.jpg"
      }
    ]
  },
  'young-artists-platform': {
    title: "Young Artists Platform",
    subtitle: "The Next Generation of Creativity",
    date: "September 20-22, 2025",
    time: "12:00 PM - 8:00 PM",
    location: "Kigali Contemporary Arts Centre, Kigali, Rwanda",
    image: "/assets/images/fa2882a4-de42-4778-afd9-905a72467f8c.jpg",
    description: "Discover the fresh perspectives and innovative approaches of emerging young artists. This platform provides a space for new voices in the art world to shine.",
    highlights: [
      "Student art exhibitions",
      "Portfolio reviews",
      "Mentorship programs",
      "Youth art competitions"
    ],
    featuredArtists: [
      {
        name: "Baby Basquiat",
        role: "Contemporary Artist",
        image: "/assets/images/baby-basquiat.jpg"
      },
      {
        name: "Luidji",
        role: "Digital Artist",
        image: "/assets/images/luidji.jpg"
      },
      {
        name: "Bop Daddy",
        role: "Mixed Media Artist",
        image: "/assets/images/bop-daddy.jpg"
      }
    ]
  }
};

export default function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const event = events[eventId as keyof typeof events];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventId]);

  if (!event) {
    return (
      <Section>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Event Not Found</h2>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
        </div>
      </Section>
    );
  }

  return (
    <div className="page-transition">
      <Section className="section-padding py-24 bg-white">
        {/* Event Header */}
        <div className="max-w-7xl mx-auto w-full">
          <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-16">
            <img 
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-8">
              <h1 className="text-7xl font-bold text-white mb-4">{event.title}</h1>
              <p className="text-2xl text-white/90">{event.subtitle}</p>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
              <CalendarDays className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
              <MapPin className="w-6 h-6 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
          </div>

          {/* Event Highlights */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Event Highlights</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-gray-700">{highlight}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Artists */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Featured Artists</h3>
            <div className="flex flex-col gap-2">
              {event.featuredArtists.map((artist, index) => (
                <p key={index} className="text-lg">
                  {artist.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
} 