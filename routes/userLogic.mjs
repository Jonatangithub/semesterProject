import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import pkg from 'pg';
const { Pool } = pkg;

// Create a PostgreSQL pool
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_password',
    port: 5432, // Default PostgreSQL port
});

// Check if user exists in the database
export async function checkUserExists(req, res, next) {
    const { email } = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release();
        if (result.rows.length > 0) {
            return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("User already exists").end();
        }
        next();
    } catch (error) {
        console.error('Error checking user existence:', error);
        return res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).send("Error checking user existence").end();
    }
}

// Save users to the database
export async function saveUsersToDatabase(users, req, res, next) {
    const values = users.map(user => [user.name, user.email, user.password]);
    try {
        const client = await pool.connect();
        await client.query('INSERT INTO users (name, email, password) VALUES $1', [values]);
        client.release();
        next();
    } catch (error) {
        console.error('Error saving users to database:', error);
        return res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).send("Error saving users").end();
    }
}


