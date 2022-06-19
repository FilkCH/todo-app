import express from 'express';
import Nedb from 'nedb-promises';
import TodoController from "./controller/todoController.js";
import dummyData from "./data/dummyData.js";

const app = express();
const port = 1337;

const db = Nedb.create('./src/data/database.db');
if ((await db.count({})) === 0) {
    for (const dummy of dummyData) {
        // eslint-disable-next-line no-await-in-loop
        await db.insert(dummy)
    }
}

const todo = new TodoController(db);

app.use(express.static('./public'));
app.use(express.json());

app.get('/todos', (req, res) => todo.searchTodo(req, res));
app.post('/todos', (req, res) => todo.createTodo(req, res));
app.get('/todos/:todoId', (req, res) => todo.getTodo(req, res));
app.patch('/todos/:todoId', (req, res) => todo.patchTodo(req, res));
app.delete('/todos/:todoId', (req, res) => todo.deleteTodo(req, res));

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App is listening at http://localhost:${port}`);
});
