import pg from "pg"


// We are using an enviorment variable to get the db credentials 
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };

    }
    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }
    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users"  where id = $1;', [user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }
    async createUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
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

    async findByEmail(email) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const query = 'SELECT * FROM "public"."Users" WHERE email = $1';
            const result = await client.query(query, [email]);
            return result.rows[0]; // Assuming email is unique, return the first matching user
        } catch (error) {
            throw error;
        }
    }
    async getStatsByuserid(userid) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const result = await client.query('Select * from "public"."stats"  where userid = $1;', [userid]);
            return result.rows[0]; // Assuming email is unique, return the first matching user
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
            throw error; // It's generally a good idea to rethrow the error so the calling function can handle it
        } finally {
            await client.end(); // Always close the connection
        }
    }

}




export default new DBManager(process.env.DB_CONNECTIONSTRING);