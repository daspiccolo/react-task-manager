import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";

import authReducer from "../features/auth/authSlice";
import tasksReducer from "../features/tasks/tasksSlice";

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    route = "/dashboard",
    store = configureStore({
      reducer: { auth: authReducer, tasks: tasksReducer },
      preloadedState,
    }),
  } = {}
) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    ),
  };
}