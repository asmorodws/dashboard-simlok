// src/app/vendor/layout.js

import { DashboardSidebar } from '../../components/DashboardSidebar';

export default function VendorLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Vendor Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-100">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
