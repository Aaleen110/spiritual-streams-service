import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const sermons = sqliteTable('sermons', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  preacher: text('preacher').notNull(),
  imageUrl: text('image_url').notNull(),
  date: text('date').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

export const sermonParts = sqliteTable('sermon_parts', {
  id: text('id').primaryKey(),
  sermonId: text('sermon_id').notNull().references(() => sermons.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  audioUrl: text('audio_url').notNull(),
  duration: integer('duration').notNull(),
  transcript: text('transcript'),
  partNumber: integer('part_number').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

export type Sermon = typeof sermons.$inferSelect;
export type NewSermon = typeof sermons.$inferInsert;
export type SermonPart = typeof sermonParts.$inferSelect;
export type NewSermonPart = typeof sermonParts.$inferInsert; 