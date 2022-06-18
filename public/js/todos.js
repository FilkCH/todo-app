import Mustache from 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js';
import { listTemplate, emptyListTemplate } from './templates/list.js';

export const loadList = async () => {
    const todosResponse = await fetch('/todos');
    const todos = await todosResponse.json();

    const listNode = document.querySelector('#todo-item-template');
    const renderedTemplate = Mustache.render(todos.total ? listTemplate : emptyListTemplate, todos);
    listNode.innerHTML = renderedTemplate;
}


export const addTodo = async (todoItem) => {
    await fetch('/todos', {
        method: 'POST',
        body: JSON.stringify(todoItem),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    loadList();
}
