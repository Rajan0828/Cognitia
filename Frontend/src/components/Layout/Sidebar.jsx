import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  FileText,
  BrainCircuit,
  BookOpen,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { text: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { text: "Profile", icon: User, to: "/profile" },
    { text: "Documents", icon: FileText, to: "/documents" },
    { text: "Flashcards", icon: BookOpen, to: "/flashcards" },
  ];
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 md:hidden ${isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 border-r border-slate-200/60 bg-white/90 backdrop-blur-lg transition-transform duration-300 ease-in-out md:relative md:flex md:w-64 md:shrink-0 md:translate-x-0 md:flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* LOGO AND CLOSE BUTTON FOR MOBILE */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200/60 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-emerald-500/20">
              <BrainCircuit
                className="text-white"
                size={20}
                strokeWidth={2.5}
              />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900 md:text-base">
              Cognitia
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-slate-500 hover:text-slate-800 md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`}
                  />
                  {link.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT SECTION */}
        <div className="border-t border-slate-200/60 px-3 py-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut
              size={18}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
