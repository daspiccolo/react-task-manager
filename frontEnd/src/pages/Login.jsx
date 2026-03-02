import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((s) => s.auth);

  const { register: rf, handleSubmit } = useForm({
    defaultValues: { email: "test@test.com", password: "123456" },
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const onSubmit = async (data) => {
  try {
    await dispatch(login(data)).unwrap();
    navigate("/dashboard");
  } catch (e) {
    // erro já vai para o redux (state.error)
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md border">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="text-slate-600 mt-1">Sign in to manage your tasks.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-700">Email</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              {...rf("email", { required: true })}
            />
          </div>

          <div>
            <label className="text-sm text-slate-700">Password</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              {...rf("password", { required: true })}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            disabled={status === "loading"}
            className="w-full rounded-xl bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {status === "loading" ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
           Don’t have an account?{" "}
          <Link className="text-blue-600 hover:underline" to="/register">
             Create one
          </Link>
        </p>
      </div>
    </div>
  );
}