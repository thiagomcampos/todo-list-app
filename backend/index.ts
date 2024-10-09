import express from "express";
import cors from "cors";
import pool from "./db";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/todos", async (req: express.Request, res: express.Response) => {
  try {
    const result = await pool.query("SELECT * FROM todos");
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/todos", async (req: express.Request, res: express.Response) => {
  const { name, status } = req.body;
  try {
    if (name.length > 255) {
      res.status(400).json({ error: "Name must be 255 characters or less" });
    } else {
      const result = await pool.query(
        "INSERT INTO todos (name, status) VALUES ($1, $2) RETURNING *",
        [name, status]
      );
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Failed to create todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.put("/todos/:id", async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { name, status } = req.body;
  try {
    if (name.length > 255) {
      res.status(400).json({ error: "Name must be 255 characters or less" });
    } else {
      const result = await pool.query(
        "UPDATE todos SET name = $1, status = $2 WHERE id = $3 RETURNING *",
        [name, status, id]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: "TODO not found" });
      } else {
        res.json(result.rows[0]);
      }
    }
  } catch (error) {
    console.error("Failed to update todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

app.delete(
  "/todos/:id",
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: "TODO not found" });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
      res.status(500).json({ error: "Failed to delete todo" });
    }
  }
);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
