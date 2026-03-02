import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  clearTasksError,
} from "../features/tasks/tasksSlice";
import TaskItem from "../components/TaskItem";
import AppShell from "../components/AppShell";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { items: tasks, status, error } = useSelector((s) => s.tasks);

  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all"); // all | todo | done
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.id) dispatch(fetchTasks(user.id));
  }, [dispatch, user?.id]);

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
    <AppShell
      userName={user?.name || "User"}
      active="dashboard"
      onSignOut={() => dispatch(logout())}
    >
      {/* Page title */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Manage your tasks with filters, search, and status toggles.
          </p>
        </div>
      </div>

      {/* Controls card */}
      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task..."
            className="flex-1 rounded-xl border px-4 py-3"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Add task
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border px-4 py-3 bg-white md:w-44"
          >
            <option value="all">All</option>
            <option value="todo">To do</option>
            <option value="done">Done</option>
          </select>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 rounded-xl border px-4 py-3"
          />

          <div className="text-sm text-slate-500 md:ml-auto">
            Showing <span className="font-medium text-slate-900">{filteredTasks.length}</span>{" "}
            tasks
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearTasksError())}
              className="rounded-lg border px-2 py-1 bg-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="mt-4 rounded-xl border bg-white p-4 text-slate-600">
            Loading tasks...
          </div>
        )}
      </div>

      {/* Tasks grid */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
        </div>

        {status !== "loading" && filteredTasks.length === 0 && (
          <p className="text-slate-500 text-center py-12">No tasks found.</p>
        )}
      </div>
    </AppShell>
  );
}