import { useState } from "react";
import API from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "../AuPublic/Navbar";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

window.onload = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");
  const currentPath = window.location.pathname;

  if (currentPath === "/login") {
    if (user && token && loginTime) {
      const now = Date.now();
      const MAX_SESSION_DURATION = 48 * 60 * 60 * 1000;
      const role = JSON.parse(user).role;

      if (now - loginTime <= MAX_SESSION_DURATION) {
        window.location.href = `/${role}/dashboard`;
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");
      }
    }
  }
};

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[15px] text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";
  const sectionClass = "rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("loginTime", Date.now());

      toast.success("Login successful!");

      if (res.data.user.role === "patient") navigate("/patient/dashboard");
      else if (res.data.user.role === "doctor") navigate("/doctor/dashboard");
      else if (res.data.user.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed ";
      toast.error(msg);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-4 pb-8 pt-20 sm:px-5 lg:px-6 mt-14">
        <div className="mx-auto max-w-[52rem]">
          <div className="overflow-hidden rounded-[22px] border border-white/60 bg-white/90 shadow-2xl backdrop-blur">
            <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
              <div className="bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500 p-5 text-white lg:p-6">
                <div className="mb-4 inline-flex rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-semibold">
                  Welcome Back
                </div>
                <h2 className="text-[1.75rem] font-bold leading-tight lg:text-[1.9rem]">
                  Sign in to DocMeet
                </h2>
                <p className="mt-3 text-sm leading-6 text-blue-50">
                  Access appointments, patient records, clinic schedules, and
                  your personalized dashboard from one clean login screen.
                </p>

                <div className="mt-5 space-y-2.5">
                  <div className="rounded-xl border border-white/40 bg-white/20 px-3.5 py-2.5">
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                      Fast Access
                    </p>
                    <p className="mt-1 text-sm font-semibold">Login in seconds</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5">
                    <p className="text-xs uppercase tracking-[0.2em] text-blue-100">
                      Secure Session
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Protected account access for patients and doctors
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 sm:text-xl">Login</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Enter your credentials to continue to your account.
                    </p>
                  </div>

                  <div className={sectionClass}>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Account Credentials
                    </h4>

                    <div className="space-y-3.5">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-3">
                          <label className="block text-sm font-medium text-slate-700">
                            Password
                          </label>
                          <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            Forgot Password?
                          </Link>
                        </div>

                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={`${inputClass} pr-12`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-blue-600"
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <FiEyeOff size={18} />
                            ) : (
                              <FiEye size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-200 hover:bg-blue-700"
                  >
                    Login
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    New to DocMeet?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
