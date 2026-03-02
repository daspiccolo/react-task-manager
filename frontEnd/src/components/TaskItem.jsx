export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
      <p className={task.status === "done" ? "line-through text-slate-400" : ""}>
        {task.title}
      </p>

      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className="px-3 py-1 rounded-lg bg-green-100 hover:bg-green-200"
          title="Toggle done"
        >
          ✓
        </button>
//button de delete
        <button
          onClick={onDelete}
          className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200"
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
}