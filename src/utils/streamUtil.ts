import { Context } from 'hono';

export interface RangeRequest {
  start: number;
  end: number;
  length: number;
}

export function parseRangeHeader(rangeHeader: string, fileSize: number): RangeRequest | null {
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

export function setRangeHeaders(c: Context, range: RangeRequest, fileSize: number, mimeType: string) {
  c.header('Accept-Ranges', 'bytes');
  c.header('Content-Range', `bytes ${range.start}-${range.end}/${fileSize}`);
  c.header('Content-Length', range.length.toString());
  c.header('Content-Type', mimeType);
}

export function setFullFileHeaders(c: Context, fileSize: number, mimeType: string) {
  c.header('Accept-Ranges', 'bytes');
  c.header('Content-Length', fileSize.toString());
  c.header('Content-Type', mimeType);
} 