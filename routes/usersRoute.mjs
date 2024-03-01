import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import superLogger from "../modules/superLogger.mjs";
import DBManager from "../modules/storageManager.mjs";


const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

USER_API.get('/', async (req, res) => {
    console.log("here")
    const user = new User();
    const users = await user.getUsers();
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(users)).end();
});


USER_API.get('/:id', (req, res, next) => {

    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object
})

// your registration endpoint

USER_API.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Email and password are required").end();
        }

        // Check if the user exists in the database
        const user = await DBManager.findByEmail(email);

        if (!user) {
            return res.status(HTTPCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
        }

        // Create an instance of the User class
        const userInstance = new User();
        userInstance.pswHash = user.password; // Assuming your hashed password is stored in the 'password' field

        // Check if the password matches
        const isPasswordValid = await userInstance.verifyPassword(password);

        if (isPasswordValid) {
            // Password is correct, create a session or token for the user
            // For example, you might use JWT (JSON Web Tokens) for session management
            const token = createTokenForUser(user);

            // Send the token as a response
            return res.status(HTTPCodes.SuccesfullRespons.Ok).json({ token }).end();
        } else {
            // Password is incorrect
            return res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Incorrect email or password").end();
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error").end();
    }
});


USER_API.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });
    if (email && password) {
        // Check if the user exists in the database
        let user = await DBManager.findByEmail(email);

        if (user) {
            // Create an instance of the User class
            const userInstance = new User();
            userInstance.pswHash = user.password; // Assuming your hashed password is stored in the 'password' field

            // Check if the password matches
            if (await userInstance.verifyPassword(password)) {
                // Password is correct, create a session or token for the user
                // For example, you might use JWT (JSON Web Tokens) for session management
                const token = createTokenForUser(user);

                // Send the token as a response
                res.status(HTTPCodes.SuccesfullRespons.Ok).json({ token }).end();
            } else {
                // Password is incorrect
                res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Incorrect email or password").end();
            }
        } else {
            // User not found
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
        }
    } else {
        // Missing email or password in the request body
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Email and password are required").end();
    }
        } catch (error) {
        console.error('Error:', error);
    }
});



USER_API.post('/:id', (req, res, next) => {
    /// TODO: Edit user
    const user = new User(); //TODO: The user info comes as part of the request 
    user.save();
});

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
    const user = new User(); //TODO: Actual user
    user.delete();
});

export default USER_API