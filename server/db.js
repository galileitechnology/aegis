import { pg } from 'pg';
const { Pool } = pg()

const pool = new Pool({
    user: "postgres",
    password: "galileiuser1",
    host: "localhost",
    port: 5432,
    database: "farm_hive"
});

export default pool;