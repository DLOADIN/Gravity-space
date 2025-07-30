import { Hono } from 'hono';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { authenticateToken } from '../middleware/auth';

const router = new Hono();

// Get all artists
router.get('/', async (c) => {
  try {
    const artists = await db.query.users.findMany({
      where: eq(users.role, 'artist'),
      columns: {
        id: true,
        name: true,
        email: true,
        profileImageURL: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return c.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    return c.json({ error: 'Failed to fetch artists' }, 500);
  }
});

// Get artist by ID
router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const artist = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        id: true,
        name: true,
        email: true,
        profileImageURL: true,
        bio: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!artist) {
      return c.json({ error: 'Artist not found' }, 404);
    }

    return c.json(artist);
  } catch (error) {
    console.error('Error fetching artist:', error);
    return c.json({ error: 'Failed to fetch artist' }, 500);
  }
});

// Update artist profile (protected route)
router.put('/:id', authenticateToken, async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { name, bio, profileImageURL } = body;

    // Verify the user is updating their own profile
    const user = c.get('user');
    if (user.userId !== id) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const updatedArtist = await db
      .update(users)
      .set({
        name,
        bio,
        profileImageURL,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!updatedArtist[0]) {
      return c.json({ error: 'Artist not found' }, 404);
    }

    return c.json(updatedArtist[0]);
  } catch (error) {
    console.error('Error updating artist:', error);
    return c.json({ error: 'Failed to update artist' }, 500);
  }
});

export const artistRoutes = router; 