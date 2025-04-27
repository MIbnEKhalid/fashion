import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function getPosts() {
  const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
  return rows;
}

export async function getPostById(id) {
  const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return rows[0];
}

export async function createPost(title, content) {
  await pool.query(
    'INSERT INTO posts (title, content) VALUES ($1, $2)',
    [title, content]
  );
}

export async function deletePost(id) {
  await pool.query('DELETE FROM posts WHERE id = $1', [id]);
}

// Initialize database tables if they don't exist
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
})();