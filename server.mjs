import 'dotenv/config'
import express from 'express' // Express is installed using npm
import USER_API from './routes/usersRoute.mjs';
import STATS_API from './routes/statsRoute.mjs';
import superLogger from './modules/superLogger.mjs';
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";

printDeveloperStartupInportantInformationMSG();


// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = (process.env.PORT || 3000);
server.set('port', port);


// Enable logging for server
const logger = new superLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests


// Defining a folder that will contain static files.
server.use(express.static('public'));

// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);
server.use("/stats", STATS_API);
// A get request handler example)
server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});


// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

