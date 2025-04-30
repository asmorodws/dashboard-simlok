// src/app/page.js

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-100">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">Welcome to SIMLok Online</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <Link href="/vendor/dashboard" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">Vendor Dashboard</h2>
            <p className="text-slate-600">Access your vendor dashboard to manage submissions and track their status.</p>
            <div className="mt-6 flex justify-end">
              <span className="text-slate-800 font-medium flex items-center">
                Access
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
        
        <Link href="/verifier/dashboard" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">HSE Officer Dashboard</h2>
            <p className="text-slate-600">Access your HSE Officer to review and process vendor submissions.</p>
            <div className="mt-6 flex justify-end">
              <span className="text-slate-800 font-medium flex items-center">
                Access
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>
      
      {/* <footer className="mt-12 text-slate-500 text-center">
        <p>© 2023 Dashboard System. All rights reserved.</p>
      </footer> */}
    </div>
  );
}
