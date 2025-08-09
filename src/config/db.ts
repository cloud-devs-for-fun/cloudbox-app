import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "db-cloudbox",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "root",
  port: Number(process.env.DB_PORT) || 5432,
});

export default pool;
