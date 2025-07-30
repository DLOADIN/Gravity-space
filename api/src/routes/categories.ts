import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db';
import { eq, ilike, sql } from 'drizzle-orm';

const router = new Hono();

// Validation schemas
const createCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

// Routes
router.get('/', async (c) => {
  try {
    const name = c.req.query('name');
    
    // Simple query to get categories with artwork count
    const categories = await db
      .select({
        id: schema.categories.id,
        name: schema.categories.name,
        description: schema.categories.description,
        artworkCount: sql<number>`count(${schema.artworks.id})::int`,
      })
      .from(schema.categories)
      .leftJoin(schema.artworks, eq(schema.categories.id, schema.artworks.categoryId))
      .groupBy(schema.categories.id, schema.categories.name, schema.categories.description)
      .orderBy(schema.categories.name);

    if (name) {
      const filteredCategory = categories.find(cat => 
        cat.name.toLowerCase().includes(name.toLowerCase())
      );
      return c.json(filteredCategory || null);
    }

    return c.json(categories);
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

router.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const category = await db.query.categories.findFirst({
      where: eq(schema.categories.id, id),
      with: {
        artworks: true,
      },
    });
    
    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }
    return c.json(category);
  } catch (error) {
    return c.json({ error: 'Failed to fetch category' }, 500);
  }
});

router.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = createCategorySchema.parse(body);
    
    const newCategory = await db.insert(schema.categories).values(validatedData).returning();
    return c.json(newCategory[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

router.put('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const validatedData = createCategorySchema.partial().parse(body);
    
    const updatedCategory = await db
      .update(schema.categories)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(schema.categories.id, id))
      .returning();

    if (!updatedCategory.length) {
      return c.json({ error: 'Category not found' }, 404);
    }
    
    return c.json(updatedCategory[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Failed to update category' }, 500);
  }
});

router.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    // Check if category has artworks
    const category = await db.query.categories.findFirst({
      where: eq(schema.categories.id, id),
      with: {
        artworks: true,
      },
    });

    if (!category) {
      return c.json({ error: 'Category not found' }, 404);
    }

    if (category.artworks.length > 0) {
      return c.json({ error: 'Cannot delete category with existing artworks' }, 400);
    }

    await db.delete(schema.categories).where(eq(schema.categories.id, id));
    
    return c.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete category' }, 500);
  }
});

export { router as categoryRoutes }; 