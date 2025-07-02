 -- Migration: 0002_transcript_url
-- Description: Add transcript_url to sermon_parts for R2 bucket support

ALTER TABLE sermon_parts ADD COLUMN transcript_url TEXT;

-- Set transcript_url for the three main sermons
UPDATE sermon_parts SET transcript_url = 'sermons/ghadeer/en/transcript.txt' WHERE sermon_id = '1';
UPDATE sermon_parts SET transcript_url = 'sermons/lady-zainab-sham/en/transcript.txt' WHERE sermon_id = '2';
UPDATE sermon_parts SET transcript_url = 'sermons/hazrat-abbas-mecca/en/transcript.txt' WHERE sermon_id = '3';

-- (Optional) Create index for transcript_url
CREATE INDEX idx_sermon_parts_transcript_url ON sermon_parts(transcript_url);
