
import Chalk from "chalk";
import { HTTPMethods } from "./httpConstants.mjs"
import fs from "fs/promises"

let COLORS = {}; 
COLORS[HTTPMethods.POST] = Chalk.yellow;
COLORS[HTTPMethods.PATCH] = Chalk.yellow;
COLORS[HTTPMethods.PUT] = Chalk.yellow;
COLORS[HTTPMethods.GET] = Chalk.green;
COLORS[HTTPMethods.DELETE] = Chalk.red;
COLORS.Default = Chalk.gray;

const colorize = (method) => {
    if (method in COLORS) {
        return COLORS[method](method);
    }
    return COLORS.Default(method);
};
class superLogger {
    static LOGGING_LEVELS = {
        ALL: 0,         
        VERBOSE: 5,     
        NORMAL: 10,    
        IMPORTANT: 100, 
        CRTICAL: 999    
    };
    #globalThreshold = superLogger.LOGGING_LEVELS.ALL;
    #loggers;
    static instance = null;

    constructor() {
 
        if (superLogger.instance == null) {
            superLogger.instance = this;
            this.#loggers = [];
            this.#globalThreshold = superLogger.LOGGING_LEVELS.NORMAL;
        }
        return superLogger.instance;
    }

    static log(msg, logLevl = superLogger.LOGGING_LEVELS.NORMAL) {

        let logger = new superLogger();
        if (logger.#globalThreshold > logLevl) {
            return;
        }

        logger.#writeToLog(msg);
    }
    createAutoHTTPRequestLogger() {
        return this.createLimitedHTTPRequestLogger({ threshold: superLogger.LOGGING_LEVELS.NORMAL });
    }

    createLimitedHTTPRequestLogger(options) {
        const threshold = options.threshold || superLogger.LOGGING_LEVELS.NORMAL;
        return (req, res, next) => {
            if (this.#globalThreshold > threshold) {
                return;
            }
            this.#LogHTTPRequest(req, res, next);
        }

    }

    #LogHTTPRequest(req, res, next) { 
        let type = req.method;
        const path = req.originalUrl;
        const when = new Date().toLocaleTimeString();
        type = colorize(type);
        this.#writeToLog([when, type, path].join(" "));

        next();
    }

    #writeToLog(msg) {

        msg += "\n";
        console.log(msg);
        fs.appendFile("./log.txt", msg, { encoding: "utf8" }, (err) => { });
    }
}


export default superLogger