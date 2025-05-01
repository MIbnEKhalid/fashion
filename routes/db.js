import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.NEON_POSTGRES,
  ssl: {
    rejectUnauthorized: false
  }
});

(async () => {
  try{
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "posts" created or already exists.');
    client.release();
  }catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();

export {pool};