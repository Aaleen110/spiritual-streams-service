import { Sermon, SermonPart } from '../../db/schema';

// Request interfaces
export interface GetSermonsRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetSermonByIdRequest {
  id: string;
}

export interface GetSermonPartsRequest {
  sermonId: string;
}

export interface GetSermonPartByIdRequest {
  id: string;
}

export interface StreamAudioRequest {
  id: string;
}

// Response interfaces
export interface GetSermonsResponse {
  sermons: Sermon[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetSermonByIdResponse {
  sermon: Sermon & {
    parts: SermonPart[];
  };
}

export interface GetSermonPartsResponse {
  parts: SermonPart[];
}

export interface GetSermonPartByIdResponse {
  part: SermonPart;
}

// Error interfaces
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  status: 'error';
  message: string;
  errors?: ValidationError[];
}
