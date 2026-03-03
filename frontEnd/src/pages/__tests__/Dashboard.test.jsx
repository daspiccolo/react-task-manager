import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Dashboard from "../Dashboard";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../features/tasks/tasksSlice", async () => {
  const actual = await vi.importActual("../../features/tasks/tasksSlice");
  return {
    ...actual,
    fetchTasks: () => ({ type: "tasks/fetch" }),
  };
});

describe("Dashboard", () => {
  it("renders for a logged-in user", () => {
    renderWithProviders(<Dashboard />, {
      preloadedState: {
        auth: { user: { id: "1", name: "Test User" }, status: "idle", error: null },
        tasks: { items: [], status: "idle", error: null },
      },
    });

    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: /sign out/i }).length).toBeGreaterThan(0);

    // name may appear in multiple places (sidebar + header), that's fine
    expect(screen.getAllByText(/test user/i).length).toBeGreaterThan(0);
  });
});