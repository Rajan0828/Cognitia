import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 5) {
      setError("Username must be at least 5 characters long.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await authService.register(username, email, password);
      toast.success("Registered successfully. Please login.");
      navigate("/login");
    } catch (error) {
      setError(error.message || "Failed to register. Please try again.");
      toast.error(error.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30" />
      <div className="relative w-full max-w-md px-6">
        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-10 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          {/* HEADER */}
          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
              <BrainCircuit className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <h1 className="mb-2 text-2xl font-medium tracking-tight text-slate-900">
              Create an account
            </h1>
            <p className="text-sm text-slate-500">
              Start your AI-powered learning experience
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-5">
            {/* USERNAME FIELD */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wide text-slate-700 uppercase">
                Username
              </label>
              <div className="group relative">
                <div
                  className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-200 ${
                    focusedField === "username"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                >
                  <User className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pr-4 pl-12 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10 focus:outline-none"
                  placeholder="Username"
                />
              </div>
            </div>
            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wide text-slate-700 uppercase">
                Email
              </label>
              <div className="group relative">
                <div
                  className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-200 ${
                    focusedField === "email"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                >
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pr-4 pl-12 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10 focus:outline-none"
                  placeholder="Email"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-wide text-slate-700 uppercase">
                Password
              </label>
              <div className="group relative">
                <div
                  className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 transition-colors duration-200 ${
                    focusedField === "password"
                      ? "text-emerald-500"
                      : "text-slate-400"
                  }`}
                >
                  <Lock className="h-5 w-5" strokeWidth={2} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="h-12 w-full rounded-xl border-2 border-slate-200 bg-slate-50/50 pr-4 pl-12 text-sm font-medium text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-center text-xs font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group relative h-12 w-full overflow-hidden rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={2.5}
                    />
                  </>
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </div>
          {/* FOOTER */}
          <div className="mt-8 border-t border-slate-200/60 pt-6">
            <p className="text-center text-sm text-slate-600">
              Already have an account?
              <Link
                to="/login"
                className="font-semibold text-slate-900 transition-colors duration-200 hover:text-emerald-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
        {/* SUBTLE FOOTER TEXT */}
        <p className="mt-6 text-center text-xs text-slate-400">
          By continuing, you agree to our{" "}
          <Link
            to=""
            className="font-medium text-slate-600 transition-colors duration-200 hover:text-emerald-700"
          >
            User Agreement
          </Link>{" "}
          and{" "}
          <Link
            to=""
            className="font-medium text-slate-600 transition-colors duration-200 hover:text-emerald-700"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
