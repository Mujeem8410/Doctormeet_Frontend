import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCalendar, FiHome, FiLogOut, FiSearch } from "react-icons/fi";
import UserAvatar from "../components/UserAvatar";

const navItemClass =
  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600";
const activeNavItemClass = "bg-blue-50 text-blue-700";

const PatientNavbar = () => {
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
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/patient/dashboard")}
          className="flex items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-500 text-lg font-bold text-white shadow-lg shadow-blue-200">
            P
          </span>
          <div className="text-left">
            <p className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              Patient Panel
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              DocMeet Care Hub
            </p>
          </div>
        </button>

        <div className="order-3 flex w-full items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-white/90 p-2 shadow-sm lg:order-2 lg:w-auto lg:justify-center">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 md:flex">
            <FiHome className="text-slate-500" />
            <span className="text-sm font-medium text-slate-600">
              Welcome, {user.name || "Patient"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <NavLink
              to="/patient/dashboard"
              className={({ isActive }) =>
                `${navItemClass} ${isActive ? activeNavItemClass : ""}`
              }
            >
              <FiSearch size={16} />
              Explore
            </NavLink>
            <NavLink
              to="/patient/dashboard"
              className={({ isActive }) =>
                `${navItemClass} ${isActive ? activeNavItemClass : ""}`
              }
            >
              <FiCalendar size={16} />
              Appointments
            </NavLink>
          </div>
        </div>

        <div className="order-2 flex items-center gap-3 lg:order-3">
          <UserAvatar name={user?.name} />
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

export default PatientNavbar;
