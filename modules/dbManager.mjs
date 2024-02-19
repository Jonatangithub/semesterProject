
const { Pool } = 'pg';

const pool = new Pool({
    user: 'mainsemesterproject_user',
    host: 'dpg-cn4uf35jm4es73bqsh70-a',
    database: 'mainsemesterproject',
    password: 'ffu5lIk1dweCmBawrmWMdXWtLHG8IdRK',
    port: 5432,
});

export async function insertUser(username, email, password) {
    try {
        const client = await pool.connect();
        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)';
        const values = [username, email, password];
        await client.query(query, values);
        client.release();
        console.log('User inserted successfully');
    } catch (error) {
        console.error('Error inserting user:', error);
    }
}
