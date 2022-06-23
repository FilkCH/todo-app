// eslint-disable-next-line import/no-unresolved
import Mustache from "https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js";
import { listTemplate, emptyListTemplate } from "../view/listView.js";

// Get many items
export const getTodos = async (sortBy, order, filter) => {
  const todos = await fetch(
    `/todos?sortBy=${sortBy || ""}&sortOrder=${order || ""}&${
      filter ? "include_done=true" : ""
    }`
  );
  return todos.json();
};

// Get single item
export const getTodo = (todoId) =>
  fetch(`/todos/${todoId}`).then((data) => data.json());

// Delete single item
export const deleteTodo = async (todoId) => {
  await fetch(`/todos/${todoId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Render items into template
const updateList = (todos) => {
  // TODO: dates in menschlich lesbares format wandeln

  const listNode = document.querySelector("#todo-item-template");
  listNode.innerHTML = Mustache.render(
    todos.total ? listTemplate : emptyListTemplate,
    todos
  );
};

// Call data and rendering
export const loadList = async (sortBy, order, filter) => {
  try {
    const todos = await getTodos(sortBy, order, filter);
    await updateList(todos);
  } catch (error) {
    console.log(error);
    await updateList([]);
  }
};

// Mustache.registerHelper("showNiceDate", (dueDate) => {
//   const locale = navigator.language;
//   const today = new Date();
//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);
//
//   const date = new Date(dueDate).toLocaleDateString(locale);
//   if (date === new Date().toLocaleDateString(locale)) {
//     return "Heute fällig.";
//   }
//   if (date === new Date(tomorrow).toLocaleDateString(locale)) {
//     return "Morgen fällig.";
//   }
//   return `Fällig am ${date}`;
// });
//
// // Set a checkbox to checked if conditions is met
// Mustache.registerHelper("boxChecker", (done) => {
//   if (!done) {
//     return "";
//   }
//   return "checked";
// });
