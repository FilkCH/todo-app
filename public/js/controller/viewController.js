// TODO: Filter and sorting functions

import { addTodo, deleteTodo, loadList } from "../service/todosService.js";
import { themeHandler, setTheme } from "../view/utility/utility-theme-handler.js";
import { toggleVisiblity } from "../view/utility/utility-visibility-toggler.js";


//
// VARIABLES
//
const dataPopup = '[data-name="data-popup"]';
const settingsPopup = '[data-name="settings-popup"]';
const defaultHiddenClass = 'hidden';

//
// SELECTORS
//
const dataFormElements = document.querySelector('[data-element="form"]').elements;

const todoList = document.querySelector('[data-element="todolist"]');
const addButton = document.querySelector('[data-action="add-data"]');
const settingsButton = document.querySelector('[data-action="settings-data"]');
const saveButton = document.querySelector('[data-action="save"]');
const closeButton = document.querySelector('[data-action="close"]');
const themeToggler = document.querySelector('[data-action="theme-toggler"]');

const titleField = document.querySelector('#title');
const doneCheckbox = document.querySelector('#done');
const priorityOne = document.querySelector('#one');
const priorityTwo = document.querySelector('#two');
const priorityThree = document.querySelector('#three');


//
// FUNCTIONS
//

// Handle list items by event type
const handleTodoList = (e) => {
    const item = e.target.closest('article');
    const id = item.dataset.id;

    // Delete an item
    if (e.target.closest('div') && e.target.closest('div').matches('[data-action="delete"]')) {
        deleteTodo(id);
    }

    // Edit an item
    // if (e.target.closest('div') && e.target.closest('div').matches('[data-action="edit"]')) {
    //     toggleVisiblity(dataPopup, defaultHiddenClass);
    //     titleField.focus();
    //
    //     const updateArray = todoArray.filter(entry => entry.creationDate === id);
    //
    //     dataFormElements.title.value = updateArray[0].title;
    //     dataFormElements.duedate.value = new Date(updateArray[0].dueDate).toISOString().slice(0,10);
    //
    //     if (updateArray[0].done === true) {
    //         dataFormElements.done.checked = true;
    //     }
    //
    //     switch (updateArray[0].priority) {
    //         case '1':
    //             priorityOne.checked = true;
    //             break;
    //         case '2':
    //             priorityTwo.checked = true;
    //             break;
    //         case '3':
    //             priorityThree.checked = true;
    //             break;
    //         default:
    //             priorityOne.checked = true;
    //     }
    //
    //     dataFormElements.setid.value = id;
    // }
};

// Save a new item
const saveTodo = async (e) => {
    e.preventDefault();

    await addTodo({
        title: dataFormElements.title.value,
        dueDate: new Date(dataFormElements.duedate.value).toISOString(),
        priority: Number(dataFormElements.priority.value)
    })

    // if (!dataFormElements.setid.value) {
    //     todoArray.unshift({
    //         creationDate: Date.now(),
    //         dueDate: Date.parse(dataFormElements.duedate.value) || Date.now(),
    //         title: dataFormElements.title.value || "Ohne Titel",
    //         done: dataFormElements.done.checked || false,
    //         priority: dataFormElements.priority.value
    //     });
    // } else {
    //     const foundItem = todoArray.find(entry => entry.creationDate === parseInt(dataFormElements.setid.value, 10));
    //     foundItem.title = dataFormElements.title.value || "Ohne Titel";
    //     foundItem.done = dataFormElements.done.checked || false;
    // }

};

// Reset all inputs fields
const resetInputFields = () => {
    dataFormElements.setid.value = '';
    dataFormElements.title.value = '';
    dataFormElements.duedate.value = new Date().toISOString().slice(0,10);
    doneCheckbox.checked = false;
    priorityThree.checked = true;
};



//
// EVENT LISTENERS
//
export const initUi = () => {
    saveButton.addEventListener('click', (e) => {
        saveTodo(e);
        toggleVisiblity(dataPopup, defaultHiddenClass);
        resetInputFields();
        loadList();
    });

    todoList.addEventListener("click", (e) => {
        handleTodoList(e);
        loadList();
    });

    closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleVisiblity(dataPopup, defaultHiddenClass);
        resetInputFields();
    });

    addButton.addEventListener('click', () => {
        resetInputFields();
        toggleVisiblity(dataPopup, defaultHiddenClass);
        titleField.focus();
    });

    settingsButton.addEventListener('click', () => {
        toggleVisiblity(settingsPopup, defaultHiddenClass);
    });

    themeToggler.addEventListener('click', () => {
        themeHandler();
    });

    window.addEventListener("DOMContentLoaded", () => setTheme());
}