import express from 'express' // Express is installed using npm
import { registerUser } from './routes/usersRoute.mjs'; // Import the function to handle user registration
import superLogger from './modules/superLogger.mjs';

// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);

// Enable logging for server
const logger = new superLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests

// Defining a folder that will contain static files.
server.use(express.json());
server.use(express.static('public'));

// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);

server.post("/register", async (req, res) => {
    try {
        const userData = req.body;
        await registerUser(userData);
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
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
