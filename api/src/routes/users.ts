import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db';
import { eq } from 'drizzle-orm';

const router = new Hono();

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).default('user'),
  profileImageURL: z.string().url().optional(),
  bio: z.string().optional(),
});

// Routes
router.get('/', async (c) => {
  try {
    const users = await db.query.users.findMany();
    return c.json(users);
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

router.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json(user);
  } catch (error) {
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

router.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = createUserSchema.parse(body);
    
    const newUser = await db.insert(schema.users).values(validatedData).returning();
    return c.json(newUser[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

router.put('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const validatedData = createUserSchema.partial().parse(body);
    
    const updatedUser = await db
      .update(schema.users)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();

    if (!updatedUser.length) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json(updatedUser[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

router.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deletedUser = await db
      .delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning();

    if (!deletedUser.length) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json({ message: 'User deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

export { router as userRoutes }; 