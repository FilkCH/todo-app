import Mustache from "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js";
import { listTemplate, emptyListTemplate } from "../view/listView.js";

// Get all todos and parse them
export const getTodos = () => fetch("/todos").then((data) => data.json());

export const loadList = () =>
  getTodos().then((todos) => {
    const listNode = document.querySelector("#todo-item-template");
    listNode.innerHTML = Mustache.render(
      todos.total ? listTemplate : emptyListTemplate,
      todos
    );
  });

// Get a single item
export const getTodo = (todoId) =>
  fetch(`/todos/${todoId}`).then((data) => data.json());

// Insert or update a single item
// Delete a single item
export const deleteTodo = async (todoId) => {
  await fetch(`/todos/${todoId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  loadList();
};
