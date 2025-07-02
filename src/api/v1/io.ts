import { eq, desc, asc, like, count } from 'drizzle-orm';
import { DB } from '../../db';
import { sermons, sermonParts } from '../../db/schema';
import { NotFoundError } from '../../utils/apperrors';

const TRANSCRIPT_PUBLIC_BASE = 'https://pub-445d9e3cde0143fb86ce49248240ad5e.r2.dev/';

async function fetchTranscriptText(transcriptUrl?: string): Promise<string | null> {
  if (!transcriptUrl) return null;
  const url = TRANSCRIPT_PUBLIC_BASE + transcriptUrl.replace(/^\/+/, '');
  console.log('Fetching transcript from:', url);
  try {
    const res = await fetch(url);
    console.log('Transcript fetch response status:', res.status);
    if (!res.ok) {
      console.log('Transcript fetch failed with status:', res.status);
      return null;
    }
    const text = await res.text();
    console.log('Transcript fetched successfully, length:', text.length);
    return text;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
}

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
  
  // Transform relative audio URLs to full R2 URLs and fetch transcript text if transcriptUrl is present
  return Promise.all(parts.map(async part => ({
    ...part,
    audioUrl: `https://pub-f93cfefd9ddd424ab1cfd836a017d797.r2.dev/${part.audioUrl}`,
    transcript: part.transcriptUrl ? await fetchTranscriptText(part.transcriptUrl) : null,
  })));
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
  const partArr = await db.select().from(sermonParts).where(eq(sermonParts.id, id)).limit(1);
  if (!partArr.length) {
    throw new NotFoundError('Sermon part not found');
  }
  const part = partArr[0];
  return {
    ...part,
    audioUrl: `https://pub-f93cfefd9ddd424ab1cfd836a017d797.r2.dev/${part.audioUrl}`,
    transcript: part.transcriptUrl ? await fetchTranscriptText(part.transcriptUrl) : null,
  };
}
