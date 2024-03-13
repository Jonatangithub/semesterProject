import express from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import DBManager from '../modules/storageManager.mjs'; // Adjust this path to where your DBManager is located
const STATS_API = express.Router();
STATS_API.use(express.json());

STATS_API.post('/registerStats', async (req, res) => {
    try {
        const { userId, wins, losses, draws } = req.body;
        const newStat = await DBManager.createStats(userId, wins, losses, draws);
        if (newStat) {
            console.log(newStat)
            const formattedResponse = {
                userId: newStat.userid,
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


STATS_API.get('/user-stats', async (req, res) => { // Using authMiddleware to ensure only authenticated users can access this endpoint
    const userId = req.userId; // Use the authenticated user's ID to fetch pets

    try {
        const stats = await DBManager.getStatsByUserId(userId);
        if (stats.length > 0) {
            res.status(HTTPCodes.Successful.Ok).json(stats); // Send back the array of pets associated with the authenticated user
        } else {
            res.status(HTTPCodes.ClientError.NotFound).send("No stats found for the user");
        }
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(HTTPCodes.ServerError.InternalServerError).send("Failed to fetch stats due to server error");
    }
});

export default STATS_API;