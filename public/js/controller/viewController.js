// TODO: Edit an item fill out forms
// TODO: Dates
// TODO: Error handling
// TODO: Async actions in event listeners
// TODO: Sorting is buggy (a-z)
// TODO: Dummy Todos rausnehmen

// Imports
import { deleteTodo, getTodo, loadList } from "../service/todosService.js";
import { setTheme, themeHandler } from "../view/utility/theme-handler.js";
import { toggleVisiblity } from "../view/utility/visibility-toggler.js";
import { resetInputFields } from "../view/utility/reset-input.js";
import { request } from "../view/utility/promise-handler.js";
import { errorClassToggler } from "../view/utility/error-handler.js";
import {
  addButton,
  closeButton,
  dataFormElements,
  filterDone,
  priorityOne,
  priorityThree,
  priorityTwo,
  saveButton,
  sortBy,
  sortOrder,
  themeToggler,
  titleField,
  todoList,
} from "../view/utility/selectors.js";

// Set utility variables
const dataPopup = '[data-name="data-popup"]';
const defaultHiddenClass = "hidden";

// Default fetch data settings
let sortByState = "dueDate";
let sortOrderState = "desc";
let filterDoneState = false;

// Handle list items by button clicks
const listViewActions = async (e) => {
  const item = e.target.closest("article");
  const { id } = item.dataset;

  // CLICK DELETE: Delete an item
  if (
    e.target.closest("div") &&
    e.target.closest("div").matches('[data-action="delete"]')
  ) {
    deleteTodo(id);
  }

  // CLICK EDIT: Load item data into inputs
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

    if (todoItem.done === true) {
      dataFormElements.done.checked = true;
    }

    switch (todoItem.priority) {
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
        priorityThree.checked = true;
    }

    dataFormElements.setid.value = id;
  }
};

// Save item data (will be either post or put in backend, neDB upsert)
const saveTodo = (method) => {
  const todoItem = {
    title: dataFormElements.title.value,
    dueDate: dataFormElements.duedate.value,
    done: dataFormElements.done.checked,
    priority: Number(dataFormElements.priority.value),
  };

  if (dataFormElements.setid.value) {
    todoItem._id = dataFormElements.setid.value;
  }
  return request("/todos", {
    method: method || "POST",
    body: JSON.stringify(todoItem),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const initEventListeners = () => {
  saveButton.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await saveTodo();
      toggleVisiblity(dataPopup, defaultHiddenClass);
      resetInputFields();
      await loadList(sortByState, sortOrderState, filterDoneState);
    } catch (error) {
      // console.log("error upsert:", error.message);
      if (error.code === 102) {
        errorClassToggler(true);
      }
    }
  });

  filterDone.addEventListener("change", () => {
    if (filterDone.checked) {
      filterDone.checked = true;
      filterDoneState = true;
    } else {
      filterDone.checked = false;
      filterDoneState = false;
    }
    loadList(sortByState, sortOrderState, filterDoneState);
  });

  sortBy.addEventListener("change", () => {
    sortByState = sortBy.value;
    loadList(sortByState, sortOrderState, filterDoneState);
  });

  sortOrder.addEventListener("change", () => {
    if (sortOrder.checked) {
      sortOrder.checked = true;
      sortOrderState = "asc";
    } else {
      sortOrder.checked = false;
      sortOrderState = "desc";
    }
    loadList(sortByState, sortOrderState, filterDoneState);
  });

  todoList.addEventListener("click", (e) => {
    listViewActions(e);
    loadList(sortByState, sortOrderState, filterDoneState);
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
