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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 p-10">
      {/* Full width container */}
      <div className="w-full px-2 md:px-6 lg:px-12 space-y-8">
        {/* Header (desktop style) */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-5">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Task Manager</h1>
            <p className="text-slate-600 mt-1">
              Welcome back, <span className="font-medium">{user?.name}</span>
            </p>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="w-full md:w-auto rounded-xl border px-5 py-2 bg-white hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>

        {/* Add task */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
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
              Add
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border px-4 py-3 bg-white md:w-40"
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
          </div>

          {/* Error */}
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

          {/* Loading */}
          {status === "loading" && (
            <div className="mt-4 rounded-xl border bg-white p-4 text-slate-600">
              Loading tasks...
            </div>
          )}
        </div>

        {/* Tasks list (full width grid) */}
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Your tasks
              <span className="ml-2 text-slate-500 font-normal">
                ({filteredTasks.length})
              </span>
            </h2>

            <p className="text-sm text-slate-500">
              Tip: Use filters + search to find tasks quickly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {status !== "loading" &&
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() =>
                    dispatch(
                      updateTask({
                        id: task.id,
                        data: {
                          status: task.status === "done" ? "todo" : "done",
                        },
                      })
                    )
                  }
                  onDelete={() => dispatch(deleteTask(task.id))}
                />
              ))}
          </div>

          {status !== "loading" && filteredTasks.length === 0 && (
            <p className="text-slate-500 text-center py-10">
              No tasks found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}