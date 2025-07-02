import { Context } from 'hono';
import { ResponseUtility } from '../../utils/responseUtil';
import * as paramutil from '../../utils/paramutil';
import * as apperrors from '../../utils/apperrors';
import * as bl from './bl';
import { GetSermonPartByIdRequest } from './interfaces';

export const streamAudioFile = async (c: Context) => {
  try {
    // 1. Get Inputs
    const inputs = await paramutil.processInputs(c, {
      id: [true, undefined, 'param'],
    });
    
    // 2. Perform business logic
    const db = c.get('db');
    const audioBucket = c.get('audioBucket');
    const result = await bl.streamAudioFromR2BL(c, db, audioBucket, inputs as GetSermonPartByIdRequest);
    
    // 3. Return audio stream
    return result;
  } catch (error: any) {
    if (error instanceof apperrors.ValidationError) {
      return c.json(ResponseUtility.badRequest(error.message), 400);
    }
    if (error instanceof apperrors.NotFoundError) {
      return c.json(ResponseUtility.notFound(error.message), 404);
    }
    return c.json(ResponseUtility.internalServerError(error.message), 500);
  }
}; 