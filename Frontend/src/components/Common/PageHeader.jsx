import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="mb-2 text-2xl font-medium tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;
