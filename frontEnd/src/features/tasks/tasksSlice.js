import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export const fetchTasks = createAsyncThunk("tasks/fetch", async (userId) => {
  const res = await api.get("/tasks");
  return res.data
    .filter((t) => String(t.userId) === String(userId))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
});

export const addTask = createAsyncThunk("tasks/add", async (task) => {
  const res = await api.post("/tasks", task);
  return res.data;
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, data }) => {
  const res = await api.patch(`/tasks/${id}`, data);
  return res.data;
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id) => {
  await api.delete(`/tasks/${id}`);
  return id;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearTasksError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => String(t.id) === String(action.payload.id));
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => String(t.id) !== String(action.payload));
      });
  },
});

export const { clearTasksError } = tasksSlice.actions;
export default tasksSlice.reducer;