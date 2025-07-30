import { db } from '../db';
import { users, categories, artworks } from '../db/schema';

async function seed() {
  try {
    // Clear existing data
    await db.delete(artworks);
    await db.delete(categories);
    await db.delete(users);

    // Create admin user
    const [admin] = await db.insert(users).values({
      name: 'Admin User',
      email: 'admin@artmarket.com',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
      bio: 'Platform administrator',
    }).returning();

    // Create categories
    const categoryData = [
      { name: 'Original Art', description: 'One-of-a-kind original artworks' },
      { name: 'Photography', description: 'Fine art photography prints' },
      { name: 'Digital Art', description: 'Digital and mixed media artwork' },
      { name: 'Sculptures', description: '3D artworks and sculptures' },
      { name: 'Abstract', description: 'Abstract and contemporary art' }
    ];

    const createdCategories = await db.insert(categories)
      .values(categoryData)
      .returning();

    // Artwork data with the provided images
    const artworkData = [
      {
        title: 'Ethereal Waves',
        description: 'Abstract fluid art with mesmerizing patterns',
        price: '1200.00',
        imageUrl: 'https://images.unsplash.com/photo-1621419203897-20b66b98d495',
        categoryId: createdCategories[4].id, // Abstract
        artistId: admin.id
      },
      {
        title: 'Urban Reflections',
        description: 'Contemporary urban photography',
        price: '800.00',
        imageUrl: 'https://images.unsplash.com/photo-1556379069-7c1b1b8990b0',
        categoryId: createdCategories[1].id, // Photography
        artistId: admin.id
      },
      {
        title: 'Digital Dreams',
        description: 'Digital art exploring surreal landscapes',
        price: '950.00',
        imageUrl: 'https://images.unsplash.com/photo-1530021853947-7d73da7acb70',
        categoryId: createdCategories[2].id, // Digital Art
        artistId: admin.id
      },
      {
        title: 'Geometric Harmony',
        description: 'Abstract geometric patterns in vibrant colors',
        price: '1500.00',
        imageUrl: 'https://images.unsplash.com/photo-1654240013739-77cdfccb68e0',
        categoryId: createdCategories[4].id, // Abstract
        artistId: admin.id
      },
      {
        title: 'Nature\'s Canvas',
        description: 'Fine art nature photography',
        price: '750.00',
        imageUrl: 'https://images.unsplash.com/photo-1604095087270-be6e0ea58fb0',
        categoryId: createdCategories[1].id, // Photography
        artistId: admin.id
      },
      {
        title: 'Modern Expressions',
        description: 'Contemporary abstract expressionism',
        price: '2200.00',
        imageUrl: 'https://images.unsplash.com/photo-1600812180022-e133da09c000',
        categoryId: createdCategories[0].id, // Original Art
        artistId: admin.id
      },
      {
        title: 'Digital Fusion',
        description: 'Mixed media digital artwork',
        price: '1100.00',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1723600942485-b1c02c8a0a81',
        categoryId: createdCategories[2].id, // Digital Art
        artistId: admin.id
      },
      {
        title: 'Sculptural Forms',
        description: 'Abstract sculptural photography',
        price: '1800.00',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1723575835595-b9d7c183d995',
        categoryId: createdCategories[3].id, // Sculptures
        artistId: admin.id
      },
      {
        title: 'Urban Geometry',
        description: 'Architectural photography art',
        price: '900.00',
        imageUrl: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5',
        categoryId: createdCategories[1].id, // Photography
        artistId: admin.id
      },
      {
        title: 'Abstract Flow',
        description: 'Fluid abstract art composition',
        price: '1600.00',
        imageUrl: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1',
        categoryId: createdCategories[4].id, // Abstract
        artistId: admin.id
      },
      {
        title: 'Digital Landscapes',
        description: 'Digital art exploring natural forms',
        price: '1300.00',
        imageUrl: 'https://images.unsplash.com/photo-1579541513287-3f17a5d8d62c',
        categoryId: createdCategories[2].id, // Digital Art
        artistId: admin.id
      },
      {
        title: 'Sculptural Light',
        description: 'Light and form in sculpture',
        price: '2500.00',
        imageUrl: 'https://images.unsplash.com/photo-1577083553180-732e5d4b2d39',
        categoryId: createdCategories[3].id, // Sculptures
        artistId: admin.id
      },
      {
        title: 'Abstract Harmony',
        description: 'A vibrant abstract painting exploring color and form',
        price: '1200.00',
        imageUrl: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/abstract-harmony.jpg',
        categoryId: createdCategories[4].id, // Abstract
        artistId: admin.id
      }
    ];

    // Insert artworks
    await db.insert(artworks).values(artworkData);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 