import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;

dotenv.config();



const pool = new Pool({
    connectionString: process.env.DB_CONNECTIONSTRING,
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : false,
  });

export default pool;