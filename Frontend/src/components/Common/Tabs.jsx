import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      <div className="relative border-b-2 border-slate-100">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative px-2 pb-4 text-sm font-semibold transition-all duration-200 md:px-6 ${
                activeTab === tab.name
                  ? "text-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.name && (
                <div className="bg-lienar-to-r absolute right-0 bottom-0 left-0 h-0.5 rounded-full from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25" />
              )}
              {activeTab === tab.name && (
                <div className="absolute inset-0 -z-10 rounded-t-xl bg-linear-to-b from-emerald-50/50 to-transparent" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6">
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div key={tab.name} className="animate-in fade-in duration-300">
                {tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
