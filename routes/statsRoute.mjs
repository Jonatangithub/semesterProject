import express from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import DBManager from '../modules/storageManager.mjs'; // Adjust this path to where your DBManager is located
const STATS_API = express.Router();
STATS_API.use(express.json());

STATS_API.post('/registerStats', async (req, res) => {
    try {
        const { userid, wins, losses, draws } = req.body;
        const newStat = await DBManager.createStats(userid, wins, losses, draws);
        if (newStat) {
            console.log(newStat)
            const formattedResponse = {
                userid: newStat.userid,
                stats: {
                    wins: newStat.wins,
                    losses: newStat.losses,
                    draws: newStat.draws
                }
            };
            res.status(HTTPCodes.SuccesfullRespons.Ok).json(formattedResponse);
        } else {
            res.status(HTTPCodes.ServerError.InternalServerError).send("Failed to register stat");
        }
    } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(HTTPCodes.ServerError.InternalServerError).send("Failed to register stat due to server error");
    }
});


STATS_API.put('/updateStats', async (req, res) => {
    const { userid, result } = req.body;

    if (!userid || !result) {
        return res.status(400).send("Missing userid or result");
    }

    try {
        const currentStats = await DBManager.getStatsByuserid(userid);
        console.log(currentStats)
        if (!currentStats || currentStats.length === 0) {
            return res.status(404).send("Stats not found for the user");
        }

        if (result === 'win') {
            currentStats.wins += 1;
        } else if (result === 'loss') {
            currentStats.losses += 1;
        } else if (result === 'draw') {
            currentStats.draws += 1;
        } else {
            // If the result is not recognized
            return res.status(400).send("Invalid result value");
        }

        // Now, update the stats in the database
        await DBManager.updateStats(userid, currentStats.wins, currentStats.losses, currentStats.draws);

        // Send back the updated stats as a response
        res.status(200).json(currentStats);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update stats due to server error");
    }
});


export default STATS_API;