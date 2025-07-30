import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define the JWT payload schema
const jwtPayloadSchema = z.object({
  userId: z.string(),
  role: z.enum(['user', 'artist', 'admin']),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

declare module 'hono' {
  interface ContextVariableMap {
    'user': JwtPayload;
  }
}

export async function authenticateToken(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return c.json({ error: 'No token provided' }, 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // Validate the decoded payload
    const validatedPayload = jwtPayloadSchema.parse(decoded);
    c.set('user', validatedPayload);
    await next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ error: 'Invalid token' }, 401);
    }
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid token payload' }, 401);
    }
    return c.json({ error: 'Authentication failed' }, 401);
  }
}

export const requireArtist = async (c: Context, next: Next) => {
  const user = c.get('user');
  if (!user || user.role !== 'artist') {
    return c.json({ error: 'Artist access required' }, 403);
  }
  await next();
}; 