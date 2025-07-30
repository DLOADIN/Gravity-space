import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { artworks } from '../db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { authenticateToken, requireArtist } from '../middleware/auth';
import { uploadImage } from '../utils/upload';

type Env = {
  user: {
    userId: string;
    role: string;
  };
};

const router = new Hono<{ Bindings: Env }>();

const artworkSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.string().min(1),
  imageUrl: z.string().min(1),
  categoryId: z.string().uuid().optional(),
});

// Create artwork (artist only)
router.post('/', authenticateToken, requireArtist, async (c) => {
  try {
    const formData = await c.req.formData();
    const user = c.get('user');

    // Extract form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const categoryId = formData.get('categoryId') as string;
    const image = formData.get('image') as File;

    if (!title || !price || !categoryId || !image) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImage(image);

    // Create artwork with the Cloudinary URL
    const newArtwork = await db
      .insert(artworks)
      .values({
        title,
        description: description || '',
        price: price.toString(),
        imageUrl,
        categoryId,
        artistId: user.userId,
      })
      .returning();

    return c.json(newArtwork, 201);
  } catch (error) {
    console.error('Error creating artwork:', error);
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all artworks with filters (public endpoint)
router.get('/', async (c) => {
  try {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 12;
    const categoryId = c.req.query('categoryId');
    const minPrice = Number(c.req.query('minPrice')) || 0;
    const maxPrice = c.req.query('maxPrice') ? Number(c.req.query('maxPrice')) : undefined;
    const sort = c.req.query('sort') || 'createdAt:desc';

    const offset = (page - 1) * limit;
    const whereClause = [];

    if (categoryId) {
      whereClause.push(eq(artworks.categoryId, categoryId));
    }

    if (minPrice !== undefined) {
      whereClause.push(gte(artworks.price, minPrice.toString()));
    }

    if (maxPrice !== undefined) {
      whereClause.push(lte(artworks.price, maxPrice.toString()));
    }

    const [sortField, sortOrder] = sort.split(':');
    const orderByClause = sql`${artworks[sortField as keyof typeof artworks]} ${sql.raw(sortOrder === 'desc' ? 'DESC' : 'ASC')}`;

    const results = await db.query.artworks.findMany({
      where: whereClause.length > 0 ? and(...whereClause) : undefined,
      limit,
      offset,
      orderBy: orderByClause,
      with: {
        category: true,
        artist: true,
      },
    });

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(artworks)
      .where(whereClause.length > 0 ? and(...whereClause) : undefined);

    const total = Number(totalCount[0]?.count || 0);

    return c.json({
      artworks: results,
      total,
      page,
      limit,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch artworks' }, 500);
  }
});

// Get artist's artworks (requires authentication)
router.get('/my-artworks', authenticateToken, requireArtist, async (c) => {
  try {
    const user = c.get('user');
    const artistArtworks = await db.query.artworks.findMany({
      where: eq(artworks.artistId, user.userId),
      with: {
        category: true,
      },
    });
    return c.json({
      artworks: artistArtworks,
      total: artistArtworks.length,
      page: 1,
      limit: artistArtworks.length,
    });
  } catch (error) {
    console.error('Error fetching artist artworks:', error);
    return c.json({ error: 'Failed to fetch artworks' }, 500);
  }
});

// Update artwork (artist only)
router.patch('/:id', authenticateToken, requireArtist, async (c) => {
  try {
    const id = c.req.param('id');
    const artworkData = artworkSchema.parse(await c.req.json());
    const user = c.get('user');

    const [updatedArtwork] = await db.update(artworks)
      .set({
        title: artworkData.title,
        description: artworkData.description,
        price: artworkData.price,
        imageUrl: artworkData.imageUrl,
        categoryId: artworkData.categoryId,
        updatedAt: new Date(),
      })
      .where(eq(artworks.id, id))
      .returning();

    if (!updatedArtwork) {
      return c.json({ error: 'Artwork not found' }, 404);
    }

    if (updatedArtwork.artistId !== user.userId) {
      return c.json({ error: 'Not authorized to update this artwork' }, 403);
    }

    return c.json(updatedArtwork);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Delete artwork (artist only)
router.delete('/:id', authenticateToken, requireArtist, async (c) => {
  try {
    const id = c.req.param('id');
    const user = c.get('user');

    const [artwork] = await db
      .delete(artworks)
      .where(eq(artworks.id, id))
      .returning();

    if (!artwork) {
      return c.json({ error: 'Artwork not found' }, 404);
    }

    if (artwork.artistId !== user.userId) {
      return c.json({ error: 'Not authorized to delete this artwork' }, 403);
    }

    return c.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get artwork by ID (public endpoint)
router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const artwork = await db.query.artworks.findFirst({
      where: eq(artworks.id, id),
      with: {
        category: true,
        artist: true,
      },
    });

    if (!artwork) {
      return c.json({ error: 'Artwork not found' }, 404);
    }

    return c.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    return c.json({ error: 'Failed to fetch artwork' }, 500);
  }
});

export { router as artworkRoutes }; 