import request from "supertest";
import app from "./index";
import pool from "./db";

jest.mock("./db");

const query = pool.query as jest.Mock;

describe("TODO API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /todos should fetch all todos", async () => {
    query.mockResolvedValue({
      rows: [{ id: 1, name: "Test TODO", status: "pending" }],
    });

    const response = await request(app).get("/todos");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Test TODO", status: "pending" },
    ]);
  });

  it("POST /todos should create a new todo", async () => {
    (query as jest.Mock).mockResolvedValue({
      rows: [{ id: 1, name: "New TODO", status: "pending" }],
    });

    const response = await request(app)
      .post("/todos")
      .send({ name: "New TODO", status: "pending" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "New TODO",
      status: "pending",
    });
  });

  it("PUT /todos/:id should update a todo", async () => {
    (query as jest.Mock).mockResolvedValue({
      rows: [{ id: 1, name: "Updated TODO", status: "done" }],
    });

    const response = await request(app)
      .put("/todos/1")
      .send({ name: "Updated TODO", status: "done" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      name: "Updated TODO",
      status: "done",
    });
  });

  it("PUT /todos/:id should return 404 if TODO not found", async () => {
    (query as jest.Mock).mockResolvedValue({ rows: [] });

    const response = await request(app)
      .put("/todos/1")
      .send({ name: "Updated TODO", status: "done" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "TODO not found" });
  });

  it("DELETE /todos/:id should delete a todo", async () => {
    (query as jest.Mock).mockResolvedValue({ rowCount: 1 });

    const response = await request(app).delete("/todos/1");

    expect(response.status).toBe(204);
  });

  it("DELETE /todos/:id should return 404 if TODO not found", async () => {
    (query as jest.Mock).mockResolvedValue({ rowCount: 0 });

    const response = await request(app).delete("/todos/1");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "TODO not found" });
  });
});
