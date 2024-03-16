import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import DBManager from "../modules/storageManager.mjs";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

//TOKEN
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
const USER_API = express.Router();
USER_API.use(express.json());

// FETCH SOME USERS, INSOMNIA USE
USER_API.get('/', async (req, res) => {
    console.log("fetched");
    const user = new User();
    const users = await user.getUsers();
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(users)).end();
});
//REGISTER USER
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
//LOGIN USER
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
//EDIT USER
USER_API.put('/edit/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    let hashedPassword = undefined;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }
    try {
        const user = await DBManager.getOneUser(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const updatedUser = {
            id: userId,
            name: name || user.name,
            email: email || user.email,
            password: hashedPassword || user.password
        };

        await DBManager.updateUser(updatedUser);
        res.status(200).json({ success: true, message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal server error");
    }
});
//DELETE USER
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