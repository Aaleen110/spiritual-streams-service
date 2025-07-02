import { Context } from 'hono';
import { eq } from 'drizzle-orm';
import { DB } from '../../db';
import { sermonParts } from '../../db/schema';
import * as io from './io';
import * as apperrors from '../../utils/apperrors';
import { GetSermonsRequest, GetSermonByIdRequest, GetSermonPartsRequest, GetSermonPartByIdRequest } from './interfaces';

export async function getAllSermonsBL(c: Context, db: DB, inputs: GetSermonsRequest) {
  const { page = 1, limit = 10, search } = inputs;
  
  return await io.getAllSermons(db, page, limit, search);
}

export async function getSermonByIdBL(c: Context, db: DB, inputs: GetSermonByIdRequest) {
  const { id } = inputs;
  
  return await io.getSermonWithParts(db, id);
}

export async function getSermonPartsBL(c: Context, db: DB, inputs: GetSermonPartsRequest) {
  const { sermonId } = inputs;
  
  return await io.getSermonParts(db, sermonId);
}

export async function getSermonPartByIdBL(c: Context, db: DB, inputs: GetSermonPartByIdRequest) {
  const { id } = inputs;
  
  return await io.getSermonPartById(db, id);
}

export async function streamAudioBL(c: Context, db: DB, inputs: GetSermonPartByIdRequest) {
  const { id } = inputs;
  
  const part = await io.getSermonPartById(db, id);
  
  // For MVP, we'll return the audio URL
  // In production, this would handle actual file streaming from R2
  return {
    audioUrl: part.audioUrl,
    mimeType: 'audio/mpeg',
    duration: part.duration
  };
}

export async function streamAudioFromR2BL(c: Context, db: DB, audioBucket: R2Bucket, inputs: GetSermonPartByIdRequest) {
  const { id } = inputs;
  const part = await db.select().from(sermonParts).where(eq(sermonParts.id, id)).limit(1);
  if (!part.length) throw new apperrors.NotFoundError('Sermon part not found');
  const sermonPart = part[0];
  const r2Key = sermonPart.audioUrl;
  const audioObject = await audioBucket.get(r2Key);
  if (!audioObject) throw new apperrors.NotFoundError('Audio file not found');
  const fileSize = audioObject.size;

  // Check for range request
  const rangeHeader = c.req.header('Range');
  
  if (rangeHeader) {
    const range = parseRangeHeader(rangeHeader, fileSize);
    if (range) {
      console.log('Processing range request:', range);
      
      // For small files, load into memory for range requests
      if (fileSize <= 1024 * 1024) { // 1MB or smaller
        const audioData = await audioObject.arrayBuffer();
        const chunk = audioData.slice(range.start, range.end + 1);
        
        return new Response(chunk, {
          status: 206,
          headers: {
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${range.start}-${range.end}/${fileSize}`,
            'Content-Length': range.length.toString(),
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      }
    }
  }

  // For large files or no range request, return full stream
  console.log('Returning full file as stream');
  return new Response(audioObject.body, {
    status: 200,
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Length': fileSize.toString(),
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}

function parseRangeHeader(rangeHeader: string, fileSize: number) {
  const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
  if (!match) return null;
  
  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
  
  if (start >= fileSize || end >= fileSize || start > end) {
    return null;
  }
  
  return {
    start,
    end,
    length: end - start + 1,
  };
}




