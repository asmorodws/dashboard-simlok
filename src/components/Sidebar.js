// src/components/Sidebar.js

import Link from 'next/link';

export function Sidebar() {
  return (
    <div className="w-64 bg-blue-900 text-white h-full">
      <div className="p-6 text-2xl font-bold">Dashboard</div>
      <nav className="mt-10">
        <ul>
          <li>
            <Link href="/vendor/dashboard" className="block px-4 py-2 text-lg hover:bg-blue-700">
              Vendor Dashboard
            </Link>
          </li>
          <li>
            <Link href="/verifier/dashboard" className="block px-4 py-2 text-lg hover:bg-blue-700">
              Verifier Dashboard
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}