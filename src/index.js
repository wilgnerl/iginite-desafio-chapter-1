const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "user not found" });
  }
  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return response.status(400).json({ error: "Username already exists" });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request;
  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const todoUpdated = user.todos.find((todo) => todo.id === id);

  if (!todoUpdated) {
    return response.status(404).json({ error: "Todo dont exists" });
  }

  todoUpdated.title = title;
  todoUpdated.deadline = new Date(deadline);

  return response.json(todoUpdated);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
  const todoUpdated = user.todos.find((todo) => todo.id === id);

  if (!todoUpdated) {
    return response.status(404).json({ error: "Todo dont exists" });
  }

  todoUpdated.done = true;

  return response.json(todoUpdated);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todoDeleted = user.todos.findIndex((todo) => todo.id === id);

  if (todoDeleted === -1) {
    return response.status(404).json({ error: "Todo dont exists" });
  }

  user.todos.splice(todoDeleted, 1);

  return response.status(204).json();
});

module.exports = app;
