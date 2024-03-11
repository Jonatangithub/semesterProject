/*  // testDbConnection.mjs

import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


async function testDbConnection() {
    const client = new pg.Client({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Database connection successful!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    } finally {
        await client.end();
    }
}


testDbConnection(); */
 