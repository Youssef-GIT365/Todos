const todoInput = document.getElementById("todoInput");
const searchInput = document.getElementById("searchInput");
const todoList = document.getElementById("todoList");
const allCount = document.getElementById("allCount");
const completedCount = document.getElementById("completedCount");
const deletedCountDisplay = document.getElementById("deletedCount");
const markAllCheckbox = document.getElementById("markAll");
const markAllText = document.getElementById("markAllText");
const clearCompleted = document.getElementById("clearCompleted");

let todos = JSON.parse(localStorage.getItem("todos"));
let deletedCounter = parseInt(localStorage.getItem("deletedCounter"));
if (!todos) todos = [];
if (isNaN(deletedCounter)) deletedCounter = 0;
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("deletedCounter", deletedCounter);
  render();
}

todoInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && todoInput.value.trim() !== "") {
    todos.push({
      id: Date.now(),
      text: todoInput.value.trim(),
      completed: false,
    });
    todoInput.value = "";
    save();
  }
});

searchInput.addEventListener("input", render);

function render() {
  const searchText = searchInput.value.toLowerCase();
  todoList.innerHTML = "";

  todos
    .filter((t) => t.text.toLowerCase().includes(searchText))
    .forEach((todo) => {
      const li = document.createElement("li");
      if (todo.completed) li.classList.add("completed");

      li.innerHTML = `
      <input type="checkbox" ${todo.completed ? "checked" : ""} class="toggle">
      <span class="todo-text">${todo.text}</span>
      <button class="destroy">✖</button>
    `;

      li.querySelector(".toggle").onchange = () => {
        todo.completed = !todo.completed;
        save();
      };

      li.querySelector(".destroy").onclick = () => {
        todos = todos.filter((t) => t.id !== todo.id);
        deletedCounter++;
        save();
      };

      li.querySelector(".todo-text").ondblclick = () => {
        const originalText = todo.text;
        li.innerHTML = `<input type="text" class="edit-input" value="${originalText}">`;
        const input = li.querySelector(".edit-input");
        input.focus();

        const finishEdit = () => {
          const newValue = input.value.trim();
          if (newValue) {
            todo.text = newValue;
            save();
          } else {
            render();
          }
        };

        input.onblur = finishEdit;
        input.onkeypress = (e) => {
          if (e.key === "Enter") finishEdit();
        };
      };

      todoList.appendChild(li);
    });
  update();
}

function update() {
  const completed = todos.filter((t) => t.completed).length;
  allCount.innerText = todos.length;
  completedCount.innerText = completed;
  deletedCountDisplay.innerText = deletedCounter;
  clearCompleted.style.display = completed > 0 ? "block" : "none";
}

markAllCheckbox.onchange = () => {
  todos.forEach((t) => (t.completed = markAllCheckbox.checked));
  save();
};

markAllText.onclick = () => {
  markAllCheckbox.checked = !markAllCheckbox.checked;
  markAllCheckbox.onchange();
};

clearCompleted.onclick = () => {
  const before = todos.length;
  todos = todos.filter((t) => !t.completed);
  deletedCounter += before - todos.length;
  save();
};

render();
