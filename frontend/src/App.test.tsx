import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios");

const mockTodos = [
  { id: 1, name: "Learn React", status: "pending" },
  { id: 2, name: "Build a TODO app", status: "in progress" },
  { id: 3, name: "Deploy the app", status: "done" },
];

describe("App component", () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockTodos });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the app and displays the todo items", async () => {
    await act(async () => {
      render(<App />);
    });

    mockTodos.forEach((todo) => {
      expect(screen.getByText(todo.name)).toBeInTheDocument();
      expect(screen.getByText(todo.status)).toBeInTheDocument();
    });
  });

  it("adds a new todo item", async () => {
    (axios.post as jest.Mock).mockResolvedValue({
      data: { id: 4, name: "New TODO", status: "pending" },
    });

    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      const inputElement = screen.getByPlaceholderText("Enter new TODO");
      fireEvent.change(inputElement, { target: { value: "New TODO" } });
      fireEvent.click(screen.getByText("Add TODO"));
    });

    expect(axios.post).toHaveBeenCalledWith("http://localhost:3001/todos", {
      name: "New TODO",
      status: "pending",
    });
    expect(await screen.findByText("New TODO")).toBeInTheDocument();
  });

  it("validates todo name on add", async () => {
    await act(async () => {
      render(<App />);
    });

    const inputElement = screen.getByPlaceholderText("Enter new TODO");

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: "" } });
      fireEvent.click(screen.getByText("Add TODO"));
    });
    expect(screen.getByText("Name is required")).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: "a".repeat(256) } });
      fireEvent.click(screen.getByText("Add TODO"));
    });
    expect(
      screen.getByText("Name must be 255 characters or less")
    ).toBeInTheDocument();
  });

  it("updates an existing todo item", async () => {
    (axios.put as jest.Mock).mockResolvedValue({ data: {} });

    await act(async () => {
      render(<App />);
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    await act(async () => {
      const inputElement = screen.getByDisplayValue("Learn React");
      fireEvent.change(inputElement, { target: { value: "Updated TODO" } });
      fireEvent.click(screen.getByText("Save"));
    });

    expect(axios.put).toHaveBeenCalledWith("http://localhost:3001/todos/1", {
      id: 1,
      name: "Updated TODO",
      status: "pending",
    });
    expect(await screen.findByText("Updated TODO")).toBeInTheDocument();
  });

  it("validates todo name on update", async () => {
    await act(async () => {
      render(<App />);
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);

    const inputElement = screen.getByDisplayValue("Learn React");

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: "" } });
      fireEvent.click(screen.getByText("Save"));
    });

    expect(screen.getAllByText("Name is required").length).toBe(2);

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: "a".repeat(256) } });
      fireEvent.click(screen.getByText("Save"));
    });
    expect(
      screen.getAllByText("Name must be 255 characters or less").length
    ).toBe(2);
  });

  it("deletes a todo item", async () => {
    (axios.delete as jest.Mock).mockResolvedValue({ data: {} });

    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      fireEvent.click(screen.getAllByText("Delete")[0]);
    });

    expect(axios.delete).toHaveBeenCalledWith("http://localhost:3001/todos/1");
    expect(screen.queryByText("Learn React")).not.toBeInTheDocument();
  });

  it("cancels editing a todo item", async () => {
    await act(async () => {
      render(<App />);
    });

    fireEvent.click(screen.getAllByText("Edit")[0]);
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByDisplayValue("Learn React")).not.toBeInTheDocument();
  });
});
