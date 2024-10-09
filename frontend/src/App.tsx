import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  List,
  Select,
  Row,
  Col,
  Space,
  Form,
  message,
} from "antd";

interface Duty {
  id: number;
  name: string;
  status: string;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Duty[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<Duty | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get<Duty[]>("http://localhost:3001/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === "") {
      message.error("Name is required");
      return;
    }

    if (newTodo.length > 255) {
      message.error("Name must be 255 characters or less");
      return;
    }

    try {
      const response = await axios.post<Duty>("http://localhost:3001/todos", {
        name: newTodo,
        status: "pending",
      });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleEditClick = (todo: Duty) => {
    setEditingTodo(todo);
  };

  const handleUpdateTodo = async (todo: Duty) => {
    if (todo.name.trim() === "") {
      message.error("Name is required");
      return;
    }

    if (todo.name.length > 255) {
      message.error("Name must be 255 characters or less");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/todos/${todo.id}`, todo);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
      setEditingTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Duty
  ) => {
    if (editingTodo) {
      setEditingTodo({
        ...editingTodo,
        [field]: event.target.value,
      });
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>TODO List</h1>
      <Form onFinish={addTodo}>
        {" "}
        {/* Added Form component */}
        <Row gutter={16} style={{ marginBottom: "1rem" }}>
          <Col span={20}>
            <Form.Item>
              {" "}
              {/* Added Form.Item component */}
              <Input
                placeholder="Enter new TODO"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              {" "}
              {/* Added Form.Item component */}
              <Button type="primary" htmlType="submit" block>
                Add TODO
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <List
        itemLayout="horizontal"
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item>
            <Row
              gutter={16}
              style={{ width: "100%" }}
              justify="space-between"
              align="middle"
            >
              <Col span={14}>
                {editingTodo?.id === todo.id ? (
                  <Input
                    value={editingTodo.name}
                    onChange={(e) => handleEditChange(e, "name")}
                  />
                ) : (
                  todo.name
                )}
              </Col>
              <Col span={4}>
                {editingTodo?.id === todo.id ? (
                  <Select
                    value={editingTodo.status}
                    onChange={(e) =>
                      handleEditChange(
                        { target: { value: e } } as any,
                        "status"
                      )
                    }
                  >
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="in progress">
                      In Progress
                    </Select.Option>
                    <Select.Option value="done">Done</Select.Option>
                  </Select>
                ) : (
                  todo.status
                )}
              </Col>
              <Col span={6}>
                {editingTodo?.id === todo.id ? (
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => handleUpdateTodo(editingTodo)}
                    >
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit}>Cancel</Button>
                  </Space>
                ) : (
                  <Space>
                    <Button type="link" onClick={() => handleEditClick(todo)}>
                      Edit
                    </Button>
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </Space>
                )}
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
};

export default App;
