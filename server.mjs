import express from 'express';
import 'dotenv/config';
import pkg from 'pg';
import DBManager from './modules/storageManager.mjs';
import superLogger from './modules/superLogger.mjs';
import USER_API from './routes/usersRoute.mjs';
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";

printDeveloperStartupInportantInformationMSG();

// Load environment variables from .env file
dotenv.config();

try {
    // Create a database connection pool
    const { Pool } = pkg;
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false
        }
    });

    // Creating an instance of the server
    const server = express();

    // Enable logging for server
    const logger = new superLogger();
    server.use(logger.createAutoHTTPRequestLogger()); // Will log all HTTP method requests

    // Defining a folder that will contain static files.
    server.use(express.json());
    server.use(express.static('public'));

    // Telling the server to use the USER_API (all URLs that use this code will have to have the /user after the base address)
    server.use("/user", USER_API);

    server.post("/register", async (req, res) => {
        try {
            const userData = req.body;
            const user = await DBManager.createUser(userData); // Call createUser method from DBManager
            res.status(200).send("User registered successfully").end();
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).send("Failed to register user").end();
        }
    });
    // A get request handler example)
    server.get("/", (req, res, next) => {
        req.originalUrl
        res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
    });

    // Start the server
    const port = process.env.PORT || 8080;
    server.listen(port, () => {
        console.log('Server running on port', port);
    });
} catch (error) {
    console.error('An error occurred:', error);
}
