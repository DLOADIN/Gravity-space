import { Transaction } from './types'

export type UserRole = 'artist' | 'buyer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  profileImage?: string
  bio?: string
  createdAt: string
  updatedAt: string
  isVerified: boolean
}

export interface Artist extends User {
  role: 'artist'
  artworks: Artwork[]
  featuredArtworks: string[] // IDs of featured artwork
  totalSales: number
  followers: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface Artwork {
  id: string
  title: string
  description: string
  imageUrl: string
  thumbnailUrl: string
  artistId: string
  artistName: string
  price: number
  medium: string
  dimensions: {
    width: number
    height: number
    unit: 'cm' | 'in'
  }
  categoryId: string
  categoryName: string
  year: number
  isSold: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  artworkId: string
  title: string
  price: number
  artistName: string
  imageUrl: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  createdAt: string
}

export interface Address {
  fullName: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
}

// Mock data for development

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    bio: 'Platform administrator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: true,
  },
]

export const categories: Category[] = [
  {
    id: '1',
    name: 'Paintings',
    description: 'One-of-a-kind original artworks',
    imageUrl: '/assets/images/download(22).jpg',
    slug: 'paintings',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sculptures',
    description: '3D artworks and sculptures',
    imageUrl: '/assets/images/download (35).jpg',
    slug: 'sculptures',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Arts and Crafts',
    description: 'Handcrafted artistic creations',
    imageUrl: '/assets/images/download(24).jpg',
    slug: 'arts-and-crafts',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Photography',
    description: 'Fine art photography prints',
    imageUrl: '/assets/images/download(3).jpg',
    slug: 'photography',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Fashion Design',
    description: 'Contemporary fashion art and design',
    imageUrl: '/assets/images/download(32).jpg',
    slug: 'fashion-design',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Performative Art',
    description: 'Live art performances and experiences',
    imageUrl: '/assets/images/download(1).jpg.jpg',
    slug: 'performative-art',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Digital Art',
    description: 'Digital creations and NFTs',
    imageUrl: '/assets/images/digital art.jpg',
    slug: 'digital-art',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Animation',
    description: 'Animated artworks and motion graphics',
    imageUrl: '/assets/images/animated.jpg',
    slug: 'animation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Web Design',
    description: 'Digital web experiences and interfaces',
    imageUrl: '/assets/images/web design icon.jpg',
    slug: 'web-design',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Drawing',
    description: 'Sketches and illustrations',
    imageUrl: '/assets/images/drawing.jpg',
    slug: 'drawing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Jewelry',
    description: 'Artistic jewelry pieces',
    imageUrl: '/assets/images/download (1).jpg',
    slug: 'jewelry',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Printmaking',
    description: 'Print and press art',
    imageUrl: '/assets/images/printmaking icon.jpg',
    slug: 'printmaking',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '13',
    name: 'Literature',
    description: 'Written artistry and poetry',
    imageUrl: '/assets/images/literature.jpg',
    slug: 'literature',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

export const artworks: Artwork[] = [
  {
    id: '1',
    title: 'Ethereal Waves',
    description: 'Abstract fluid art with mesmerizing patterns',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1621419203897-20b66b98d495?q=80&w=2765&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621419203897-20b66b98d495?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Acrylic on canvas',
    dimensions: { width: 24, height: 36, unit: 'in' },
    categoryId: '5',
    categoryName: 'Abstract',
    year: 2023,
    isSold: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Urban Reflections',
    description: 'Contemporary urban photography',
    price: 800,
    imageUrl: 'https://images.unsplash.com/photo-1556379069-7c1b1b8990b0?q=80&w=1753&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556379069-7c1b1b8990b0?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Photography',
    dimensions: { width: 20, height: 30, unit: 'in' },
    categoryId: '2',
    categoryName: 'Photography',
    year: 2022,
    isSold: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Digital Dreams',
    description: 'Digital art exploring surreal landscapes',
    price: 950,
    imageUrl: 'https://images.unsplash.com/photo-1530021853947-7d73da7acb70?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530021853947-7d73da7acb70?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Digital',
    dimensions: { width: 18, height: 24, unit: 'in' },
    categoryId: '3',
    categoryName: 'Digital Art',
    year: 2021,
    isSold: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Geometric Harmony',
    description: 'Abstract geometric patterns in vibrant colors',
    price: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1654240013739-77cdfccb68e0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1654240013739-77cdfccb68e0?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Acrylic on canvas',
    dimensions: { width: 30, height: 30, unit: 'in' },
    categoryId: '5',
    categoryName: 'Abstract',
    year: 2023,
    isSold: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: "Nature's Canvas",
    description: 'Fine art nature photography',
    price: 750,
    imageUrl: 'https://images.unsplash.com/photo-1604095087270-be6e0ea58fb0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1604095087270-be6e0ea58fb0?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Photography',
    dimensions: { width: 16, height: 20, unit: 'in' },
    categoryId: '2',
    categoryName: 'Photography',
    year: 2022,
    isSold: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Modern Expressions',
    description: 'Contemporary abstract expressionism',
    price: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1600812180022-e133da09c000?q=80&w=1938&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600812180022-e133da09c000?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Oil on canvas',
    dimensions: { width: 36, height: 48, unit: 'in' },
    categoryId: '1',
    categoryName: 'Original Art',
    year: 2023,
    isSold: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Digital Fusion',
    description: 'Mixed media digital artwork',
    price: 1100,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1723600942485-b1c02c8a0a81?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1723600942485-b1c02c8a0a81?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Digital',
    dimensions: { width: 24, height: 24, unit: 'in' },
    categoryId: '3',
    categoryName: 'Digital Art',
    year: 2022,
    isSold: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Sculptural Forms',
    description: 'Abstract sculptural photography',
    price: 1800,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1723575835595-b9d7c183d995?q=80&w=2022&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://plus.unsplash.com/premium_photo-1723575835595-b9d7c183d995?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Photography',
    dimensions: { width: 20, height: 20, unit: 'in' },
    categoryId: '4',
    categoryName: 'Sculptures',
    year: 2023,
    isSold: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    title: 'Urban Geometry',
    description: 'Architectural photography art',
    price: 900,
    imageUrl: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=80&w=1870&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Photography',
    dimensions: { width: 18, height: 24, unit: 'in' },
    categoryId: '2',
    categoryName: 'Photography',
    year: 2022,
    isSold: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '10',
    title: 'Abstract Flow',
    description: 'Fluid abstract art composition',
    price: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?q=80&w=1884&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Acrylic on canvas',
    dimensions: { width: 24, height: 36, unit: 'in' },
    categoryId: '5',
    categoryName: 'Abstract',
    year: 2023,
    isSold: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '11',
    title: 'Digital Landscapes',
    description: 'Digital art exploring natural forms',
    price: 1300,
    imageUrl: 'https://images.unsplash.com/photo-1579541513287-3f17a5d8d62c?q=80&w=1952&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579541513287-3f17a5d8d62c?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Digital',
    dimensions: { width: 20, height: 20, unit: 'in' },
    categoryId: '3',
    categoryName: 'Digital Art',
    year: 2021,
    isSold: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '12',
    title: 'Sculptural Light',
    description: 'Light and form in sculpture',
    price: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1577083553180-732e5d4b2d39?q=80&w=1893&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577083553180-732e5d4b2d39?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Sculpture',
    dimensions: { width: 24, height: 36, unit: 'in' },
    categoryId: '4',
    categoryName: 'Sculptures',
    year: 2023,
    isSold: false,
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '13',
    title: 'Abstract Harmony',
    description: 'Contemporary abstract composition',
    price: 1900,
    imageUrl: 'https://images.unsplash.com/photo-1579168730073-4541e40ca43a?q=80&w=1957&auto=format&fit=crop&ixlib=rb-4.0.3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579168730073-4541e40ca43a?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3',
    artistId: '1',
    artistName: 'Maya Johnson',
    medium: 'Acrylic on canvas',
    dimensions: { width: 30, height: 40, unit: 'in' },
    categoryId: '5',
    categoryName: 'Abstract',
    year: 2023,
    isSold: false,
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const transactions: Transaction[] = [
  {
    id: '1',
    amount: 1200,
    status: 'completed',
    buyerId: '1',
    artworkId: '1',
    transactionDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const featuredArtists: Artist[] = [
  {
    id: '1',
    name: 'Maya Johnson',
    email: 'maya@example.com',
    role: 'artist',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    bio: 'Maya Johnson is a contemporary abstract artist whose work explores the intersection of color, emotion, and movement. With over 15 years of experience, her paintings have been exhibited internationally and are part of several prestigious collections.',
    createdAt: '2020-03-10T00:00:00Z',
    updatedAt: new Date().toISOString(),
    isVerified: true,
    artworks: artworks.filter(a => a.artistId === '1'),
    featuredArtworks: ['1', '6'],
    totalSales: 45,
    followers: 2300
  },
  {
    id: '2',
    name: 'Thomas Mitchell',
    email: 'thomas@example.com',
    role: 'artist',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    bio: 'Thomas Mitchell is an award-winning photographer specializing in urban landscapes and architectural photography. His distinctive style combines technical precision with an emotional connection to urban environments.',
    createdAt: '2019-07-22T00:00:00Z',
    updatedAt: new Date().toISOString(),
    isVerified: true,
    artworks: artworks.filter(a => a.artistId === '2'),
    featuredArtworks: ['2', '8'],
    totalSales: 38,
    followers: 1850
  },
  {
    id: '3',
    name: 'Emma Davidson',
    email: 'emma@example.com',
    role: 'artist',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    bio: 'Emma Davidson creates serene, dreamlike paintings that bridge the gap between representation and abstraction. Her works are characterized by their harmonious color palettes and ethereal quality.',
    createdAt: '2020-11-15T00:00:00Z',
    updatedAt: new Date().toISOString(),
    isVerified: true,
    artworks: artworks.filter(a => a.artistId === '3'),
    featuredArtworks: ['3', '7'],
    totalSales: 29,
    followers: 1420
  }
]

export const collections = [
  {
    id: 'nocturne',
    name: 'Nocturne',
    description: 'A collection of blue-toned pieces capturing the essence of night and water',
    image: '/assets/images/N1.jpg',
    categoryId: 'paintings',
    categoryName: 'Paintings',
    pieces: [
      {
        id: 'n1',
        title: "ACTIVEGLOW",
        description: "Abstract blue waves with textured impasto technique",
        imageUrl: "/assets/images/N1.jpg",
        thumbnailUrl: "/assets/images/N1.jpg",
        artistId: "em1",
        artistName: "Elena Moonlight",
        price: 120,
        medium: "Oil on canvas",
        dimensions: {
          width: 24,
          height: 36,
          unit: "in"
        },
        categoryId: "paintings",
        categoryName: "Paintings",
        year: 2024,
        isSold: false,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collectionId: "nocturne",
        collectionName: "Nocturne"
      },
      {
        id: 'n2',
        title: "Blue Nude",
        description: "Oil painting, 2020",
        imageUrl: "/assets/images/Blue Nude (2020) Oil painting by Katrina Case.jpg",
        thumbnailUrl: "/assets/images/Blue Nude (2020) Oil painting by Katrina Case.jpg",
        artistId: "kc1",
        artistName: "Katrina Case",
        price: 95,
        medium: "Oil on canvas",
        dimensions: {
          width: 20,
          height: 24,
          unit: "in"
        },
        categoryId: "paintings",
        categoryName: "Paintings",
        year: 2020,
        isSold: false,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collectionId: "nocturne",
        collectionName: "Nocturne"
      },
      {
        id: 'n3',
        title: "Bluey Moon",
        description: "Serene moonlit landscape with reflections",
        imageUrl: "/assets/images/Bluey-Moon.jpg",
        thumbnailUrl: "/assets/images/Bluey-Moon.jpg",
        artistId: "em1",
        artistName: "Elena Moonlight",
        price: 145,
        medium: "Oil on canvas",
        dimensions: {
          width: 24,
          height: 24,
          unit: "in"
        },
        categoryId: "paintings",
        categoryName: "Paintings",
        year: 2024,
        isSold: false,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collectionId: "nocturne",
        collectionName: "Nocturne"
      },
      {
        id: 'n4',
        title: "Humpback Whale",
        description: "Impasto oil painting of a majestic humpback whale",
        imageUrl: "/assets/images/Humpback-Whale-Oil-Painting.jpg",
        thumbnailUrl: "/assets/images/Humpback-Whale-Oil-Painting.jpg",
        artistId: "ma1",
        artistName: "Marine Arts",
        price: 110,
        medium: "Oil on canvas",
        dimensions: {
          width: 6,
          height: 6,
          unit: "in"
        },
        categoryId: "paintings",
        categoryName: "Paintings",
        year: 2024,
        isSold: false,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collectionId: "nocturne",
        collectionName: "Nocturne"
      },
      {
        id: 'n5',
        title: "Blue Waves",
        description: "Abstract blue waves in motion",
        imageUrl: "/assets/images/Jerome-Karsenti.jpg",
        thumbnailUrl: "/assets/images/Jerome-Karsenti.jpg",
        artistId: "jk1",
        artistName: "Jérôme Karsenti",
        price: 130,
        medium: "Oil on canvas",
        dimensions: {
          width: 30,
          height: 40,
          unit: "in"
        },
        categoryId: "paintings",
        categoryName: "Paintings",
        year: 2024,
        isSold: false,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        collectionId: "nocturne",
        collectionName: "Nocturne"
      }
    ]
  },
  // ... rest of the collections ...
];
