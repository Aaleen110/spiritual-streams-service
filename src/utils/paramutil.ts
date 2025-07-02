import { Context } from 'hono';
import { ValidationError } from './apperrors';

export async function processInputs(c: Context, schema: Record<string, [boolean, any?, string?]>) {
  const inputs: Record<string, any> = {};
  
  for (const [field, [required, defaultValue, source]] of Object.entries(schema)) {
    let value: any;
    
    switch (source) {
      case 'query':
        value = c.req.query(field);
        break;
      case 'param':
        value = c.req.param(field);
        break;
      default:
        const body = await c.req.json().catch(() => ({}));
        value = body[field];
        break;
    }
    
    if (required && (value === undefined || value === null || value === '')) {
      throw new ValidationError(`${field} is required`);
    }
    
    inputs[field] = value !== undefined ? value : defaultValue;
  }
  
  return inputs;
} 