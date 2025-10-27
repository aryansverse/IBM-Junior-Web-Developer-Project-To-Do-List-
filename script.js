document.addEventListener('DOMContentLoaded', () => {
    // Working to-do list script
    const taskInput = document.querySelector('#nav1 input');
    const addButton = document.getElementById('push');
    const taskList = document.querySelector('.task');

    // guard: ensure required elements exist
    if (!taskInput || !addButton || !taskList) return;

    // tasks stored as array of { id, text, done }
    let tasks = [];

// Load tasks from localStorage
function loadTasks() {
    try {
        const raw = localStorage.getItem('tasks');
        tasks = raw ? JSON.parse(raw) : [];
    } catch (e) {
        tasks = [];
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

    function renderTasks() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            const no = document.createElement('div');
            no.className = 'no-tasks';
            no.textContent = 'No tasks yet';
            taskList.appendChild(no);
            return;
        }

        tasks.forEach((t) => {
        const item = document.createElement('div');
        item.className = 'task-item';
        item.dataset.id = t.id;

        const label = document.createElement('label');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'check-task';
        checkbox.checked = !!t.done;

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = t.text; // textContent prevents XSS

        label.appendChild(checkbox);
        label.appendChild(span);

        const del = document.createElement('button');
        del.className = 'delete';
        del.type = 'button';
        del.setAttribute('aria-label', 'Delete task');
        del.textContent = 'Delete';

        item.appendChild(label);
        item.appendChild(del);
        taskList.appendChild(item);
    });
    }

    function createTask() {
    const text = taskInput.value.trim();
    if (!text) {
        alert('Please enter a task');
        return;
    }
    const task = { id: String(Date.now()), text, done: false };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

    // Event: add by button
    addButton.addEventListener('click', createTask);

    // Event: add by Enter key
    taskInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') createTask();
    });

    // Event delegation for delete and toggle
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            const item = e.target.closest('.task-item');
            const id = item?.dataset.id;
            tasks = tasks.filter((t) => t.id !== id);
            saveTasks();
            renderTasks();
        }
    });

    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('check-task')) {
            const item = e.target.closest('.task-item');
            const id = item?.dataset.id;
            const task = tasks.find((t) => t.id === id);
            if (task) {
                task.done = e.target.checked;
                saveTasks();
                renderTasks();
            }
        }
    });

    // Initialize
    loadTasks();
    renderTasks();
});