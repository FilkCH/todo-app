// TODO: Filter and sorting functions

import { deleteTodo, getTodo, loadList } from "../service/todosService.js";
import { setTheme, themeHandler } from "../view/utility/theme-handler.js";
import { toggleVisiblity } from "../view/utility/visibility-toggler.js";
import { request } from "../view/utility/promise-handler.js";

//
// VARIABLES
//
const dataPopup = '[data-name="data-popup"]';
const defaultHiddenClass = "hidden";

//
// SELECTORS
//
const dataFormElements = document.querySelector(
  '[data-element="form"]'
).elements;

const todoList = document.querySelector('[data-element="todolist"]');
const addButton = document.querySelector('[data-action="add-data"]');
const saveButton = document.querySelector('[data-action="save"]');
const closeButton = document.querySelector('[data-action="close"]');
const themeToggler = document.querySelector('[data-action="theme-toggler"]');

const titleField = document.querySelector("#title");
const doneCheckbox = document.querySelector("#done");
const priorityOne = document.querySelector("#one");
const priorityTwo = document.querySelector("#two");
const priorityThree = document.querySelector("#three");

//
// FUNCTIONS
//

// Handle list items by event type
const handleTodoList = async (e) => {
  const item = e.target.closest("article");
  const id = item.dataset.id;

  // Delete an item
  if (
    e.target.closest("div") &&
    e.target.closest("div").matches('[data-action="delete"]')
  ) {
    deleteTodo(id);
  }

  //Edit an item
  if (
    e.target.closest("div") &&
    e.target.closest("div").matches('[data-action="edit"]')
  ) {
    toggleVisiblity(dataPopup, defaultHiddenClass);
    titleField.focus();

    const todoItem = await getTodo(id);

    dataFormElements.title.value = todoItem.title;
    dataFormElements.duedate.value = new Date(todoItem.dueDate)
      .toISOString()
      .slice(0, 10);

    if (updateArray[0].done === true) {
      dataFormElements.done.checked = true;
    }

    switch (updateArray[0].priority) {
      case "1":
        priorityOne.checked = true;
        break;
      case "2":
        priorityTwo.checked = true;
        break;
      case "3":
        priorityThree.checked = true;
        break;
      default:
        priorityOne.checked = true;
    }

    dataFormElements.setid.value = id;
  }
};

// Save or update new item
const saveTodo = () => {
  const todoItem = {
    title: dataFormElements.title.value,
    dueDate: "2022-07-29T22:00:00.000Z",
    priority: Number(dataFormElements.priority.value),
  };

  if (dataFormElements.setid.value) {
    todoItem._id = dataFormElements.setid.value;
  }
  return request("/todos", {
    method: "POST",
    body: JSON.stringify(todoItem),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Reset all inputs fields
const resetInputFields = () => {
  dataFormElements.setid.value = "";
  dataFormElements.title.value = "";
  dataFormElements.duedate.value = new Date().toISOString().slice(0, 10);
  doneCheckbox.checked = false;
  priorityThree.checked = true;
};

//
// EVENT LISTENERS
//
export const initUi = () => {
  saveButton.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await saveTodo();
      toggleVisiblity(dataPopup, defaultHiddenClass);
      resetInputFields();
      await loadList();
    } catch (error) {
      console.log("error upsert:", error.message);
    }
  });

  todoList.addEventListener("click", (e) => {
    handleTodoList(e);
    loadList();
  });

  closeButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleVisiblity(dataPopup, defaultHiddenClass);
    resetInputFields();
  });

  addButton.addEventListener("click", () => {
    resetInputFields();
    toggleVisiblity(dataPopup, defaultHiddenClass);
    titleField.focus();
  });

  themeToggler.addEventListener("click", () => {
    themeHandler();
  });

  window.addEventListener("DOMContentLoaded", () => setTheme());
};
