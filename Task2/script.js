const form = document.querySelector(".todo-form");
const input = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const taskCount = document.querySelector("#taskCount");
const emptyState = document.querySelector("#emptyState");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.querySelector("#clearCompleted");

let tasks = JSON.parse(localStorage.getItem("taskflow.tasks")) || [];
let currentFilter = localStorage.getItem("taskflow.filter") || "all";

function saveTasks() {
  localStorage.setItem("taskflow.tasks", JSON.stringify(tasks));
}

function saveFilter() {
  localStorage.setItem("taskflow.filter", currentFilter);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });
}

function getVisibleTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

function updateStats() {
  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = remaining;
  clearCompletedBtn.style.visibility = tasks.some((task) => task.completed)
    ? "visible"
    : "hidden";
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = `task${task.completed ? " completed" : ""}`;
  li.dataset.id = task.id;

  li.innerHTML = `
    <div class="task-left" role="button" tabindex="0" aria-label="Toggle task completion">
      <button class="check-btn" type="button" aria-label="Mark task status">
        ${task.completed ? "✓" : ""}
      </button>

      <div class="task-content">
        <span class="task-title">${escapeHtml(task.text)}</span>
        <span class="task-meta">${task.completed ? "Completed" : "Active"}</span>
      </div>
    </div>

    <button class="delete-btn" type="button" aria-label="Delete task">×</button>
  `;

  return li;
}

function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = getVisibleTasks();

  if (visibleTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    visibleTasks.forEach((task) => {
      taskList.appendChild(createTaskElement(task));
    });
  }

  updateStats();
  saveTasks();
  saveFilter();
}

function addTask(text) {
  tasks.unshift({
    id: Date.now(),
    text,
    completed: false
  });

  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id
      ? { ...task, completed: !task.completed }
      : task
  );

  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskText = input.value.trim();

  if (!taskText) return;

  addTask(taskText);
  input.value = "";
  input.focus();
});

taskList.addEventListener("click", (event) => {
  const taskItem = event.target.closest(".task");
  if (!taskItem) return;

  const id = Number(taskItem.dataset.id);

  if (event.target.closest(".delete-btn")) {
    deleteTask(id);
    return;
  }

  if (event.target.closest(".task-left") || event.target.closest(".check-btn")) {
    toggleTask(id);
  }
});

taskList.addEventListener("keydown", (event) => {
  const taskLeft = event.target.closest(".task-left");
  if (!taskLeft) return;

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    const taskItem = event.target.closest(".task");
    if (taskItem) {
      toggleTask(Number(taskItem.dataset.id));
    }
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  renderTasks();
});

renderTasks();