import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCalendar, FiHome, FiLogOut } from "react-icons/fi";
import UserAvatar from "../components/UserAvatar";

const DoctorNavbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/60 bg-white/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-blue-200">
              D
            </span>
            <div className="text-left">
              <p className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Doctor Panel
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                DocMeet Workspace
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 md:flex">
            <FiHome className="text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Welcome, Dr. {user.name || "Doctor"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-600 md:flex"
          >
            <FiCalendar size={16} />
            Appointments
          </button>

          <div className="flex items-center justify-center h-full">
            <div >
              <UserAvatar name={user?.name} />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
