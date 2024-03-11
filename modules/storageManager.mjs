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
    async updateStats(userId, statChange) {
        const client = new pg.Client(this.#credentials);
    
        try {
            await client.connect();
    
            // Fetch existing stats
            const existingStats = await this.getStats(userId);
    
            // Update stats based ondb
            existingStats.wins += (statChange === 1) ? 1 : 0;
            existingStats.draws += (statChange === 0) ? 1 : 0;
            existingStats.losses += (statChange === 2) ? 1 : 0;
    
            // Save the updated stats back to the database
            await client.query('UPDATE "public"."Stats" SET "wins" = $1, "draws" = $2, "losses" = $3 WHERE "userId" = $4;', [
                existingStats.wins,
                existingStats.draws,
                existingStats.losses,
                userId
            ]);
    
            // Return success message or any relevant data
            return { success: true, message: 'Stats updated successfully' };
        } catch (error) {
            console.error('Error updating stats:', error);
            throw error;
        } finally {
            client.end();
        }
    }    
    async getStats(userId) {
        const client = new pg.Client(this.#credentials);
    
        try {
            await client.connect();
            const result = await client.query('SELECT * FROM "public"."Stats" WHERE "userId" = $1;', [userId]);
            return result.rows[0];
        } catch (error) {
        } finally {
            client.end();
        }
    }
}








export default new DBManager(process.env.DB_CONNECTIONSTRING);