// eslint-disable-next-line import/no-unresolved
import Mustache from "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js";
import { listTemplate, emptyListTemplate } from "../view/listView.js";

// Get all todos and parse them
export const getTodos = async () => {
    const todos = await fetch("/todos")
    return todos.json();
}

const updateList = (todos) => {
    const listNode = document.querySelector("#todo-item-template");
    listNode.innerHTML = Mustache.render(
        todos.total ? listTemplate : emptyListTemplate,
        todos
    );
}

export const loadList = async () => {
    try {
        const todos = await getTodos();
        await updateList(todos);
    } catch (error) {
        console.log(error);
        await updateList([]);
        //await showError("Something went wrong while updating the list")
    }
}


// Get a single item
export const getTodo = (todoId) =>
  fetch(`/todos/${todoId}`).then((data) => data.json());


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
