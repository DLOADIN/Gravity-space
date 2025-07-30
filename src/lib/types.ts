export type UserRole = 'artist' | 'buyer' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  bio: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
  slug: string
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
  collectionId?: string
  collectionName?: string
}

export interface Transaction {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  buyerId: string
  artworkId: string
  transactionDate: string
  createdAt: string
  updatedAt: string
} 