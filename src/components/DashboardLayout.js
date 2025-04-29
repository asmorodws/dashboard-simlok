// src/components/DashboardLayout.js

export default function DashboardLayout({ children }) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    );
  }
  