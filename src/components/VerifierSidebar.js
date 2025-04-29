// src/components/VerifierSidebar.js

import Link from 'next/link';

export function VerifierSidebar() {
  return (
    <div className="w-64 bg-slate-800 text-white h-full">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">SIMLok Online</h1>
      </div>
      <nav className="mt-6">
        <ul>
          <li>
            <Link href="/verifier/dashboard" className="flex items-center px-4 py-3 text-lg hover:bg-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Dashboard
            </Link>
          </li>
         
        </ul>
      </nav>
    </div>
  );
}
