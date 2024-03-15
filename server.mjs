import 'dotenv/config';
import express from 'express';
import USER_API from './routes/usersRoute.mjs';
import STATS_API from './routes/statsRoute.mjs';
import superLogger from './modules/superLogger.mjs';
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";

printDeveloperStartupInportantInformationMSG();

const server = express();
const port = (process.env.PORT || 3000);
server.set('port', port);

const logger = new superLogger();
server.use(logger.createAutoHTTPRequestLogger());


server.use(express.static('public'));
server.use("/user", USER_API);
server.use("/stats", STATS_API);

server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});


server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

