import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={toggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:block"></div>
        <div className="flex items-center gap-3">
          <button className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900">
            <Bell
              size={20}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </button>

          {/* USER PROFILE */}
          <div className="flex items-center gap-3 border-l border-slate-200/60 pl-3">
            <div className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-1.5 transition-colors duration-200 hover:bg-slate-50">
              <div className="group flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/20 transition-shadow duration-200 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                <User size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || "Email"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
