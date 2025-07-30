import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { transactions, artworks } from '../db/schema';
import { authenticateToken } from '../middleware/auth';
import { PaymentService } from '../services/payment';
import { eq } from 'drizzle-orm';

const app = new Hono();

// Validation schema for checkout request
const checkoutSchema = z.object({
  items: z.array(z.object({
    artworkId: z.string(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })),
  buyerId: z.string(),
  shippingAddress: z.object({
    fullName: z.string(),
    streetAddress: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
});

app.post('/', authenticateToken, async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = checkoutSchema.parse(body);

    // Verify buyer ID matches authenticated user
    const user = c.get('user');
    if (user.userId !== validatedData.buyerId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Calculate total amount
    const totalAmount = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create payment request
    const paymentService = PaymentService.getInstance();
    const paymentRequest = await paymentService.createPaymentRequest({
      amount: totalAmount,
      currency: 'USD',
      description: 'Artwork purchase',
      customerName: validatedData.shippingAddress.fullName,
      customerEmail: '', // We'll need to get this from the user profile
      customerPhone: '', // We'll need to get this from the user profile
      orderId: `ORDER-${Date.now()}`,
      paymentItems: validatedData.items.map(item => ({
        code: item.artworkId,
        quantity: item.quantity,
        unitAmount: item.price,
      })),
    });

    // Create transactions for each item
    const createdTransactions = await Promise.all(
      validatedData.items.map(async (item) => {
        // Check if artwork exists and is not sold
        const artwork = await db.query.artworks.findFirst({
          where: eq(artworks.id, item.artworkId),
        });

        if (!artwork) {
          throw new Error(`Artwork ${item.artworkId} not found`);
        }

        // Check if artwork is already sold by looking for a completed transaction
        const existingTransaction = await db.query.transactions.findFirst({
          where: eq(transactions.artworkId, item.artworkId),
        });

        if (existingTransaction?.status === 'completed') {
          throw new Error(`Artwork ${item.artworkId} is already sold`);
        }

        // Create transaction
        const transaction = await db.insert(transactions).values({
          amount: totalAmount.toString(),
          status: 'pending',
          buyerId: validatedData.buyerId,
          artworkId: item.artworkId,
          shippingAddress: validatedData.shippingAddress,
          transactionDate: new Date(),
        }).returning();

        return transaction;
      })
    );

    return c.json({
      success: true,
      data: {
        transactions: createdTransactions,
        checkoutUrl: paymentRequest.checkoutUrl,
      },
    });
  } catch (error) {
    console.error('Checkout failed:', error);
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request data', details: error.errors }, 400);
    }
    if (error instanceof Error) {
      return c.json({ error: 'Failed to process checkout', details: error.message }, 500);
    }
    return c.json({ error: 'Failed to process checkout', details: 'Unknown error' }, 500);
  }
});

export default app; 