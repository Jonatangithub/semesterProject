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
    };
    const payloadString = JSON.stringify(tokenPayload);
    const base64EncodedPayload = Buffer.from(payloadString).toString('base64');
    const signature = crypto.createHmac('sha256', 'token').update(base64EncodedPayload).digest('base64');
    const token = `${base64EncodedPayload}.${signature}`;
    return token;
}
function decodeToken(token) {
    try {
        const [payloadBase64, signatureBase64] = token.split('.');
        const payloadBuffer = Buffer.from(payloadBase64, 'base64');
        const payload = JSON.parse(payloadBuffer.toString());
        const signatureBuffer = Buffer.from(signatureBase64, 'base64');
        const expectedSignature = crypto.createHmac('sha256', 'token').update(payloadBase64).digest('base64');

        if (crypto.timingSafeEqual(signatureBuffer, Buffer.from(expectedSignature))) {
            return payload;
        } else {
            throw new Error('Invalid signature');
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        throw error;
    }
}
const USER_API = express.Router();
USER_API.use(express.json());
USER_API.get('/', async (req, res) => {
    console.log("here");
    const user = new User();
    const users = await user.getUsers();
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(users)).end();
});

USER_API.get('/:id', (req, res, next) => {
})

//REGISTER!!
USER_API.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        try {
            const emailTaken = await User.isEmailTaken(email);
            if (emailTaken) {
                return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Email is already in use").end();
            }
            const user = new User();
            user.name = name;
            user.email = email;
            user.pswHash = password; // Ensure password hashing is done inside User's save method
            await user.save();

            // After successful user creation, create initial stats for the user
            // Assuming `user.id` is now populated and `DBManager.createStats` method exists
            // Initialize stats with zeros or any default values you see fit
            const initialStats = await DBManager.createStats(user.id, 0, 0, 0);
            if (!initialStats) {
                throw new Error("Failed to create initial stats for user");
            }

            // Return the newly created user (Consider excluding sensitive information like passwords)
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ user: user, stats: initialStats }).end();
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
                const token = createTokenForUser(user);
                const userId = user.id
                console.log(userId)

                // Send the token as a response
                res.status(HTTPCodes.SuccesfullRespons.Ok).json({ token, userId }).end();
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

USER_API.get('/user', async (req, res) => {
    const userToken = req.headers.authorization;

    // Check if the token is present
    if (!userToken) {
        return res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Unauthorized").end();
    }

    try {
        // Decode the token and get the user information
        const decodedToken = decodeToken(userToken);
        const userId = decodedToken.userId;

        // Fetch user information from the database based on the userId
        const user = await DBManager.getUserById(userId);

        // Send the user information in the response
        res.status(HTTPCodes.SuccesfullRespons.Ok).json(user).end();
    } catch (error) {
        console.error('Error:', error);
        res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error").end();
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