import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import Avatar from "./Avatar";

const UserAvatar = ({ name }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-2 py-1.5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Avatar src={user?.profileImage} size={42} alt={name || "User"} />

        <div className="hidden text-left sm:block">
          <p className="max-w-[140px] truncate text-sm font-semibold text-slate-800">
            {name || "Doctor"}
          </p>
          <p className="text-xs font-medium text-slate-400">Profile Menu</p>
        </div>

        <span
          className={`hidden text-slate-400 transition sm:block ${
            open ? "rotate-180" : ""
          }`}
        >
          <FiChevronDown size={16} />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl z-50">
          <div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 to-cyan-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <Avatar src={user?.profileImage} size={54} alt={name || "User"} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {name || "Doctor"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email || "DocMeet Account"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FiUser size={18} />
              </span>
              <span>
                <span className="block font-semibold text-slate-800">Profile</span>
                <span className="block text-xs text-slate-500">
                  View and update your account
                </span>
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-rose-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <FiLogOut size={18} />
              </span>
              <span>
                <span className="block font-semibold text-slate-800">Logout</span>
                <span className="block text-xs text-slate-500">
                  Sign out from this account
                </span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
