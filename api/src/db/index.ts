import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Initialize postgres connection with SSL and additional options
const client = postgres(process.env.DATABASE_URL, {
  ssl: {
    rejectUnauthorized: false
  },
  max: 10, // Reduce connection pool size to prevent overwhelming the database
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout after 10 seconds
  max_lifetime: 60, // Maximum connection lifetime in seconds
  connection: {
    application_name: "art-marketplace-api"
  }
});

// Initialize drizzle with the client and schema
export const db = drizzle(client, { schema });

// Export schema for use in other files
export { schema }; 