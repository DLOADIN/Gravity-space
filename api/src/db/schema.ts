import { pgTable, text, timestamp, decimal, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations, type InferModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('user'),
  profileImageURL: text('profile_image_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const artworks = pgTable('artworks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url').notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  artistId: uuid('artist_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'),
  buyerId: uuid('buyer_id').references(() => users.id),
  artworkId: uuid('artwork_id').references(() => artworks.id),
  transactionDate: timestamp('transaction_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  shippingAddress: jsonb('shipping_address').notNull(),
});

// Types
type User = InferModel<typeof users>;
type Category = InferModel<typeof categories>;
type Artwork = InferModel<typeof artworks>;
type Transaction = InferModel<typeof transactions>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  artworks: many(artworks),
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  artworks: many(artworks),
}));

export const artworksRelations = relations(artworks, ({ one }) => ({
  category: one(categories, {
    fields: [artworks.categoryId],
    references: [categories.id],
  }),
  artist: one(users, {
    fields: [artworks.artistId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  buyer: one(users, {
    fields: [transactions.buyerId],
    references: [users.id],
  }),
  artwork: one(artworks, {
    fields: [transactions.artworkId],
    references: [artworks.id],
  }),
}));