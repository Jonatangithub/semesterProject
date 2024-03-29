import express from "express";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import DBManager from '../modules/storageManager.mjs';

const STATS_API = express.Router();
STATS_API.use(express.json());

//INITIAL REGISTRATION OF STATROW
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
//UPDATE STAT WHEN PLAYING GAME
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
            return res.status(400).send("Invalid result value, not cool dude");
        }
        await DBManager.updateStats(userid, currentStats.wins, currentStats.losses, currentStats.draws);
        res.status(200).json(currentStats);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to update stats due to server error");
    }
});
//RESET STATS
STATS_API.put('/resetStats/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const reset = await DBManager.resetStats(userId);
        if (reset) {
            res.status(200).json({ success: true, message: "Stats reset successfully" });
        } else {
            throw new Error('Failed to reset stats');
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to reset stats due to server error");
    }
});
//DISPLAY STATS
STATS_API.get('/displayStats/:id', async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(401).send("Unauthorized: No userId provided");
    }
    try {
        const currentStats = await DBManager.getStatsByuserid(userId);
        if (!currentStats) {
            return res.status(404).send("Stats not found for the user");
        }
        res.status(200).json(currentStats);
    } catch (error) {
        console.error("Error in /displayStats:", error);
        res.status(500).send("Failed to display stats due to server error");
    }
});
//DISPLAY LEADERBOARD
STATS_API.get('/leaderboard', async (req, res) => {
    try {
        const leaderboardData = await DBManager.getLeaderboardData();
        res.status(HTTPCodes.SuccesfullRespons.Ok).json(leaderboardData);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(HTTPCodes.ServerError.InternalServerError).send("Failed to fetch leaderboard");
    }
});
export default STATS_API;