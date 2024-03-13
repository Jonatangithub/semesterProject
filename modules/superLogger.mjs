
import Chalk from "chalk";
import { HTTPMethods } from "./httpConstants.mjs"
import fs from "fs/promises"

//#region  Construct for decorating output.

let COLORS = {}; // Creating a lookup tbl to avoid having to use if/else if or switch. 
COLORS[HTTPMethods.POST] = Chalk.yellow;
COLORS[HTTPMethods.PATCH] = Chalk.yellow;
COLORS[HTTPMethods.PUT] = Chalk.yellow;
COLORS[HTTPMethods.GET] = Chalk.green;
COLORS[HTTPMethods.DELETE] = Chalk.red;
COLORS.Default = Chalk.gray;

// Convenience function
// https://en.wikipedia.org/wiki/Convenience_function
const colorize = (method) => {
    if (method in COLORS) {
        return COLORS[method](method);
    }
    return COLORS.Default(method);
};

//#endregion


class superLogger {

    // These are arbetrary values to make it possible for us to sort our logg messages. 
    static LOGGING_LEVELS = {
        ALL: 0,         // We output everything, no limits
        VERBOSE: 5,     // We output a lott, but not 
        NORMAL: 10,     // We output a moderate amount of messages
        IMPORTANT: 100, // We output just siginfican messages
        CRTICAL: 999    // We output only errors. 
    };

    // What level of messages should we be logging.
    // This field is static 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
    #globalThreshold = superLogger.LOGGING_LEVELS.ALL;

    // Structure to keep the misc log functions that get created.
    // This field is private.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties
    #loggers;

    //#region Using a variation on the singelton pattern
    // https://javascriptpatterns.vercel.app/patterns/design-patterns/singleton-pattern
    // This field is static 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
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
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#logical_operators
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