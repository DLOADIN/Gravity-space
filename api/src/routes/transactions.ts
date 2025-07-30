import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';

const router = new Hono();

// Validation schemas
const createTransactionSchema = z.object({
  amount: z.number().positive(),
  buyerId: z.string().uuid(),
  artworkId: z.string().uuid(),
  status: z.enum(['pending', 'completed', 'failed']).default('pending'),
  shippingAddress: z.string().min(1),
});

const updateTransactionSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed']),
});

// Routes
router.get('/', async (c) => {
  try {
    const transactions = await db.query.transactions.findMany({
      with: {
        buyer: true,
        artwork: {
          with: {
            artist: true,
          },
        },
      },
    });
    return c.json(transactions);
  } catch (error) {
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

router.get('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(schema.transactions.id, id),
      with: {
        buyer: true,
        artwork: {
          with: {
            artist: true,
          },
        },
      },
    });
    
    if (!transaction) {
      return c.json({ error: 'Transaction not found' }, 404);
    }
    return c.json(transaction);
  } catch (error) {
    return c.json({ error: 'Failed to fetch transaction' }, 500);
  }
});

router.get('/user/:userId', async (c) => {
  const userId = c.req.param('userId');
  try {
    const transactions = await db.query.transactions.findMany({
      where: eq(schema.transactions.buyerId, userId),
      with: {
        artwork: {
          with: {
            artist: true,
          },
        },
      },
    });
    return c.json(transactions);
  } catch (error) {
    return c.json({ error: 'Failed to fetch user transactions' }, 500);
  }
});

router.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = createTransactionSchema.parse(body);
    
    // Check if artwork exists and is not already sold
    const artwork = await db.query.artworks.findFirst({
      where: eq(schema.artworks.id, validatedData.artworkId),
    });

    if (!artwork) {
      return c.json({ error: 'Artwork not found' }, 404);
    }

    // Check if there's any completed transaction for this artwork
    const existingTransaction = await db.query.transactions.findFirst({
      where: and(
        eq(schema.transactions.artworkId, validatedData.artworkId),
        eq(schema.transactions.status, 'completed')
      ),
    });

    if (existingTransaction) {
      return c.json({ error: 'Artwork is already sold' }, 400);
    }

    // Create transaction
    const transaction = await db.insert(schema.transactions).values({
      amount: validatedData.amount.toString(),
      status: validatedData.status,
      buyerId: validatedData.buyerId,
      artworkId: validatedData.artworkId,
      shippingAddress: validatedData.shippingAddress,
      transactionDate: new Date(),
    }).returning();

    return c.json(transaction[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Failed to create transaction' }, 500);
  }
});

router.put('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const validatedData = updateTransactionSchema.parse(body);
    
    const updatedTransaction = await db
      .update(schema.transactions)
      .set({ 
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(schema.transactions.id, id))
      .returning();

    if (!updatedTransaction.length) {
      return c.json({ error: 'Transaction not found' }, 404);
    }
    
    return c.json(updatedTransaction[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: 'Failed to update transaction' }, 500);
  }
});

router.delete('/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const transaction = await db.query.transactions.findFirst({
      where: eq(schema.transactions.id, id),
    });

    if (!transaction) {
      return c.json({ error: 'Transaction not found' }, 404);
    }

    if (transaction.status === 'completed') {
      return c.json({ error: 'Cannot delete completed transactions' }, 400);
    }

    await db.delete(schema.transactions).where(eq(schema.transactions.id, id));
    
    return c.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete transaction' }, 500);
  }
});

export { router as transactionRoutes }; 