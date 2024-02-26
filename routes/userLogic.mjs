/* import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";


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
        await client.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', values);
        client.release();
        next();
    } catch (error) {
        console.error('Error saving users to database:', error);
        return res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).send("Error saving users").end();
    }
}
    const user = {
        name: name,
        email: email,
        password: password
    };
    const apiURL ='https://main-4iku.onrender.com'
    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            console.log('User registered successfully');
            // Optionally, redirect to another page or show a success message
        } else {
            console.error('Failed to register user');
            // Optionally, display an error message to the user
        }
    } catch (error) {
        console.error('Error:', error);
        // Optionally, display an error message to the user
    }





 */