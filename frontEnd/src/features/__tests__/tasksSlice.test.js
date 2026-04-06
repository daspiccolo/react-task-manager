import { describe, it, expect } from "vitest";
import tasksReducer from "../tasks/tasksSlice";

describe("tasksSlice", () => {
  it("should return the initial state", () => {
    const state = tasksReducer(undefined, { type: "unknown" });

    expect(state.items).toEqual([]);
    expect(state.status).toBe("idle");
    expect(state.error).toBeNull();
  });

  it("should handle addTask fulfilled", () => {
    const initialState = {
      items: [],
      status: "idle",
      error: null,
    };

    const action = {
      type: "tasks/add/fulfilled",
      payload: { id: 1, title: "Test task" },
    };

    const state = tasksReducer(initialState, action);

    expect(state.items.length).toBe(1);
    expect(state.items[0].title).toBe("Test task");
  });

  it("should handle deleteTask fulfilled", () => {
    const initialState = {
      items: [{ id: 1, title: "Test task" }],
      status: "idle",
      error: null,
    };

    const action = {
      type: "tasks/delete/fulfilled",
      payload: 1,
    };

    const state = tasksReducer(initialState, action);

    expect(state.items.length).toBe(0);
  });
});