import { Context } from 'hono';
import { ResponseUtility } from '../../utils/responseUtil';
import * as paramutil from '../../utils/paramutil';
import * as apperrors from '../../utils/apperrors';
import * as bl from './bl';
import { GetSermonsRequest, GetSermonByIdRequest, GetSermonPartsRequest } from './interfaces';

export const getAllSermons = async (c: Context) => {
  try {
    // 1. Get Inputs
    const inputs = await paramutil.processInputs(c, {
      page: [false, 1, 'query'],
      limit: [false, 10, 'query'],
      search: [false, undefined, 'query'],
    });
    
    // 2. Perform business logic
    const db = c.get('db');
    const result = await bl.getAllSermonsBL(c, db, inputs as GetSermonsRequest);
    
    // 3. Return results
    return c.json(ResponseUtility.ok(result, 'Sermons retrieved successfully'));
  } catch (error: any) {
    if (error instanceof apperrors.ValidationError) {
      return c.json(ResponseUtility.badRequest(error.message), 400);
    }
    return c.json(ResponseUtility.internalServerError(error.message), 500);
  }
};

export const getSermonById = async (c: Context) => {
  try {
    // 1. Get Inputs
    const inputs = await paramutil.processInputs(c, {
      id: [true, undefined, 'param'],
    });
    
    // 2. Perform business logic
    const db = c.get('db');
    const result = await bl.getSermonByIdBL(c, db, inputs as GetSermonByIdRequest);
    
    // 3. Return results
    return c.json(ResponseUtility.ok(result, 'Sermon retrieved successfully'));
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

export const getSermonParts = async (c: Context) => {
  try {
    // 1. Get Inputs
    const inputs = await paramutil.processInputs(c, {
      sermonId: [true, undefined, 'param'],
    });
    
    // 2. Perform business logic
    const db = c.get('db');
    const result = await bl.getSermonPartsBL(c, db, inputs as GetSermonPartsRequest);
    
    // 3. Return results
    return c.json(ResponseUtility.ok(result, 'Sermon parts retrieved successfully'));
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