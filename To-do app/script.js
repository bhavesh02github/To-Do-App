const form = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const pendingTasksList = document.getElementById('pending-tasks-list');
const completedTasksList = document.getElementById('completed-tasks-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
  pendingTasksList.innerHTML = '';
  completedTasksList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = task.text;
    li.appendChild(taskTextSpan);

    const dateAddedSpan = document.createElement('span');
    dateAddedSpan.textContent = task.dateAdded ? `Added on: ${formatDate(task.dateAdded)}` : '';
    li.appendChild(dateAddedSpan);

    if (task.dueDate) {
      const dueDateSpan = document.createElement('span');
      dueDateSpan.textContent = `Due on: ${formatDate(task.dueDate)}`;
      li.appendChild(dueDateSpan);
    }

    if (task.completed) {
      li.classList.add('completed');

      const dateCompletedSpan = document.createElement('span');
      dateCompletedSpan.textContent = task.dateCompleted ? `Completed on: ${formatDate(task.dateCompleted)}` : '';
      li.appendChild(dateCompletedSpan);

      const incompleteButton = document.createElement('button');
      incompleteButton.textContent = 'Incomplete';
      incompleteButton.classList.add('incomplete-button');
      incompleteButton.addEventListener('click', () => {
        toggleTaskStatus(index);
      });
      li.appendChild(incompleteButton);
    } else {
      const completeButton = document.createElement('button');
      completeButton.textContent = 'Complete';
      completeButton.classList.add('complete-button');
      completeButton.addEventListener('click', () => {
        toggleTaskStatus(index);
      });
      li.appendChild(completeButton);
    }

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => {
      editTask(index);
    });
    li.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
      deleteTask(index);
    });
    li.appendChild(deleteButton);

    if (task.completed) {
      completedTasksList.appendChild(li);
    } else {
      pendingTasksList.appendChild(li);
    }
  });

  saveTasks();
}

function addTask(text, dueDate) {
  const newTask = {
    text,
    dueDate,
    completed: false,
    dateAdded: new Date().toISOString(),
    dateCompleted: null,
  };

  tasks.push(newTask);
  renderTasks();
}

function toggleTaskStatus(index) {
  tasks[index].completed = !tasks[index].completed;
  tasks[index].dateCompleted = tasks[index].completed ? new Date().toISOString() : null;
  renderTasks();
}

function editTask(index) {
  const editedText = prompt('Edit the task:', tasks[index].text);
  if (editedText !== null) {
    tasks[index].text = editedText;
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(dateTimeString) {
  const date = new Date(dateTimeString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value.trim();
  if (taskText !== '') {
    addTask(taskText, dueDate);
    taskInput.value = '';
    dueDateInput.value = '';
  }
});

pendingTasksList.addEventListener('click', (event) => {
  if (event.target.classList.contains('complete-button')) {
    const li = event.target.closest('li');
    const index = Array.from(pendingTasksList.children).indexOf(li);
    toggleTaskStatus(index);
  }
});

completedTasksList.addEventListener('click', (event) => {
  if (event.target.classList.contains('incomplete-button')) {
    const li = event.target.closest('li');
    const index = Array.from(completedTasksList.children).indexOf(li);
    toggleTaskStatus(index);
  }
});

renderTasks();
