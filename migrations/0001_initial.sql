-- Migration: 0001_initial
-- Description: Create initial tables for sermons and sermon parts

CREATE TABLE sermons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  preacher TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Create indexes for better performance
CREATE INDEX idx_sermons_created_at ON sermons(created_at);
CREATE INDEX idx_sermon_parts_sermon_id ON sermon_parts(sermon_id);
CREATE INDEX idx_sermon_parts_part_number ON sermon_parts(part_number); 