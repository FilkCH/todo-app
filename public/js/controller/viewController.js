import { deleteTodo, getTodo, loadList } from "../service/todosService.js";
import { setTheme, themeHandler } from "../view/utility/theme-handler.js";
import { toggleVisiblity } from "../view/utility/visibility-toggler.js";
import { errorClassToggler } from "../view/utility/error-handler.js";
import { resetInputFields } from "../view/utility/reset-input.js";
import { request } from "../view/utility/promise-handler.js";
import {
  dataFormElements,
  priorityThree,
  themeToggler,
  priorityOne,
  closeButton,
  priorityTwo,
  saveButton,
  filterDone,
  titleField,
  sortOrder,
  addButton,
  todoList,
  sortBy,
} from "../view/utility/selectors.js";

// TODO: Edit an item fill out forms
// TODO: Save done status at creation
// TODO: Dummy Todos rausnehmen
// TODO: Firefox styles
// TODO: Title input offset on mobile

// Set utility variables
const dataPopup = '[data-name="data-popup"]';
const defaultHiddenClass = "hidden";
const loadlistError = "Todo items could not be loaded. Unknown backend error.";
const deleteError = "Todo item could not be deleted. Unknown backend error.";
const saveError = "Todo item could not be saved. Unknown backend error.";
let errorMessage;

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
    try {
      await deleteTodo(id);
    } catch (error) {
      errorMessage = error.message || deleteError;
      alert(errorMessage);
    }
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

// Setting up the event listeners
export const initEventListeners = () => {
  saveButton.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await saveTodo();
      toggleVisiblity(dataPopup, defaultHiddenClass);
      resetInputFields();
      await loadList(sortByState, sortOrderState, filterDoneState);
    } catch (error) {
      if (error.code === 102) {
        errorClassToggler(true);
      } else {
        errorMessage = error.message || saveError;
        alert(errorMessage);
      }
    }
  });

  filterDone.addEventListener("change", async () => {
    if (filterDone.checked) {
      filterDone.checked = true;
      filterDoneState = true;
    } else {
      filterDone.checked = false;
      filterDoneState = false;
    }

    try {
      await loadList(sortByState, sortOrderState, filterDoneState);
    } catch (error) {
      errorMessage = error.message || loadlistError;
      alert(errorMessage);
    }
  });

  sortBy.addEventListener("change", async () => {
    sortByState = sortBy.value;
    try {
      await loadList(sortByState, sortOrderState, filterDoneState);
    } catch (error) {
      errorMessage = error.message || loadlistError;
      alert(errorMessage);
    }
  });

  sortOrder.addEventListener("change", async () => {
    if (sortOrder.checked) {
      sortOrder.checked = true;
      sortOrderState = "asc";
    } else {
      sortOrder.checked = false;
      sortOrderState = "desc";
    }

    try {
      await loadList(sortByState, sortOrderState, filterDoneState);
    } catch (error) {
      errorMessage = error.message || loadlistError;
      alert(errorMessage);
    }
  });

  todoList.addEventListener("click", async (e) => {
    await listViewActions(e);

    try {
      await loadList(sortByState, sortOrderState, filterDoneState);
    } catch (error) {
      errorMessage = error.message || loadlistError;
      alert(errorMessage);
    }
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
