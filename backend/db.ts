import { Pool, PoolConfig } from "pg";

const poolConfig: PoolConfig = {
  user: "todo_user",
  host: "localhost",
  database: "todo_db",
  password: "db_password",
  port: 5432,
};

const pool = new Pool(poolConfig);

export default pool;
