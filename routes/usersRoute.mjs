import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import superLogger from "../modules/superLogger.mjs";
import DBManager from "../modules/storageManager.mjs";
import crypto from 'crypto';
import bcrypt from 'bcrypt'

function createTokenForUser(user) {
    const tokenPayload = {
        userId: user.id,
        email: user.email,
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60, // Expires in 1 hour
    };

    // Create a JSON string of the payload
    const payloadString = JSON.stringify(tokenPayload);

    // Encode the payload with Base64
    const base64EncodedPayload = Buffer.from(payloadString).toString('base64');

    // Create a signature using HMAC-SHA256 and encode it with Base64
    const signature = crypto.createHmac('sha256', 'your-secret-key').update(base64EncodedPayload).digest('base64');

    // Combine the encoded payload and signature to create the token
    const token = `${base64EncodedPayload}.${signature}`;

    return token;
}


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

USER_API.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;

    if (name && email && password) {
        try {
            // Check if the email is already in use
            const emailTaken = await User.isEmailTaken(email);
            if (emailTaken) {
                return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Email is already in use").end();
            }

            // Create a new user and save it to the database
            const user = new User();
            user.name = name;
            user.email = email;
            user.pswHash = password; // TODO: Hash the password properly
            await user.save();

            res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
        } catch (error) {
            console.error(error);
            res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error").end();
        }
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing required fields").end();
    }
});
USER_API.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    if (email && password) {
        // Check if the user exists in the database
        let user = await DBManager.findByEmail(email);

        if (user) {
            // Compare the provided password with the hashed password from the database
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                // Password is correct, generate a token
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