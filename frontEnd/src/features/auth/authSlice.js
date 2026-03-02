import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

const saved = localStorage.getItem("user");

const initialState = {
  user: saved ? JSON.parse(saved) : null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const res = await api.get("/users");

    const user = res.data.find(
      (u) =>
        String(u.email).trim().toLowerCase() === String(email).trim().toLowerCase() &&
        String(u.password).trim() === String(password).trim()
    );

    if (!user) throw new Error("Invalid email or password");
    return user;
  }
);
export const register = createAsyncThunk("auth/register", async ({ name, email, password }) => {
  // check if email already exists
 const existing = await api.get("/users");
const exists = existing.data.some(
  (u) => String(u.email).trim().toLowerCase() === String(email).trim().toLowerCase()
);
if (exists) throw new Error("Email already registered");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;