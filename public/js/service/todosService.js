import Mustache from 'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js';
import { listTemplate, emptyListTemplate } from '../view/listView.js';

export const loadList = async () => {
    const todosResponse = await fetch('/todos');
    const todos = await todosResponse.json();

    const listNode = document.querySelector('#todo-item-template');
    listNode.innerHTML = Mustache.render(todos.total ? listTemplate : emptyListTemplate, todos);
}

export const addTodo = async (todoItem) => {
    await fetch('/todos', {
        method: 'POST',
        body: JSON.stringify(todoItem),
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json()).then(result =>  {
        console.log(result.message);
    });
    loadList();
}

export const deleteTodo = async (todoItem) => {
    await fetch(`/todos/${todoItem}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    loadList();
}
