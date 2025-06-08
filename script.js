document.addEventListener('DOMContentLoaded', function() {
 const taskInput = document.getElementById('taskInput');
 const taskDateTime = document.getElementById('taskDateTime');
 const addTaskBtn = document.getElementById('addTaskBtn');
 const taskList = document.getElementById('taskList');
 const filterBtns = document.querySelectorAll('.filter-btn');
 
 let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
 let currentFilter = 'all';
 
 // Initialize the app
 function init() {
     renderTasks();
     addTaskBtn.addEventListener('click', addTask);
     taskInput.addEventListener('keypress', function(e) {
         if (e.key === 'Enter') addTask();
     });
     
     filterBtns.forEach(btn => {
         btn.addEventListener('click', function() {
             filterBtns.forEach(b => b.classList.remove('active'));
             this.classList.add('active');
             currentFilter = this.dataset.filter;
             renderTasks();
         });
     });
 }
 
 // Add a new task
 function addTask() {
     const text = taskInput.value.trim();
     const dateTime = taskDateTime.value;
     
     if (text) {
         const newTask = {
             id: Date.now(),
             text,
             completed: false,
             dueDate: dateTime || null,
             createdAt: new Date().toISOString()
         };
         
         tasks.unshift(newTask);
         saveTasks();
         renderTasks();
         
         // Clear input fields
         taskInput.value = '';
         taskDateTime.value = '';
     }
 }
 
 // Render tasks based on current filter
 function renderTasks() {
     taskList.innerHTML = '';
     
     let filteredTasks = [];
     
     switch (currentFilter) {
         case 'active':
             filteredTasks = tasks.filter(task => !task.completed);
             break;
         case 'completed':
             filteredTasks = tasks.filter(task => task.completed);
             break;
         default:
             filteredTasks = [...tasks];
     }
     
     if (filteredTasks.length === 0) {
         const emptyMessage = document.createElement('li');
         emptyMessage.textContent = 'No tasks found';
         emptyMessage.classList.add('empty-message');
         taskList.appendChild(emptyMessage);
         return;
     }
     
     filteredTasks.forEach(task => {
         const taskItem = document.createElement('li');
         taskItem.classList.add('task-item');
         taskItem.dataset.id = task.id;
         
         const taskContent = document.createElement('div');
         taskContent.classList.add('task-content');
         
         const checkbox = document.createElement('input');
         checkbox.type = 'checkbox';
         checkbox.classList.add('task-checkbox');
         checkbox.checked = task.completed;
         checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
         
         const taskText = document.createElement('span');
         taskText.classList.add('task-text');
         if (task.completed) taskText.classList.add('completed');
         taskText.textContent = task.text;
         
         const taskDue = document.createElement('span');
         taskDue.classList.add('task-due');
         if (task.dueDate) {
             const dueDate = new Date(task.dueDate);
             const now = new Date();
             
             taskDue.textContent = formatDate(dueDate);
             
             if (!task.completed && dueDate < now) {
                 taskDue.classList.add('overdue');
             }
         }
         
         const taskActions = document.createElement('div');
         taskActions.classList.add('task-actions');
         
         const editBtn = document.createElement('button');
         editBtn.innerHTML = '<i class="fas fa-edit"></i>';
         editBtn.title = 'Edit';
         editBtn.addEventListener('click', () => editTask(task.id));
         
         const deleteBtn = document.createElement('button');
         deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
         deleteBtn.title = 'Delete';
         deleteBtn.addEventListener('click', () => deleteTask(task.id));
         
         taskActions.appendChild(editBtn);
         taskActions.appendChild(deleteBtn);
         
         taskContent.appendChild(checkbox);
         taskContent.appendChild(taskText);
         taskItem.appendChild(taskContent);
         taskItem.appendChild(taskDue);
         taskItem.appendChild(taskActions);
         
         taskList.appendChild(taskItem);
     });
 }
 
 // Toggle task completion status
 function toggleTaskComplete(id) {
     tasks = tasks.map(task => {
         if (task.id === id) {
             return { ...task, completed: !task.completed };
         }
         return task;
     });
     saveTasks();
     renderTasks();
 }
 
 // Edit task text
 function editTask(id) {
     const task = tasks.find(task => task.id === id);
     if (!task) return;
     
     const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
     const taskText = taskItem.querySelector('.task-text');
     const taskContent = taskItem.querySelector('.task-content');
     
     const editInput = document.createElement('input');
     editInput.type = 'text';
     editInput.classList.add('edit-input');
     editInput.value = task.text;
     
     const saveEdit = () => {
         const newText = editInput.value.trim();
         if (newText && newText !== task.text) {
             task.text = newText;
             saveTasks();
         }
         renderTasks();
     };
     
     editInput.addEventListener('keypress', function(e) {
         if (e.key === 'Enter') saveEdit();
     });
     
     editInput.addEventListener('blur', saveEdit);
     
     taskContent.replaceChild(editInput, taskText);
     editInput.focus();
 }
 
 // Delete task
 function deleteTask(id) {
     tasks = tasks.filter(task => task.id !== id);
     saveTasks();
     renderTasks();
 }
 
 // Format date for display
 function formatDate(date) {
     const options = {
         weekday: 'short',
         year: 'numeric',
         month: 'short',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
     };
     return date.toLocaleDateString('en-US', options);
 }
 
 // Save tasks to localStorage
 function saveTasks() {
     localStorage.setItem('tasks', JSON.stringify(tasks));
 }
 
 // Initialize the app
 init();
});