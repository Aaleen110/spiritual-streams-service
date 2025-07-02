import { eq, desc, asc, like, count } from 'drizzle-orm';
import { DB } from '../../db';
import { sermons, sermonParts } from '../../db/schema';
import { NotFoundError } from '../../utils/apperrors';

export async function getAllSermons(db: DB, page: number = 1, limit: number = 10, search?: string) {
  const offset = (page - 1) * limit;
  
  const sermonsQuery = search 
    ? db.select().from(sermons).where(like(sermons.title, `%${search}%`))
    : db.select().from(sermons);
  
  const [sermonsList, totalCount] = await Promise.all([
    sermonsQuery.orderBy(desc(sermons.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(sermons).then(result => result[0]?.count || 0)
  ]);
  
  // Get parts for each sermon
  const sermonsWithParts = await Promise.all(
    sermonsList.map(async (sermon) => {
      const parts = await getSermonParts(db, sermon.id);
      return {
        ...sermon,
        parts
      };
    })
  );
  
  return {
    sermons: sermonsWithParts,
    total: totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit)
  };
}

export async function getSermonById(db: DB, id: string) {
  const sermon = await db.select().from(sermons).where(eq(sermons.id, id)).limit(1);
  
  if (!sermon.length) {
    throw new NotFoundError('Sermon not found');
  }
  
  return sermon[0];
}

export async function getSermonParts(db: DB, sermonId: string) {
  const parts = await db
    .select()
    .from(sermonParts)
    .where(eq(sermonParts.sermonId, sermonId))
    .orderBy(asc(sermonParts.partNumber));
  
  // Transform relative audio URLs to full R2 URLs
  return parts.map(part => ({
    ...part,
    audioUrl: `https://pub-f93cfefd9ddd424ab1cfd836a017d797.r2.dev/${part.audioUrl}`
  }));
}

export async function getSermonWithParts(db: DB, id: string) {
  const sermon = await getSermonById(db, id);
  const parts = await getSermonParts(db, id);
  
  return {
    ...sermon,
    parts
  };
}

export async function getSermonPartById(db: DB, id: string) {
  const part = await db.select().from(sermonParts).where(eq(sermonParts.id, id)).limit(1);
  
  if (!part.length) {
    throw new NotFoundError('Sermon part not found');
  }
  
  // Transform relative audio URL to full R2 URL
  return {
    ...part[0],
    audioUrl: `https://pub-f93cfefd9ddd424ab1cfd836a017d797.r2.dev/${part[0].audioUrl}`
  };
}
