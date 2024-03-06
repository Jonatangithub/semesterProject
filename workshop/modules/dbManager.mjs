import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function getUserFromPasswordAndEmail(aEMail, aPassword) {
  const sql = 'SELECT * FROM "tblUser" WHERE "fdEMail" = $1 AND "fdPassword" = $2';
  const params = [aEMail, aPassword];
  const client = await db.connect();
  const rows = (await client.query(sql, params)).rows;
  if (rows && rows.length == 1) {
    return rows[0];
  } else {
    return null;
  }
}
