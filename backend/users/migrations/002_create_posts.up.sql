CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  author_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
