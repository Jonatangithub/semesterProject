import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import superLogger from "../modules/superLogger.mjs";
import DBManager from "../modules/storageManager.mjs";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

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

// FETCH SUM USARS
USER_API.get('/', async (req, res) => {
    console.log("fetched");
    const user = new User();
    const users = await user.getUsers();
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(users)).end();
});
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
            user.pswHash = password;
            await user.save();
            const initialStats = await DBManager.createStats(user.id, 0, 0, 0);
            if (!initialStats) {
                throw new Error("Failed to create initial stats for user");
            }
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ user: user, stats: initialStats }).end();
        } catch (error) {
            console.error(error);
            res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error").end();
        }
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing required fields").end();
    }
});

//LOGIN!!!!!!
USER_API.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    if (email && password) {
        let user = await DBManager.findByEmail(email);
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const token = createTokenForUser(user);
                const userId = user.id
                console.log(userId)
                res.status(HTTPCodes.SuccesfullRespons.Ok).json({ token, userId }).end();
            } else {
                res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Incorrect email or password").end();
            }
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.NotFound).send("User not found").end();
        }
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Email and password are required").end();
    }
});
USER_API.put('/edit/:id', async (req, res) => {
    const userId = req.params.id; // Make sure you're getting the user ID correctly
    const { name, email, password } = req.body; // Extracting the updated details from the request body

    // Assuming password changes are optional
    let hashedPassword = undefined;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10); // Hash the new password if it's provided
    }

    try {
        // Assuming `getOneUser` fetches the user based on ID and returns an object with user details
        const user = await DBManager.getOneUser(userId); 
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Prepare the user object with new details
        const updatedUser = {
            id: userId, // Keep the same user ID
            name: name || user.name, // Use the new name or fallback to the existing one
            email: email || user.email, // Use the new email or fallback to the existing one
            password: hashedPassword || user.password // Use the hashed new password or fallback to the existing one
        };

        // Update the user in the database
        await DBManager.updateUser(updatedUser);
        res.status(200).json({ success: true, message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal server error");
    }
});
//ION REMBER
USER_API.get('/:id', async (req, res) => {
    const userToken = req.headers.authorization;
    if (!userToken) {
        return res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Unauthorized").end();
    }
    try {
        const decodedToken = decodeToken(userToken);
        const userId = decodedToken.userId;
        const user = await DBManager.getUserById(userId);
        res.status(HTTPCodes.SuccesfullRespons.Ok).json(user).end();
    } catch (error) {
        console.error('Error:', error);
        res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).send("Internal server error").end();
    }
});
USER_API.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await DBManager.deleteUser(userId);
        res.status(200).json({ success: true, message: "User and stats deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal server error");
    }
});



export default USER_API