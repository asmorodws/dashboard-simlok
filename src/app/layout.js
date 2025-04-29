// src/app/layout.js

import './globals.css'; // Import global styles

export const metadata = {
  title: 'Dashboard System',
  description: 'A professional dashboard system for vendors and verifiers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
