import { Link, useLocation } from "react-router-dom";

const navLinkClass =
  "rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600";
const activeLinkClass = "bg-blue-50 text-blue-700";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[72rem] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-200">
            D
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-900">
              DocMeet
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
              Smart Care Access
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1 shadow-sm">
          <Link
            to="/login"
            className={`${navLinkClass} ${
              location.pathname === "/login" ? activeLinkClass : ""
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`${navLinkClass} ${
              location.pathname === "/register" ? activeLinkClass : ""
            }`}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
