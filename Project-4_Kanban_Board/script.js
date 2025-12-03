let taskData = {};

// Variable :- Task Container & tasks
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const tasks = document.querySelectorAll(".task");

// --------------------------------

// Variable :- New Task Creattion and new task Form

const toggleTaskModelBtn = document.querySelector("#new-task-btn");
const taskModel = document.querySelector(".task-model");
const taskModelBg = document.querySelector(".bg");
const addTaskBtn = document.querySelector("#add-new-task");

// ---------------------------------

// Function

function createTask(title, desc, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button>Delete</button>
  `;

  column.appendChild(div);

  div.addEventListener("drag", (e) => {
    dragElement = div;
  });

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click", () => {
    div.remove();
    updateTaskCount();
  });
  return div;
}

function updateTaskCount() {
  [todo, progress, done].forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    taskData[col.id] = Array.from(tasks).map((tsk) => {
      return {
        title: tsk.querySelector("h2").innerText,
        desc: tsk.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(taskData));

    count.innerHTML = tasks.length;
  });
}

// ---------------------------------------

// Get All Data from LocalStorage if available

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);

    data[col].forEach((task) => {
      createTask(task.title, task.desc, column);
    });
  }

  updateTaskCount();
}

// ----------------------------------------

// Darg and drop feature

let dragElement = null;

tasks.forEach((task) => {
  task.addEventListener("drag", (e) => {
    dragElement = task;
  });
});

function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    updateTaskCount();
  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// ---------------------------------

// New task Form toggle feature

toggleTaskModelBtn.addEventListener("click", () => {
  taskModel.classList.toggle("active");
});

taskModelBg.addEventListener("click", () => {
  taskModel.classList.toggle("active");
});

// New task add feature

addTaskBtn.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#taskt-desc-input").value;

  createTask(taskTitle, taskDesc, todo);

  updateTaskCount();

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#taskt-desc-input").value = "";

  taskModel.classList.remove("active");
});
