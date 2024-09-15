// Select necessary elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterCategory = document.getElementById('filter-category');
const filterStatus = document.getElementById('filter-status');

// Dark Mode
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeLabel = document.getElementById('dark-mode-label');
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
    darkModeLabel.textContent = 'Light Mode';
}

darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        darkModeLabel.textContent = 'Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        darkModeLabel.textContent = 'Dark Mode';
    }
});

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const category = filterCategory.value;

    if (taskText !== '') {
        const li = document.createElement('li');
        li.textContent = `${taskText} (${category})`;

        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = deleteTask;

        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        taskInput.value = '';
        saveTasks();
    }
}

// Function to delete a task
function deleteTask(event) {
    const task = event.target.parentElement;
    task.remove();
    saveTasks();
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#task-list li').forEach((task) => {
        tasks.push(task.textContent);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = deleteTask;

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Filter tasks based on category and completion status
function filterTasks() {
    const category = filterCategory.value;
    const status = filterStatus.value;

    document.querySelectorAll('#task-list li').forEach((task) => {
        const taskText = task.textContent.toLowerCase();
        const isCompleted = task.classList.contains('completed');

        // Filter by category
        const matchesCategory = category === 'All' || taskText.includes(category.toLowerCase());

        // Filter by status
        let matchesStatus = true;
        if (status === 'Completed') {
            matchesStatus = isCompleted;
        } else if (status === 'Pending') {
            matchesStatus = !isCompleted;
        }

        // Show or hide tasks based on filter
        if (matchesCategory && matchesStatus) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

// Add event listeners for filters
filterCategory.addEventListener('change', filterTasks);
filterStatus.addEventListener('change', filterTasks);

// Load tasks on page load
window.onload = loadTasks;

// Add a task with the "Add Task" button or by pressing enter
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});
