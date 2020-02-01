"use strict";


const keyCode = {
    ENTER: 13
};

const todoStatus = {
    TODO: 'todo',
    DONE: 'done'
};

const filter = {
    ALL: 'all',
    DONE: 'done',
    TODO: 'todo'
};

const todoList = [{
        name: 'Zadanie 1',
        status: todoStatus.TODO
    },
    {
        name: 'Zadanie 2',
        status: todoStatus.DONE
    },
    {
        name: 'Zadanie 3',
        status: todoStatus.TODO
    },
    {
        name: 'Zadanie 4',
        status: todoStatus.TODO
    }
];

const listElement = document.querySelector('.list');
const templateElement = document.getElementById('todoTemplate');
const templateContainer = 'content' in templateElement ? templateElement.content : templateElement;
const inputElement = document.querySelector('.add-task__input');
const filterElement = document.querySelector('.filters');
let currentFilter = filter.ALL;

const statsAllElement = document.querySelector('.statistic__total');
const statsDoneElement = document.querySelector('.statistic__done');
const statsTodoElement = document.querySelector('.statistic__left');

function getTodoElement({ name, status }) {
    const newElement = templateContainer.querySelector('.task').cloneNode(true);
    const nameElement = newElement.querySelector('.task__name');

    nameElement.textContent = name;
    newElement.dataset.name = name;
    setStatus(newElement, status);

    return newElement;
}

function renderList(todos = []) {

    listElement.innerHTML = '';

    const fragment = document.createDocumentFragment();

    todos.forEach(todo => {
        fragment.appendChild(getTodoElement(todo));
    });

    listElement.appendChild(fragment);
}

function setStatus(todoElement, status) {
    const isTodo = status === todoStatus.TODO;

    todoElement.classList.toggle('task_todo', isTodo);
    todoElement.classList.toggle('task_done', !isTodo);
}

function changeStatus(todoElement) {
    const index = getTodoIndexByName(todoElement.dataset.name);
    const todo = todoList[index];
    const isTodo = todo.status === todoStatus.TODO;
    const newStatus = isTodo ? todoStatus.DONE : todoStatus.TODO;

    todo.status = newStatus;
}

function checkTodo(todoElement) {
    return todoElement.classList.contains('task_todo');
}

function checkStatusBtn(element) {
    return element.classList.contains('task__status');
}

function checkDeleteBtn(element) {
    return element.classList.contains('task__delete-button');
}

function deleteTodo(element) {
    const index = getTodoIndexByName(element.dataset.name);

    todoList.splice(index, 1);
}

function onListClick(event) {
    const { target } = event;

    if (checkStatusBtn(target)) {
        changeStatus(target.parentElement);
        renderFilteredList();
        return;
    }

    if (checkDeleteBtn(target)) {
        deleteTodo(target.parentElement);
        renderFilteredList();
    }
}

function getTodoIndexByName(search) {
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].name === search) {
            return i;
        }
    }
}

function onInputKeydown(event) {
    if (event.keyCode !== keyCode.ENTER) {
        return;
    }

    if (!inputElement.value) {
        return;
    }

    const newName = inputElement.value;

    if (checkTodoExists(newName)) {
        return;
    }

    addNewTodo(newName);
    inputElement.value = '';
}

function checkTodoExists(newName) {
    const elements = listElement.querySelectorAll('.task__name');
    const names = [...elements].map(element => element.textContent);

    return names.indexOf(newName) !== -1;
}

// function checkTodoExists(newName) {
//     return todoList.some(({name}) => name === newName);
// }

function addNewTodo(name) {
    const todo = {
        name,
        status: todoStatus.TODO
    };

    todoList.unshift(todo);
    renderFilteredList();
}

function onFiltersClick({ target }) {
    const newFilter = target.dataset.filter;

    if (!newFilter || newFilter === currentFilter) {
        return;
    }

    currentFilter = newFilter;
    filterElement.querySelector('.filters__item_selected').classList.remove('filters__item_selected');
    target.classList.add('filters__item_selected');

    renderFilteredList();
}

function renderFilteredList() {
    let todos;

    if (currentFilter === filter.ALL) {
        todos = todoList.slice();
    } else {
        const filterStatus = currentFilter === filter.TODO ? todoStatus.TODO : todoStatus.DONE;

        todos = todoList.filter(({ status }) => status === filterStatus);
    }

    renderList(todos);
    updateStats();
}

function updateStats() {
    const total = todoList.length;
    const done = todoList.filter(({ status }) => status === todoStatus.DONE).length;

    statsAllElement.textContent = total;
    statsDoneElement.textContent = done;
    statsTodoElement.textContent = total - done;
}


listElement.addEventListener('click', onListClick);
inputElement.addEventListener('keydown', onInputKeydown);
filterElement.addEventListener('click', onFiltersClick);
renderFilteredList();