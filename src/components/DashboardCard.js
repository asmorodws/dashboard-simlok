// src/components/DashboardCard.js

export default function DashboardCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
