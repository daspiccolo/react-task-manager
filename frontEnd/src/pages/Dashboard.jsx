import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { fetchTasks, addTask, updateTask, deleteTask, clearTasksError } from "../features/tasks/tasksSlice";
import TaskItem from "../components/TaskItem";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { items: tasks, status, error } = useSelector((s) => s.tasks);

  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all"); // all | todo | done
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchTasks(user.id));
  }, [dispatch, user.id]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === "todo") return t.status === "todo";
        if (filter === "done") return t.status === "done";
        return true;
      })
      .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, filter, search]);

  const handleAdd = async () => {
    const value = title.trim();
    if (!value) return;

    await dispatch(
      addTask({
        title: value,
        status: "todo",
        userId: user.id,
        createdAt: new Date().toISOString(),
      })
    );

    setTitle("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Task Manager</h1>
            <p className="text-slate-600 mt-1">Hi, {user?.name}</p>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="rounded-xl border px-4 py-2 bg-white hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>

        {/* Add task */}
        <div className="flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task..."
            className="flex-1 rounded-xl border px-3 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border px-3 py-2 bg-white"
          >
            <option value="all">All</option>
            <option value="todo">To do</option>
            <option value="done">Done</option>
          </select>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 rounded-xl border px-3 py-2"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearTasksError())}
              className="rounded-lg border px-2 py-1 bg-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="rounded-xl border bg-white p-4 text-slate-600">
            Loading tasks...
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {status !== "loading" &&
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={() =>
                  dispatch(
                    updateTask({
                      id: task.id,
                      data: { status: task.status === "done" ? "todo" : "done" },
                    })
                  )
                }
                onDelete={() => dispatch(deleteTask(task.id))}
              />
            ))}

          {status !== "loading" && filteredTasks.length === 0 && (
            <p className="text-slate-500 text-center">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}