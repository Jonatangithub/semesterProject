import pg from "pg"

class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? true : false
        };

    }


    async updateUser(user) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            await client.query('UPDATE "public"."Users" SET "name" = $1, "email" = $2, "password" = $3 WHERE "id" = $4', [user.name, user.email, user.password, user.id]);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.end();
        }
        return user;

    }
    async deleteStats(userid) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            await client.query('DELETE FROM "public"."stats" WHERE userid = $1', [userid]);
        } finally {
            client.end();
        }
    }
    async deleteUser(userid) {
        await this.deleteStats(userid); // Delete user stats first

        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            await client.query('DELETE FROM "public"."Users" WHERE id = $1', [userid]);
        } finally {
            client.end();
        }
    }
    async deleteStats(userid) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            await client.query('DELETE FROM "public"."stats" WHERE userid = $1', [userid]);
        } finally {
            client.end();
        }
    }
    async createUser(user) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]);
            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
            }
        } catch (error) {
            console.error(error);
        } finally {
            client.end();
        }
        return user;
    }

    async getAllUsers() {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const result = await client.query('Select * from "public"."Users";');
            return result.rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.end();
        }
    }
    async getOneUser(userid) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const result = await client.query('Select * from "public"."Users" WHERE id = $1;', [userid]);
            return result.rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.end();
        }
    }
    async createStats(userid, wins, losses, draws) {
        const client = new pg.Client(this.#credentials);
        let createdStats;
        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."stats"("userid", "wins", "losses", "draws") VALUES($1::Int, $2::Int, $3::Int, $4::Int) RETURNING "userid", "wins", "losses", "draws";', [userid, wins, losses, draws]);

            if (output.rows.length == 1) {
                createdStats = output.rows[0];
            } else {
                throw new Error("Failed to insert stats record.");
            }
        } catch (error) {
            console.error("Error in createStats:", error);
            throw error;
        } finally {
            await client.end();
        }
        return createdStats;
    }
    async resetStats(userid) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const result = await client.query('UPDATE "public"."stats" SET wins = 0, losses = 0, draws = 0 WHERE userid = $1', [userid]);
            return result.rowCount > 0;
        } catch (error) {
            console.error("Error resetting stats:", error);
            throw error;
        } finally {
            client.end();
        }
    }

    async findByEmail(email) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const result = await client.query('SELECT * FROM "public"."Users" WHERE email = $1', [email]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    async getStatsByuserid(userid) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const result = await client.query('Select * from "public"."stats"  where userid = $1;', [userid]);
            return result.rows[0];
        } catch (error) {
            throw error;

        }
    }

    async updateStats(userid, wins, losses, draws) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."stats" set "wins" = $1, "losses" = $2, "draws" = $3 where userid = $4;', [wins, losses, draws, userid]);
            if (output.rowCount === 0) {
                throw new Error(`Stats for userid ${userid} not found.`);
            }

        } catch (error) {
            console.error("Error updating stats:", error);
            throw error;
        } finally {
            await client.end();
        }
    }
    async getLeaderboardData() {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const result = await client.query(`
            SELECT u.id, u.name, s.wins, s.losses, s.draws, 
            (CASE WHEN (wins+losses+draws) = 0 THEN 0 ELSE (wins::decimal / (wins+losses+draws)) * 100 END) as winrate
            FROM "public"."Users" u
            INNER JOIN "public"."stats" s ON u.id = s.userid
            ORDER BY winrate DESC, wins DESC
        `);
            return result.rows;
        } catch (error) {
            console.error("Error fetching leaderboard data:", error);
            throw error;
        } finally {
            await client.end();
        }
    }


}
let connectionString = process.env.ENVIRONMENT == "local" ? process.env.DB_CONNECTIONSTRING_LOCAL : process.env.DB_CONNECTIONSTRING_PROD;
if (connectionString == undefined) {
    throw new Error("You forgot the db connection string");
}
export default new DBManager(connectionString);