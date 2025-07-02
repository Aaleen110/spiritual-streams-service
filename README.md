# Spiritual Streams Service

A Cloudflare Workers backend service for streaming spiritual sermons and audio content.

## 🚀 MVP Features

- **Sermon Management**: Retrieve sermons with pagination and search
- **Audio Streaming**: Get sermon parts and audio streaming information
- **RESTful API**: Clean, standardized API endpoints
- **Database**: Cloudflare D1 with Drizzle ORM
- **TypeScript**: Full type safety and IntelliSense

## 📋 API Endpoints

### Sermons
- `GET /api/v1/sermons` - Get all sermons (with pagination & search)
- `GET /api/v1/sermons/:id` - Get sermon by ID with parts
- `GET /api/v1/sermons/:sermonId/parts` - Get sermon parts

### Parts
- `GET /api/v1/parts/:id` - Get sermon part details
- `GET /api/v1/parts/:id/stream` - Get audio streaming info

### Health Check
- `GET /` - Health check endpoint

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- Wrangler CLI
- Cloudflare account

### 1. Install Dependencies
```bash
npm install
```

### 2. Create D1 Database
```bash
# Create the database
wrangler d1 create spiritual-streams-db

# Copy the database ID from the output and update wrangler.toml
```

### 3. Update Configuration
Edit `wrangler.toml` and replace `your-database-id-here` with your actual D1 database ID.

### 4. Run Database Migrations
```bash
# Apply the initial migration
wrangler d1 execute spiritual-streams-db --file=src/db/migrations/0001_initial.sql

# Seed the database with sample data
wrangler d1 execute spiritual-streams-db --file=src/db/seed.sql
```

### 5. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:8787`

## 🧪 Testing

### Using Curl
Test the API endpoints using the provided curl commands in `postman/curls.txt`:

```bash
# Get all sermons
curl -X GET "http://localhost:8787/api/v1/sermons"

# Get sermon by ID
curl -X GET "http://localhost:8787/api/v1/sermons/1"

# Get sermon parts
curl -X GET "http://localhost:8787/api/v1/sermons/1/parts"

# Stream audio
curl -X GET "http://localhost:8787/api/v1/parts/1_1/stream"
```

### Using Postman
Import the test scripts from `postman/test-scripts/` for comprehensive testing.

## 📊 Database Schema

### Sermons Table
```sql
CREATE TABLE sermons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  preacher TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sermon Parts Table
```sql
CREATE TABLE sermon_parts (
  id TEXT PRIMARY KEY,
  sermon_id TEXT NOT NULL REFERENCES sermons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration INTEGER NOT NULL,
  transcript TEXT,
  part_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Development

### Project Structure
```
spiritual-streams-service/
├── src/
│   ├── api/
│   │   ├── router.ts          # Main router
│   │   └── v1/
│   │       ├── sermons.ts     # Sermon endpoints
│   │       ├── parts.ts       # Part endpoints
│   │       ├── interfaces.ts  # TypeScript interfaces
│   │       ├── bl.ts          # Business logic
│   │       └── io.ts          # Database operations
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── index.ts           # Database connection
│   │   ├── migrations/        # Database migrations
│   │   └── seed.sql           # Sample data
│   ├── utils/
│   │   ├── responseUtil.ts    # Response utilities
│   │   ├── paramutil.ts       # Parameter processing
│   │   ├── apperrors.ts       # Custom error classes
│   │   └── streamUtil.ts      # Audio streaming utilities
│   └── index.ts               # Entry point
├── postman/                   # API testing files
└── wrangler.toml             # Cloudflare configuration
```

### Code Patterns

#### API Endpoint Structure
```typescript
export const endpointName = async (c: Context) => {
  try {
    // 1. Get Inputs
    const inputs = await paramutil.processInputs(c, {
      fieldName: [required, defaultValue, source],
    });
    
    // 2. Perform business logic
    const db = c.get('db');
    const result = await bl.businessLogicFunction(c, db, inputs);
    
    // 3. Return results
    return c.json(ResponseUtility.ok(result, 'Success message'));
  } catch (error: any) {
    // Error handling
    if (error instanceof apperrors.ValidationError) {
      return c.json(ResponseUtility.badRequest(error.message), 400);
    }
    return c.json(ResponseUtility.internalServerError(error.message), 500);
  }
};
```

## 🚀 Deployment

### Deploy to Cloudflare Workers
```bash
npm run deploy
```

### Environment Variables
- `DB`: D1 database binding (configured in wrangler.toml)

## 📝 Response Format

All API responses follow a standardized format:

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## 🔮 Future Enhancements

- User authentication and authorization
- Audio file upload and management
- Advanced search and filtering
- Listening history and favorites
- Analytics and statistics
- CDN integration for audio files
- Real-time audio streaming with range requests

## 📄 License

This project is part of the Spiritual Streams application. 