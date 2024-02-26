import superLogger from "./superLogger.mjs";
import chalk from "chalk";

export default function printDeveloperStartupInportantInformationMSG() {

    drawLine("#", 20);

    superLogger.log(`Server enviorment ${process.env.ENVIORMENT}`, superLogger.LOGGING_LEVELS.CRTICAL);

    if (process.env.ENVIORMENT == "local") {
        superLogger.log(`Database connection  ${process.env.DB_CONNECTIONSTRING_LOCAL}`, superLogger.LOGGING_LEVELS.CRTICAL);
    } else {
        superLogger.log(`Database connection  ${process.env.DB_CONNECTIONSTRING_LOCAL}`, superLogger.LOGGING_LEVELS.CRTICAL);
    }

    if (process.argv.length > 2) {
        if (process.argv[2] == "--setup") {
            superLogger.log(chalk.red("Runing setup for database"), superLogger.LOGGING_LEVELS.CRTICAL);
            // TODO: Code that would set up our database with tbls etc..
        }
    }

    drawLine("#", 20);

}

function drawLine(symbole, length) {
    superLogger.log(symbole.repeat(length), superLogger.LOGGING_LEVELS.CRTICAL);
}