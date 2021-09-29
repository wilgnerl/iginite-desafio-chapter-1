const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.header;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "user not found" });
  }
  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);

  return response.json(newUser);
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

  user.todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  });

  return response.status(200).send();
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const todoUpdated = user.todos.find((todo) => todo.id === id);

  todoUpdated.title = title;
  todoUpdated.deadline = new Date(deadline);

  return response.status(201).send();
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
  console.log(user);
  const todoUpdated = user.todos.find((todo) => todo.id === id);

  todoUpdated.done = true;

  return response.status(201).send();
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todoDeleted = user.todos.findIndex((todo) => todo.id === id);

  user.todos.splice(todoDeleted, 1);

  return response.status(200).json(users);
});

module.exports = app;
