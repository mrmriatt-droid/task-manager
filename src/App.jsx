import { useEffect, useState } from "react";
import "./App.css";
function App() {
  //استدعاء الحفظ
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  //الحفظ
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  //دالة التعديل
  function startEditing(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
  }
  //حفظ التعديل
  function saveEdit(id) {
    if (!editTitle.trim()) return;

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: editTitle.trim() } : task,
      ),
    );
    setEditingId(null);
    setEditTitle("");
  }
  //دالة الاضافة
  function addTask() {
    if (!newTaskTitle.trim()) return;

const taskExists = tasks.some((task) =>
  task.title.toLowerCase() === newTaskTitle.trim().toLowerCase()
);

if(taskExists){
  alert("This task already exists!");
  return;
}
    const newTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  }

  //دالة الاكمال
  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  //دالة الحذف
  function deleteTask(id) {
    const confirmed  = window.confirm("Are you sure you want to delete this task?");
    if(!confirmed)return;
    setTasks(tasks.filter((task) => task.id !== id));
  }
  //فلترة العداد مكتمل وغير
  const completedTasks = tasks.filter((task) => task.completed).length;
  const remainingTasks = tasks.filter((task) => !task.completed).length;
  // نسبة الانجاز
  const progress =
    completedTasks === 0 ? 0 : (completedTasks / tasks.length) * 100;
  //فلترة البحث والتصنيف
  const filteredTasks = tasks.filter((task) => {
    // البحث
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    //التصنيف
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <h1>Task Manager</h1>
      <p>Organize your daily tasks.</p>
      <p>
        Remaining : {remainingTasks} | Completed : {completedTasks}
      </p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p>{Math.round(progress)}% completed</p>

      <div className="inp">
        <input
          type="text"
          placeholder="Enter a task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
        />
        <button onClick={addTask}>Add Task</button>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <ul className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty-message">No tasks found. Add a new task!</p>
        ) : (
          filteredTasks.map((task) => (
            <li key={task.id}>
              {editingId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span className={task.completed ? "completed-task" : ""}>
                    {task.title}
                  </span>
                  <button onClick={() => toggleTask(task.id)}>
                    {task.completed ? "Undo" : "complete"}
                  </button>
                  <button onClick={() => startEditing(task)}>Edit</button>
                  <button onClick={() => deleteTask(task.id)}>Delete</button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
export default App;
