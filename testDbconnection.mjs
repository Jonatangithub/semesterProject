import pool from './modules/db.mjs';

async function testDbConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('Database connection successful');
        console.log('Result:', result.rows);
    } catch (error) {
        console.error('Error testing the database connection:', error);
    } finally {
        pool.end(); // Close the pool when done
    }
}

testDbConnection();