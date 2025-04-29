// src/app/verifier/layout.js

import { VerifierSidebar } from '../../components/VerifierSidebar';

export default function VerifierLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Verifier Sidebar */}
      <VerifierSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-100">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
