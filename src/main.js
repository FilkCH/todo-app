import express from "express";
import Nedb from "nedb-promises";
import TodoController from "./controller/todoController.js";
import dummyData from "./data/dummyData.js";

// Initialize the database
const db = Nedb.create("./src/data/database.db");

// Remove the following condition if you don't want dummy data to be added
if ((await db.count({})) === 0) {
  for (const dummy of dummyData) {
    // eslint-disable-next-line no-await-in-loop
    await db.insert(dummy);
  }
}

// Set up the server
const app = express();
const port = 1337;

app.use(express.static("./public"));
app.use(express.json());

// Initialize an instance of the REST API
const todo = new TodoController(db);

// Set routes and parameters
app.get("/todos", (req, res) => todo.getAllTodos(req, res));
app.get("/todos/:todoId", (req, res) => todo.getTodo(req, res));
app.post("/todos/:todoId?", (req, res) => todo.saveTodo(req, res));
app.put("/todos/:todoId?", (req, res) => todo.saveTodo(req, res));
app.delete("/todos/:todoId", (req, res) => todo.deleteTodo(req, res));

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening at http://localhost:${port}`);
});
